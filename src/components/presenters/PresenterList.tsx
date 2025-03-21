"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Presenter, ViewMode } from "@/app/types";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/AuthProvider";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Filter, FilterOption, SortOption } from "@/components/ui/filter";
import { Pagination } from "../ui/pagination";
import {
  PencilIcon,
  TrashIcon,
  Squares2X2Icon,
  Bars4Icon,
} from "@heroicons/react/24/outline";

interface PresenterListProps {
  presenters: Presenter[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const SkeletonItem = ({
  width,
  height = "h-5",
}: {
  width: string;
  height?: string;
}) => (
  <Skeleton className={`${height} ${width} bg-gray-200 dark:bg-gray-700`} />
);

const SkeletonButton = ({ width = "w-20" }: { width?: string }) => (
  <Skeleton
    className={`h-9 ${width} rounded-md bg-gray-200 dark:bg-gray-700`}
  />
);

const SkeletonTableHeader = () => (
  <TableRow className="bg-gray-50 dark:bg-gray-800">
    {[...Array(5)].map((_, i) => (
      <TableHead key={i} className="font-medium">
        <SkeletonItem width="w-16" height="h-4" />
      </TableHead>
    ))}
    <TableHead className="text-right font-medium">
      <SkeletonItem width="w-20 ml-auto" height="h-4" />
    </TableHead>
  </TableRow>
);

const SkeletonTableRow = () => (
  <TableRow>
    <TableCell className="font-medium">
      <SkeletonItem width="w-32" />
    </TableCell>
    <TableCell>
      <SkeletonItem width="w-40" />
    </TableCell>
    <TableCell>
      <SkeletonItem width="w-32" />
    </TableCell>
    <TableCell>
      <SkeletonItem width="w-20" height="h-6" />
    </TableCell>
    <TableCell>
      <SkeletonItem width="w-16" height="h-6" />
    </TableCell>
    <TableCell className="text-right">
      <div className="flex space-x-2 justify-end">
        <SkeletonButton />
        <SkeletonButton />
      </div>
    </TableCell>
  </TableRow>
);

const SkeletonCardItem = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="w-3/4">
          <SkeletonItem width="w-40" height="h-6" />
          <div className="space-y-3 mt-3">
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2 rounded-full bg-gray-200 dark:bg-gray-700" />
              <SkeletonItem width="w-48" height="h-4" />
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2 rounded-full bg-gray-200 dark:bg-gray-700" />
              <SkeletonItem width="w-32" height="h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <SkeletonItem width="w-20 mr-4" height="h-4" />
              <SkeletonItem width="w-20" height="h-6" />
            </div>
            <div className="flex items-center">
              <SkeletonItem width="w-20 mr-4" height="h-4" />
              <SkeletonItem width="w-20" height="h-6" />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const PresenterListSkeleton: React.FC<{ viewMode?: ViewMode }> = ({
  viewMode = "list",
}) => {
  return (
    <div>
      <div className="mb-4">
        <SkeletonItem width="w-full max-w-md mb-4" height="h-10" />
      </div>
      <div className="flex justify-between items-center mb-6">
        <SkeletonItem width="w-32" height="h-5" />
        <div className="flex space-x-2">
          <SkeletonButton width="w-24" />
          <SkeletonButton width="w-24" />
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="border rounded-lg overflow-hidden dark:border-gray-700">
          <Table>
            <TableHeader>
              <SkeletonTableHeader />
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <SkeletonTableRow key={index} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonCardItem key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

// Action buttons component
interface ActionButtonsProps {
  presenterId: string;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: () => void;
  isLoading: boolean;
  viewMode?: ViewMode;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  presenterId,
  canEdit,
  canDelete,
  onDelete,
  isLoading,
  viewMode,
}) => {
  const buttonClasses = viewMode === "grid" ? "shadow-sm" : "";

  return (
    <div
      className={
        viewMode === "list"
          ? "flex space-x-2 justify-end"
          : "flex flex-col space-y-2"
      }
    >
      <Link href={`/presenters/${presenterId}`}>
        <Button
          variant="secondary"
          size="sm"
          className={`inline-flex items-center ${buttonClasses}`}
        >
          <PencilIcon className="h-4 w-4 mr-1" />
          {canEdit ? "Edit" : "View"}
        </Button>
      </Link>
      {canDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isLoading}
          className={`inline-flex items-center ${buttonClasses}`}
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Delete
        </Button>
      )}
    </div>
  );
};

// Badge component with styling
interface StatusBadgeProps {
  type: "shift" | "status";
  value: string | boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "morning":
        return "blue";
      case "afternoon":
        return "yellow";
      case "night":
        return "purple";
      default:
        return "gray";
    }
  };

  if (type === "shift") {
    const shift = value as string;
    return (
      <Badge color={getShiftColor(shift)}>
        {shift.charAt(0).toUpperCase() + shift.slice(1)}
      </Badge>
    );
  }

  const isActive = value as boolean;
  return (
    <Badge color={isActive ? "green" : "red"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
};

export const PresenterList: React.FC<PresenterListProps> = ({
  presenters,
  onDelete,
  isLoading,
}) => {
  const { isAllowed } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [presenterToDelete, setPresenterToDelete] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const canEdit = isAllowed("manager");
  const canDelete = isAllowed("admin");

  const filterOptions: FilterOption[] = useMemo(
    () => [
      {
        id: "active",
        label: "Status",
        value: "Active",
        color: "green",
      },
      {
        id: "inactive",
        label: "Status",
        value: "Inactive",
        color: "red",
      },
      {
        id: "morning",
        label: "Shift",
        value: "Morning",
        color: "blue",
      },
      {
        id: "afternoon",
        label: "Shift",
        value: "Afternoon",
        color: "yellow",
      },
      {
        id: "night",
        label: "Shift",
        value: "Night",
        color: "purple",
      },
    ],
    []
  );

  const sortOptions: SortOption[] = useMemo(
    () => [
      {
        id: "name_asc",
        label: "Name (A to Z)",
        value: "name_asc",
      },
      {
        id: "name_desc",
        label: "Name (Z to A)",
        value: "name_desc",
      },
      {
        id: "email_asc",
        label: "Email (A to Z)",
        value: "email_asc",
      },
      {
        id: "email_desc",
        label: "Email (Z to A)",
        value: "email_desc",
      },
    ],
    []
  );

  const filteredAndSortedPresenters = useMemo(() => {
    // Filter by search term (name, email, or phone)
    let filtered = presenters.filter((presenter) => {
      const matchesSearch =
        !searchTerm ||
        presenter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        presenter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        presenter.phone.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status and shift
      const activeFilterApplied = activeFilters.includes("active");
      const inactiveFilterApplied = activeFilters.includes("inactive");
      const morningFilterApplied = activeFilters.includes("morning");
      const afternoonFilterApplied = activeFilters.includes("afternoon");
      const nightFilterApplied = activeFilters.includes("night");

      let statusMatches = true;
      if (
        (activeFilterApplied || inactiveFilterApplied) &&
        !(activeFilterApplied && inactiveFilterApplied)
      ) {
        statusMatches = activeFilterApplied
          ? presenter.active
          : !presenter.active;
      }

      let shiftMatches = true;
      const shiftFiltersApplied =
        morningFilterApplied || afternoonFilterApplied || nightFilterApplied;

      if (shiftFiltersApplied) {
        shiftMatches =
          (morningFilterApplied && presenter.shift === "morning") ||
          (afternoonFilterApplied && presenter.shift === "afternoon") ||
          (nightFilterApplied && presenter.shift === "night");
      }

      return matchesSearch && statusMatches && shiftMatches;
    });

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "email_asc":
            return a.email.localeCompare(b.email);
          case "email_desc":
            return b.email.localeCompare(a.email);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [presenters, searchTerm, activeFilters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPresenters.length / pageSize);
  const paginatedPresenters = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedPresenters.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedPresenters, currentPage, pageSize]);

  // This will reset the page to 1 when filters, search term, or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters, sortBy, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const confirmDelete = (id: string) => {
    setPresenterToDelete(id);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (presenterToDelete) {
      onDelete(presenterToDelete);
      setModalOpen(false);
      setPresenterToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setModalOpen(false);
    setPresenterToDelete(null);
  };

  if (isLoading) {
    return <PresenterListSkeleton viewMode={viewMode} />;
  }

  const renderTableView = () => (
    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className="font-medium">Email</TableHead>
            <TableHead className="font-medium">Phone</TableHead>
            <TableHead className="font-medium">Shift</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPresenters.map((presenter) => (
            <TableRow key={presenter.id}>
              <TableCell className="font-medium">{presenter.name}</TableCell>
              <TableCell>{presenter.email}</TableCell>
              <TableCell>{presenter.phone}</TableCell>
              <TableCell>
                <StatusBadge type="shift" value={presenter.shift} />
              </TableCell>
              <TableCell>
                <StatusBadge type="status" value={presenter.active} />
              </TableCell>
              <TableCell className="text-right">
                <ActionButtons
                  presenterId={presenter.id}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onDelete={() => confirmDelete(presenter.id)}
                  isLoading={isLoading}
                  viewMode="list"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedPresenters.map((presenter) => (
        <Card key={presenter.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {presenter.name}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {presenter.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {presenter.phone}
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-20">
                      Shift
                    </span>
                    <StatusBadge type="shift" value={presenter.shift} />
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase w-20">
                      Status
                    </span>
                    <StatusBadge type="status" value={presenter.active} />
                  </div>
                </div>
              </div>
              <ActionButtons
                presenterId={presenter.id}
                canEdit={canEdit}
                canDelete={canDelete}
                onDelete={() => confirmDelete(presenter.id)}
                isLoading={isLoading}
                viewMode="grid"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <p className="text-gray-500 dark:text-gray-400">
        {presenters.length === 0
          ? "No presenters found."
          : "No presenters match your filter criteria. Try clearing some filters."}
      </p>
    </div>
  );

  return (
    <div>
      <div className="mb-4">
        <Filter
          searchPlaceholder="Search by name, email, or phone..."
          onSearch={setSearchTerm}
          onFilter={setActiveFilters}
          onSort={setSortBy}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {filteredAndSortedPresenters.length} presenter
          {filteredAndSortedPresenters.length !== 1 ? "s" : ""}
          {filteredAndSortedPresenters.length !== presenters.length && (
            <span className="text-gray-500 dark:text-gray-500">
              {" "}
              (filtered from {presenters.length})
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="inline-flex items-center shadow-sm"
          >
            <Bars4Icon className="h-4 w-4 mr-1" />
            Table
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="inline-flex items-center shadow-sm"
          >
            <Squares2X2Icon className="h-4 w-4 mr-1" />
            Grid
          </Button>
        </div>
      </div>

      {filteredAndSortedPresenters.length === 0
        ? renderEmptyState()
        : viewMode === "list"
        ? renderTableView()
        : renderCardView()}

      {filteredAndSortedPresenters.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredAndSortedPresenters.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showSummary={true}
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        title="Delete Presenter"
        message="Are you sure you want to delete this presenter? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
