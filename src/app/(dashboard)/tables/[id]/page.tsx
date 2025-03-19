"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableForm } from "@/components/tables/TableForm";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Table } from "@/app/types";
/*we use `React.use()` to synchronously extract the params in client component
as recommended for new Nextjs version 15
*/
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTablePage({ params }: PageProps) {
  const { id } = use(params);
  const [table, setTable] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setIsLoading(true);
        const data = await api.tables.getById(id);
        if (data) {
          setTable(data);
        } else {
          setError("Table not found");
        }
      } catch (err) {
        console.error("Failed to fetch table:", err);
        setError("Failed to load table details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTable();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      setError(null);
      await api.tables.update(id, data);
      router.push("/tables");
    } catch (err) {
      console.error("Failed to update table:", err);
      setError("Failed to update table. Please try again later.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (error && !table) {
    return (
      <Alert variant="destructive">
        {error}
        <div className="mt-2">
          <button
            onClick={() => router.push("/tables")}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Back to Tables
          </button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Casino Table" />

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          {table && (
            <TableForm
              initialData={table}
              onSubmit={handleSubmit}
              isLoading={isSaving}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
