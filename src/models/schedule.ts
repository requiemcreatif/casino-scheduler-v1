import {
  Presenter,
  Table,
  RotationSlot,
  DailySchedule,
  Shift,
} from "../app/types";
// Constants for scheduling
const SLOT_DURATION_MINUTES = 20;
const SHIFT_DURATION_HOURS = 8;
const SLOTS_PER_SHIFT = (SHIFT_DURATION_HOURS * 60) / SLOT_DURATION_MINUTES;

// Helper to generate time slots for each shift
const generateTimeSlots = (shift: Shift): string[] => {
  const slots: string[] = [];

  let startHour = 0;
  switch (shift) {
    case "morning":
      startHour = 7;
      break;
    case "afternoon":
      startHour = 15;
      break;
    case "night":
      startHour = 23;
      break;
  }

  for (let i = 0; i < SLOTS_PER_SHIFT; i++) {
    const hour = Math.floor(startHour + (i * SLOT_DURATION_MINUTES) / 60) % 24;
    const minute = (i * SLOT_DURATION_MINUTES) % 60;

    const hourStr = hour.toString().padStart(2, "0");
    const minuteStr = minute.toString().padStart(2, "0");

    slots.push(`${hourStr}:${minuteStr}`);
  }

  return slots;
};

// Generate the next time slot
const getNextTime = (time: string): string => {
  const [hour, minute] = time.split(":").map(Number);

  let newMinute = minute + SLOT_DURATION_MINUTES;
  let newHour = hour;

  if (newMinute >= 60) {
    newHour = (hour + 1) % 24;
    newMinute = newMinute % 60;
  }

  return `${newHour.toString().padStart(2, "0")}:${newMinute
    .toString()
    .padStart(2, "0")}`;
};

// Generate rotation schedule for a shift
export const generateShiftSchedule = (
  presenters: Presenter[],
  tables: Table[],
  shift: Shift
): RotationSlot[][] => {
  // Filter presenters for the current shift
  const shiftPresenters = presenters.filter(
    (p) => p.active && p.shift === shift
  );

  // Filter active tables
  const activeTables = tables.filter((t) => t.active);

  if (activeTables.length === 0 || shiftPresenters.length === 0) {
    return [];
  }

  // Generate time slots for this shift
  const timeSlots = generateTimeSlots(shift);

  // Initialize rotation schedule
  const schedule: RotationSlot[][] = [];
  for (let i = 0; i < shiftPresenters.length; i++) {
    schedule.push([]);
  }

  /* Handle case where we have fewer presenters than tables
  This approach prioritizes tables with lower numbers and ensures breaks
  For example, with 4 presenters and 8 tables, we'll schedule tables 1, 2, and 3 (4-1=3)
  This meets the requirement of having a game presenter at every included table at all times */
  let tablesInRotation = activeTables;
  if (shiftPresenters.length < activeTables.length) {
    // If we have insufficient presenters, prioritize tables with lower numbers (assumed to be more important)
    const sortedTables = [...activeTables].sort((a, b) => a.number - b.number);

    // Only include as many tables as we have presenters
    // We need at least one break in rotation, so use presenters.length - 1 tables
    const maxTables = Math.max(1, shiftPresenters.length - 1);
    tablesInRotation = sortedTables.slice(0, maxTables);

    // Log which tables are included in rotation
    // const includedTableNumbers = tablesInRotation
    //   .map((t) => t.number)
    //   .join(", ");
    // const excludedTableNumbers = sortedTables
    //   .slice(maxTables)
    //   .map((t) => t.number)
    //   .join(", ");

    // console.log(
    //   `${shift} shift: Using ${maxTables} tables out of ${activeTables.length} due to limited presenters`
    // );
    //console.log(`${shift} shift: Including tables: ${includedTableNumbers}`);
    // if (excludedTableNumbers) {
    //   console.log(`${shift} shift: Excluding tables: ${excludedTableNumbers}`);
    // }
  }

  // Assign presenters to tables and breaks for each time slot
  for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
    const currentTime = timeSlots[slotIndex];
    const nextTime =
      slotIndex < timeSlots.length - 1
        ? timeSlots[slotIndex + 1]
        : getNextTime(currentTime);

    // For each presenter, determine their assignment for this time slot
    for (
      let presenterIndex = 0;
      presenterIndex < shiftPresenters.length;
      presenterIndex++
    ) {
      const presenter = shiftPresenters[presenterIndex];

      // Calculate position in rotation
      const positionInRotation =
        (presenterIndex + slotIndex) % (tablesInRotation.length + 1);

      // Determine assignment based on position
      let assignment = "Break";
      if (positionInRotation < tablesInRotation.length) {
        assignment = `Table ${tablesInRotation[positionInRotation].number}`;
      }

      // Add slot to schedule
      schedule[presenterIndex].push({
        time: currentTime,
        endTime: nextTime,
        presenterId: presenter.id,
        presenterName: presenter.name,
        assignment,
      });
    }
  }

  return schedule;
};

// Generate a complete daily schedule
export const generateDailySchedule = (
  presenters: Presenter[],
  tables: Table[]
): DailySchedule => {
  return {
    morning: generateShiftSchedule(presenters, tables, "morning"),
    afternoon: generateShiftSchedule(presenters, tables, "afternoon"),
    night: generateShiftSchedule(presenters, tables, "night"),
  };
};
