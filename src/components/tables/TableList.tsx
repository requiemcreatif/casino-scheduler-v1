"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Table as TableType } from "@/app/types";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/AuthProvider";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Filter, FilterOption, SortOption } from "@/components/ui/filter";
import { Pagination } from "../ui/pagination";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TableListSkeleton } from "./TableListSkeleton";

interface TableListProps {
  tables: TableType[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const TableList: React.FC<TableListProps> = ({
  tables,
  onDelete,
  isLoading,
}) => {
  const { isAllowed } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<string | null>(null);
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
    ],
    []
  );

  const sortOptions: SortOption[] = useMemo(
    () => [
      {
        id: "number_asc",
        label: "Number (Low to High)",
        value: "number_asc",
      },
      {
        id: "number_desc",
        label: "Number (High to Low)",
        value: "number_desc",
      },
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
        id: "created_asc",
        label: "Created (Oldest first)",
        value: "created_asc",
      },
      {
        id: "created_desc",
        label: "Created (Newest first)",
        value: "created_desc",
      },
    ],
    []
  );

  const filteredAndSortedTables = useMemo(() => {
    // Filter by search term (name or number)
    let filtered = tables.filter((table) => {
      const matchesSearch =
        !searchTerm ||
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.number.toString().includes(searchTerm);

      // Filter by status
      const activeFilterApplied = activeFilters.includes("active");
      const inactiveFilterApplied = activeFilters.includes("inactive");

      if (activeFilterApplied && !inactiveFilterApplied) {
        return matchesSearch && table.active;
      } else if (!activeFilterApplied && inactiveFilterApplied) {
        return matchesSearch && !table.active;
      }

      return matchesSearch;
    });

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "number_asc":
            return a.number - b.number;
          case "number_desc":
            return b.number - a.number;
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "created_asc":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "created_desc":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [tables, searchTerm, activeFilters, sortBy]);

  // Paginate data
  const paginatedTables = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedTables.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedTables, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredAndSortedTables.length / pageSize)),
    [filteredAndSortedTables, pageSize]
  );

  // Reset to first page when filters, search, or page size changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters, sortBy, pageSize]);

  const confirmDelete = (id: string) => {
    setTableToDelete(id);
    setModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (tableToDelete) {
      onDelete(tableToDelete);
      setModalOpen(false);
      setTableToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setModalOpen(false);
    setTableToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (isLoading) {
    return <TableListSkeleton />;
  }

  return (
    <div>
      <div className="mb-4">
        <Filter
          searchPlaceholder="Search by name or number..."
          onSearch={setSearchTerm}
          onFilter={setActiveFilters}
          onSort={setSortBy}
          filterOptions={filterOptions}
          sortOptions={sortOptions}
        />
      </div>

      <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
        {filteredAndSortedTables.length} table
        {filteredAndSortedTables.length !== 1 ? "s" : ""}
        {filteredAndSortedTables.length !== tables.length && (
          <span className="text-gray-500 dark:text-gray-500">
            {" "}
            (filtered from {tables.length})
          </span>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="font-medium">Table Number</TableHead>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Created</TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTables.map((table) => (
              <TableRow key={table.id}>
                <TableCell className="font-medium">{table.number}</TableCell>
                <TableCell>{table.name}</TableCell>
                <TableCell>
                  <Badge color={table.active ? "green" : "red"}>
                    {table.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(table.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-2 justify-end">
                    <Link href={`/tables/${table.id}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        {canEdit ? "Edit" : "View"}
                      </Button>
                    </Link>
                    {canDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(table.id)}
                        disabled={isLoading}
                        className="inline-flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAndSortedTables.length === 0 && (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              {tables.length === 0
                ? "No tables found."
                : "No tables match your filter criteria. Try clearing some filters."}
            </p>
          </div>
        )}
      </div>

      {filteredAndSortedTables.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredAndSortedTables.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 25, 50]}
          className="mt-4"
          showSummary={true}
        />
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        title="Delete Table"
        message="Are you sure you want to delete this table? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
