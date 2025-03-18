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

  // Calculate the ideal number of presenters per rotation (tables + 1 for a break)
  //const idealPresentersCount = activeTables.length + 1;

  // If we have fewer presenters than tables, we can't staff all tables
  if (shiftPresenters.length < activeTables.length) {
    throw new Error(
      `Not enough presenters for shift ${shift}. Need at least ${activeTables.length}.`
    );
  }

  // Generate time slots for this shift
  const timeSlots = generateTimeSlots(shift);

  // Initialize rotation schedule
  const schedule: RotationSlot[][] = [];
  for (let i = 0; i < shiftPresenters.length; i++) {
    schedule.push([]);
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
        (presenterIndex + slotIndex) % (activeTables.length + 1);

      // Determine assignment based on position
      let assignment = "Break";
      if (positionInRotation < activeTables.length) {
        assignment = `Table ${activeTables[positionInRotation].number}`;
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
