"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Presenter, Table } from "@/app/types";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/AuthProvider";
import {
  UserGroupIcon,
  Squares2X2Icon,
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const SkeletonCard = () => (
  <Card className="overflow-hidden shadow-md">
    <CardContent className="p-6 flex items-center">
      <div className="rounded-full bg-gray-200 dark:bg-gray-700 p-3 mr-5">
        <Skeleton className="h-7 w-7" />
      </div>
      <div className="w-full">
        <Skeleton className="h-3 w-28 mb-2" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    </CardContent>
  </Card>
);

const SummaryCard = ({
  icon,
  iconBgClass,
  iconColorClass,
  title,
  value,
  subtitle,
  subtitleHighlight,
}: {
  icon: React.ReactElement<any>;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  subtitleHighlight?: React.ReactNode;
}) => (
  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6 flex items-center">
      <div className={`rounded-full ${iconBgClass} p-3 mr-5 shadow-sm`}>
        {React.cloneElement(icon, {
          className: `h-7 w-7 ${iconColorClass}`,
          "aria-hidden": true,
        })}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitleHighlight && (
              <span className="text-green-600 dark:text-green-400 font-medium">
                {subtitleHighlight}
              </span>
            )}{" "}
            {subtitle}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

const ShiftCard = ({
  title,
  color,
  borderColor,
  titleColor,
  value,
  percentage,
  barColor,
}: {
  title: string;
  color: string;
  borderColor: string;
  titleColor: string;
  value: number;
  percentage: number;
  barColor: string;
}) => (
  <Card className={`overflow-hidden shadow-md border-t-4 ${borderColor}`}>
    <CardContent className="p-6">
      <h3 className={`font-bold text-lg mb-2 ${titleColor}`}>{title}</h3>
      <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-1">
        {value}
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        {percentage || 0}% of total
      </p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-4">
        <div
          className={`${barColor} h-2.5 rounded-full`}
          style={{
            width: `${percentage || 0}%`,
          }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        Active presenters only
      </p>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

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
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
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

  const totalPresenters = presenters.length;
  const activePresenters = presenters.filter((p) => p.active).length;

  const totalTables = tables.length;
  const activeTables = tables.filter((t) => t.active).length;

  // Calculate shift percentages
  const morningPercentage =
    Math.round((presentersByShift.morning / activePresenters) * 100) || 0;
  const afternoonPercentage =
    Math.round((presentersByShift.afternoon / activePresenters) * 100) || 0;
  const nightPercentage =
    Math.round((presentersByShift.night / activePresenters) * 100) || 0;

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <Skeleton className="h-10 w-1/3 mb-3" />
          <Skeleton className="h-5 w-2/3" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>

        {/* Shift Distribution Skeleton */}
        <div className="mb-10">
          <div className="flex items-center mb-5">
            <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded mr-2 h-7 w-7">
              <Skeleton className="h-5 w-5" />
            </div>
            <Skeleton className="h-5 w-1/4" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {["blue", "yellow", "purple"].map((color, index) => (
              <Card
                key={index}
                className={`overflow-hidden shadow-md border-t-4 border-gray-200 dark:border-gray-700`}
              >
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-1/2 mb-3" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2" />
                  <Skeleton className="h-3 w-16 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mb-10">
          <div className="flex items-center mb-5">
            <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded mr-2 h-7 w-7">
              <Skeleton className="h-5 w-5" />
            </div>
            <Skeleton className="h-5 w-1/5" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-auto py-5 px-4 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md shadow-sm"
              >
                <Skeleton className="h-7 w-7 mb-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Welcome back,{" "}
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            {user?.username}
          </span>
          ! Here's an overview of your casino scheduling system.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <SummaryCard
          icon={<UserGroupIcon />}
          iconBgClass="bg-indigo-100 dark:bg-indigo-900/30"
          iconColorClass="text-indigo-600 dark:text-indigo-400"
          title="Total Presenters"
          value={totalPresenters}
          subtitleHighlight={activePresenters}
          subtitle="active"
        />

        <SummaryCard
          icon={<Squares2X2Icon />}
          iconBgClass="bg-emerald-100 dark:bg-emerald-900/30"
          iconColorClass="text-emerald-600 dark:text-emerald-400"
          title="Casino Tables"
          value={totalTables}
          subtitleHighlight={activeTables}
          subtitle="active"
        />

        <SummaryCard
          icon={<ClockIcon />}
          iconBgClass="bg-blue-100 dark:bg-blue-900/30"
          iconColorClass="text-blue-600 dark:text-blue-400"
          title="Rotation Time"
          value={
            <>
              20 <span className="text-lg">min</span>
            </>
          }
          subtitle="Fixed rotation interval"
        />
      </div>

      {/* Shift Distribution */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 p-1 rounded mr-2">
            <UserGroupIcon className="h-5 w-5 inline" />
          </span>
          Presenter Shift Distribution
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <ShiftCard
            title="Morning Shift"
            color="blue"
            borderColor="border-blue-500"
            titleColor="text-blue-700 dark:text-blue-400"
            value={presentersByShift.morning}
            percentage={morningPercentage}
            barColor="bg-blue-600"
          />

          <ShiftCard
            title="Afternoon Shift"
            color="yellow"
            borderColor="border-yellow-500"
            titleColor="text-yellow-700 dark:text-yellow-400"
            value={presentersByShift.afternoon}
            percentage={afternoonPercentage}
            barColor="bg-yellow-500"
          />

          <ShiftCard
            title="Night Shift"
            color="purple"
            borderColor="border-purple-500"
            titleColor="text-purple-700 dark:text-purple-400"
            value={presentersByShift.night}
            percentage={nightPercentage}
            barColor="bg-purple-600"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 p-1 rounded mr-2">
            <CalendarIcon className="h-5 w-5 inline" />
          </span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            onClick={() => router.push("/schedules")}
            variant="outline"
            className="h-auto py-5 px-4 flex flex-col items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            <CalendarIcon className="h-7 w-7 mb-3 text-indigo-600 dark:text-indigo-400" />
            <span>Generate Schedule</span>
          </Button>

          <Button
            onClick={() => router.push("/presenters/create")}
            variant="outline"
            className="h-auto py-5 px-4 flex flex-col items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <UserGroupIcon className="h-7 w-7 mb-3 text-green-600 dark:text-green-400" />
            <span>Add Presenter</span>
          </Button>

          <Button
            onClick={() => router.push("/tables/create")}
            variant="outline"
            className="h-auto py-5 px-4 flex flex-col items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Squares2X2Icon className="h-7 w-7 mb-3 text-blue-600 dark:text-blue-400" />
            <span>Add Table</span>
          </Button>

          <Button
            onClick={fetchData}
            variant="outline"
            className="h-auto py-5 px-4 flex flex-col items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ArrowPathIcon className="h-7 w-7 mb-3 text-purple-600 dark:text-purple-400" />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
