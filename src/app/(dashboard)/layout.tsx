"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/providers/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = ({ rows = 1, columns = 3 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: rows * columns }).map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className="h-48 w-full rounded-xl shadow-sm"
        />
      ))}
    </div>
  );
};

const DashboardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="py-6">{children}</div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <DashboardContainer>
        <DashboardSkeleton rows={1} columns={3} />
      </DashboardContainer>
    );
  }

  return <DashboardContainer>{children}</DashboardContainer>;
}
