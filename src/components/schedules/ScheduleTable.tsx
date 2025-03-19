"use client";

import React from "react";
import { RotationSlot } from "@/app/types";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ClockIcon,
  UserIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

interface ScheduleTableProps {
  schedule: RotationSlot[][];
  shiftName: string;
  isLoading?: boolean;
}

export const ScheduleTableSkeleton: React.FC<{ shiftName?: string }> = ({
  shiftName = "Loading",
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4 px-6 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
          <CardTitle className="text-lg font-semibold capitalize text-gray-600 dark:text-gray-300">
            {shiftName} Shift Schedule
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-medium py-3 min-w-[150px]">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                  </div>
                </TableHead>
                {[...Array(5)].map((_, index) => (
                  <TableHead
                    key={index}
                    className="font-medium py-3 min-w-[120px] text-center"
                  >
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-3 w-16 mb-1 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-20 dark:bg-gray-700" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(4)].map((_, presenterIndex) => (
                <TableRow
                  key={presenterIndex}
                  className={
                    presenterIndex % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  <TableCell className="font-medium border-r border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                        <Skeleton className="h-5 w-5 rounded-full dark:bg-gray-600" />
                      </div>
                      <Skeleton className="h-4 w-24 dark:bg-gray-700" />
                    </div>
                  </TableCell>
                  {[...Array(5)].map((_, slotIndex) => (
                    <TableCell key={slotIndex} className="text-center">
                      {slotIndex % 3 === 0 ? (
                        <Skeleton className="h-6 w-16 mx-auto dark:bg-gray-700" />
                      ) : slotIndex % 3 === 1 ? (
                        <div className="flex flex-col items-center">
                          <Skeleton className="h-4 w-4 mb-1 rounded-full dark:bg-gray-700" />
                          <Skeleton className="h-4 w-16 dark:bg-gray-700" />
                        </div>
                      ) : (
                        <Skeleton className="h-4 w-10 mx-auto dark:bg-gray-700" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedule,
  shiftName,
  isLoading = false,
}) => {
  if (isLoading) {
    return <ScheduleTableSkeleton shiftName={shiftName} />;
  }

  const getShiftColor = () => {
    switch (shiftName.toLowerCase()) {
      case "morning":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300";
      case "afternoon":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300";
      case "night":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-800 dark:text-purple-300";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getAssignmentStyle = (assignment: string) => {
    if (assignment === "Break") {
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium";
    } else if (assignment.startsWith("Table")) {
      return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300";
    } else {
      return "bg-white dark:bg-gray-900";
    }
  };

  if (!schedule.length) {
    return (
      <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ClockIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1 capitalize">
            No {shiftName} Schedule Available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            No schedule data is currently available for the {shiftName} shift.
            Check back later or contact a manager.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract all time slots from the first presenter's schedule
  const timeSlots = schedule[0].map((slot) => ({
    time: `${slot.time} - ${slot.endTime}`,
    startHour: parseInt(slot.time.split(":")[0]),
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader className={`py-4 px-6 ${getShiftColor()}`}>
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg font-semibold capitalize">
            {shiftName} Shift Schedule
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <TableHead className="font-medium py-3 min-w-[150px]">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>Presenter</span>
                  </div>
                </TableHead>
                {timeSlots.map((timeSlot, index) => (
                  <TableHead
                    key={index}
                    className="font-medium py-3 min-w-[120px] text-center"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Slot {index + 1}
                      </span>
                      <span className="text-sm font-medium">
                        {timeSlot.time}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((presenterSlots, presenterIndex) => (
                <TableRow
                  key={presenterIndex}
                  className={
                    presenterIndex % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  }
                >
                  <TableCell className="font-medium border-r border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm mr-2">
                        {(
                          presenterSlots[0]?.presenterName ||
                          `P${presenterIndex + 1}`
                        ).charAt(0)}
                      </div>
                      <span className="dark:text-gray-200">
                        {presenterSlots[0]?.presenterName ||
                          `Presenter ${presenterIndex + 1}`}
                      </span>
                    </div>
                  </TableCell>
                  {presenterSlots.map((slot, slotIndex) => (
                    <TableCell
                      key={slotIndex}
                      className={`text-center ${getAssignmentStyle(
                        slot.assignment
                      )}`}
                    >
                      {slot.assignment === "Break" ? (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3"
                        >
                          Break
                        </Badge>
                      ) : slot.assignment.startsWith("Table") ? (
                        <div className="flex flex-col items-center">
                          <TableCellsIcon className="h-4 w-4 text-indigo-500 dark:text-indigo-400 mb-1" />
                          <span className="font-medium text-indigo-700 dark:text-indigo-300">
                            {slot.assignment}
                          </span>
                        </div>
                      ) : (
                        <span className="dark:text-gray-300">
                          {slot.assignment}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
