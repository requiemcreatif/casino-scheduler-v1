import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  siblingsCount?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showSummary?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  siblingsCount = 1,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
  showSummary = true,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Calculate range around current page
    const leftSiblingIndex = Math.max(2, currentPage - siblingsCount);
    const rightSiblingIndex = Math.min(
      totalPages - 1,
      currentPage + siblingsCount
    );

    // Add dots indicator or page numbers
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (shouldShowLeftDots) {
      pageNumbers.push("leftDots");
    } else {
      // Fill in pages between 1 and leftSiblingIndex
      for (let i = 2; i < leftSiblingIndex; i++) {
        pageNumbers.push(i);
      }
    }

    // Add page numbers around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i);
    }

    if (shouldShowRightDots) {
      pageNumbers.push("rightDots");
    } else {
      // Fill in pages between rightSiblingIndex and last page
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    // Always show last page if there's more than one page
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Calculate the range of items currently being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // Render a page button
  const renderPageButton = (pageNumber: number | string, index: number) => {
    // Handle dots
    if (pageNumber === "leftDots" || pageNumber === "rightDots") {
      return (
        <span
          key={`dots-${index}`}
          className="px-2 py-1 text-gray-500 dark:text-gray-400"
        >
          ...
        </span>
      );
    }

    // Handle numbered page buttons
    const isActive = currentPage === pageNumber;

    return (
      <button
        key={`page-${pageNumber}`}
        onClick={() => handlePageChange(pageNumber as number)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative inline-flex items-center justify-center min-w-[2rem] px-2 py-1 text-sm font-medium rounded-md",
          "focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
          isActive
            ? "z-10 bg-indigo-600 text-white dark:bg-indigo-700"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
        aria-label={`Go to page ${pageNumber}`}
      >
        {pageNumber}
      </button>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3",
        className
      )}
    >
      {/* Page size selector and summary */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {onPageSizeChange && (
          <div className="flex items-center text-sm">
            <span className="text-gray-700 dark:text-gray-300 mr-2">Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {showSummary && totalItems > 0 && (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </div>
        )}
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center space-x-1">
        {/* First page button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            "relative inline-flex items-center p-1 rounded-md",
            "focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
            currentPage === 1
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          aria-label="Go to first page"
        >
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        </button>

        {/* Previous page button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "relative inline-flex items-center p-1 rounded-md",
            "focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
            currentPage === 1
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {/* Page number buttons */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNumber, index) =>
            renderPageButton(pageNumber, index)
          )}
        </div>

        {/* Next page button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={cn(
            "relative inline-flex items-center p-1 rounded-md",
            "focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
            currentPage === totalPages || totalPages === 0
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          aria-label="Go to next page"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={cn(
            "relative inline-flex items-center p-1 rounded-md",
            "focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
            currentPage === totalPages || totalPages === 0
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          aria-label="Go to last page"
        >
          <ChevronDoubleRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
