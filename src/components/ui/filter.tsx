"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

export type FilterOption = {
  id: string;
  label: string;
  value: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray" | "indigo";
};

export type SortOption = {
  id: string;
  label: string;
  value: string;
};

interface FilterProps {
  onSearch?: (value: string) => void;
  onFilter?: (filters: string[]) => void;
  onSort?: (sort: string) => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  sortOptions?: SortOption[];
  showSearch?: boolean;
  showFilter?: boolean;
  showSort?: boolean;
  className?: string;
}

export function Filter({
  onSearch,
  onFilter,
  onSort,
  searchPlaceholder = "Search...",
  filterOptions = [],
  sortOptions = [],
  showSearch = true,
  showFilter = true,
  showSort = true,
  className = "",
}: FilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close filter dropdown if clicked outside
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        isFilterOpen
      ) {
        setIsFilterOpen(false);
      }

      // Close sort dropdown if clicked outside
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target as Node) &&
        isSortOpen
      ) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen, isSortOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];

    setSelectedFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    onFilter?.([]);
  };

  const handleSort = (sortId: string) => {
    const newSort = selectedSort === sortId ? "" : sortId;
    setSelectedSort(newSort);
    onSort?.(newSort);
    setIsSortOpen(false);
  };

  const getFilterBadgeColor = (filter: FilterOption) => {
    if (!filter.color) return "gray";
    return filter.color;
  };

  const getSortIcon = () => {
    if (!selectedSort) return <ArrowsUpDownIcon className="h-4 w-4 mr-1" />;

    const sortOption = sortOptions.find((s) => s.id === selectedSort);
    const isAscending = sortOption?.id.includes("_asc");

    return isAscending ? (
      <ArrowUpIcon className="h-4 w-4 mr-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 mr-1" />
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
              placeholder={searchPlaceholder}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => {
                  setSearchTerm("");
                  onSearch?.("");
                }}
              >
                <XMarkIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400" />
              </button>
            )}
          </div>
        )}

        {/* Filter dropdown */}
        {showFilter && filterOptions.length > 0 && (
          <div className="relative" ref={filterRef}>
            <Button
              variant="outline"
              size="sm"
              className={`inline-flex items-center ${
                selectedFilters.length > 0
                  ? "border-indigo-500 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
                  : ""
              }`}
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filter
              {selectedFilters.length > 0 && (
                <Badge className="ml-1 rounded-full text-xs" color="indigo">
                  {selectedFilters.length}
                </Badge>
              )}
            </Button>

            {isFilterOpen && (
              <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
                <div className="py-1 divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="px-4 py-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Filters
                    </span>
                    {selectedFilters.length > 0 && (
                      <button
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={clearFilters}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="py-2 px-4 space-y-2">
                    {filterOptions.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={`filter-${option.id}`}
                          type="checkbox"
                          checked={selectedFilters.includes(option.id)}
                          onChange={() => handleFilterToggle(option.id)}
                          className="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-700 rounded"
                        />
                        <label
                          htmlFor={`filter-${option.id}`}
                          className="ml-2 flex items-center"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                            {option.label}
                          </span>
                          <Badge color={getFilterBadgeColor(option)}>
                            {option.value}
                          </Badge>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sort dropdown */}
        {showSort && sortOptions.length > 0 && (
          <div className="relative" ref={sortRef}>
            <Button
              variant="outline"
              size="sm"
              className={`inline-flex items-center ${
                selectedSort
                  ? "border-indigo-500 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300"
                  : ""
              }`}
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
            >
              {getSortIcon()}
              Sort
              {selectedSort && (
                <Badge className="ml-1" color="indigo">
                  {sortOptions.find((s) => s.id === selectedSort)?.label || ""}
                </Badge>
              )}
            </Button>

            {isSortOpen && (
              <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
                <div className="py-1">
                  <div className="px-4 py-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sort by
                    </span>
                    {selectedSort && (
                      <button
                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => {
                          setSelectedSort("");
                          onSort?.("");
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`block px-4 py-2 text-sm text-left w-full ${
                          selectedSort === option.id
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => handleSort(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected filters display */}
      {(selectedFilters.length > 0 || selectedSort) && (
        <div className="flex flex-wrap gap-2 mt-2 items-center">
          {selectedFilters.map((filterId) => {
            const filter = filterOptions.find((f) => f.id === filterId);
            if (!filter) return null;

            return (
              <Badge
                key={filterId}
                color={getFilterBadgeColor(filter)}
                className="flex items-center"
              >
                {filter.label}: {filter.value}
                <button
                  className="ml-1.5"
                  onClick={() => handleFilterToggle(filterId)}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}

          {selectedSort && (
            <Badge color="indigo" className="flex items-center">
              Sorted by: {sortOptions.find((s) => s.id === selectedSort)?.label}
              <button
                className="ml-1.5"
                onClick={() => {
                  setSelectedSort("");
                  onSort?.("");
                }}
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedFilters.length > 0 && selectedSort && (
            <button
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center border border-indigo-300 dark:border-indigo-500 hover:border-indigo-500 dark:hover:border-indigo-400 rounded px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 transition-colors"
              onClick={() => {
                clearFilters();
                setSelectedSort("");
                onSort?.("");
              }}
            >
              Clear All
            </button>
          )}

          {selectedFilters.length > 1 && !selectedSort && (
            <button
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
