"use client";

import React, { useState, useEffect } from "react";
import { Presenter, Table, DailySchedule } from "@/app/types";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScheduleTable } from "@/components/schedules/ScheduleTable";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { generateDailySchedule } from "@/models/schedule";

export default function SchedulesPage() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [schedule, setSchedule] = useState<DailySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch presenters and tables in parallel
      const [presentersData, tablesData] = await Promise.all([
        api.presenters.getAll(),
        api.tables.getAll(),
      ]);

      setPresenters(presentersData);
      setTables(tablesData);

      // Generate schedule based on the fetched data
      try {
        const dailySchedule = generateDailySchedule(presentersData, tablesData);
        setSchedule(dailySchedule);
        setError(null);
      } catch (scheduleError: any) {
        console.error("Failed to generate schedule:", scheduleError);
        setError(
          `Failed to generate schedule: ${
            scheduleError.message || "Unknown error"
          }`
        );
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Count presenters by shift
  const presentersByShift = presenters.reduce(
    (acc, presenter) => {
      if (presenter.active) {
        acc[presenter.shift]++;
      }
      return acc;
    },
    { morning: 0, afternoon: 0, night: 0 }
  );

  // Count active tables
  const activeTablesCount = tables.filter((table) => table.active).length;

  // Helper function to get shift-based styling
  const getShiftCardStyle = (shift: string) => {
    switch (shift) {
      case "morning":
        return "border-t-4 border-blue-500 dark:border-blue-600";
      case "afternoon":
        return "border-t-4 border-yellow-500 dark:border-yellow-600";
      case "night":
        return "border-t-4 border-purple-500 dark:border-purple-600";
      default:
        return "";
    }
  };

  return (
    <div>
      <PageHeader title="Game Presenter Rotation Schedule " />

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 text-sm">
        <p className="text-blue-700 dark:text-blue-300 mb-2">
          <strong>Scheduling Policy:</strong> When there aren't enough
          presenters for a shift, tables with lower numbers are prioritized.
        </p>
        <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300">
          <li>
            Each shift requires at least 1 presenter per table, plus 1 for
            breaks
          </li>
          <li>
            With fewer presenters, we prioritize tables 1, 2, 3, etc. in
            ascending order
          </li>
          <li>
            For example, with 4 presenters we can staff 3 tables with breaks
            (4-1=3)
          </li>
          <li>
            Each presenter gets at least one 20-minute break during their shift
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className={`shadow-sm ${getShiftCardStyle("morning")}`}>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-400">
              Morning Shift
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Presenters: {presentersByShift.morning}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Tables: {activeTablesCount}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Ideal presenters: {activeTablesCount + 1}
              {presentersByShift.morning < activeTablesCount && (
                <span className="text-yellow-500 dark:text-yellow-400 ml-2">
                  (Using {Math.max(1, presentersByShift.morning - 1)} tables)
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card className={`shadow-sm ${getShiftCardStyle("afternoon")}`}>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2 text-yellow-700 dark:text-yellow-400">
              Afternoon Shift
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Presenters: {presentersByShift.afternoon}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Tables: {activeTablesCount}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Ideal presenters: {activeTablesCount + 1}
              {presentersByShift.afternoon < activeTablesCount && (
                <span className="text-yellow-500 dark:text-yellow-400 ml-2">
                  (Using {Math.max(1, presentersByShift.afternoon - 1)} tables)
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card className={`shadow-sm ${getShiftCardStyle("night")}`}>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-400">
              Night Shift
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Presenters: {presentersByShift.night}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Tables: {activeTablesCount}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Ideal presenters: {activeTablesCount + 1}
              {presentersByShift.night < activeTablesCount && (
                <span className="text-yellow-500 dark:text-yellow-400 ml-2">
                  (Using {Math.max(1, presentersByShift.night - 1)} tables)
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-48 w-full dark:bg-gray-800" />
          <Skeleton className="h-48 w-full dark:bg-gray-800" />
          <Skeleton className="h-48 w-full dark:bg-gray-800" />
        </div>
      ) : schedule ? (
        <div className="space-y-8">
          <ScheduleTable schedule={schedule.morning} shiftName="morning" />
          <ScheduleTable schedule={schedule.afternoon} shiftName="afternoon" />
          <ScheduleTable schedule={schedule.night} shiftName="night" />
        </div>
      ) : (
        <Alert variant="destructive">
          Unable to generate schedule. Please make sure you have enough
          presenters for each shift.
        </Alert>
      )}
    </div>
  );
}
