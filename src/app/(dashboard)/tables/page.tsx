"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table } from "@/app/types";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableList } from "@/components/tables/TableList";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/providers/AuthProvider";

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAllowed } = useAuth();

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await api.tables.getAll();
      setTables(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
      setError("Failed to load tables. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.tables.delete(id);
      setTables(tables.filter((table) => table.id !== id));
    } catch (err) {
      console.error("Failed to delete table:", err);
      setError("Failed to delete table. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Casino Tables"
        action={
          isAllowed("manager")
            ? {
                label: "Add Table",
                onClick: () => router.push("/tables/create"),
              }
            : undefined
        }
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <TableList
          tables={tables}
          onDelete={handleDelete}
          isLoading={loading}
        />
      )}
    </div>
  );
}
