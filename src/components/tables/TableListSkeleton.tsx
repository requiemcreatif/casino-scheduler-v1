import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const TableListSkeleton = () => {
  return (
    <div>
      <div className="mb-4">
        <Skeleton className="h-10 w-full max-w-md mb-4 bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="border rounded-lg overflow-hidden dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="font-medium">
                <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
              </TableHead>
              <TableHead className="font-medium">
                <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
              </TableHead>
              <TableHead className="font-medium">
                <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
              </TableHead>
              <TableHead className="font-medium">
                <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
              </TableHead>
              <TableHead className="text-right font-medium">
                <Skeleton className="h-4 w-16 ml-auto bg-gray-200 dark:bg-gray-700" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Skeleton className="h-5 w-8 bg-gray-200 dark:bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28 bg-gray-200 dark:bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-700" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-2 justify-end">
                    <Skeleton className="h-9 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-9 w-20 rounded-md bg-gray-200 dark:bg-gray-700" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
