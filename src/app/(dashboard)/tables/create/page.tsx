"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableForm } from "@/components/tables/TableForm";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { api } from "@/lib/api";

export default function CreateTablePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.tables.create(data);
      router.push("/tables");
    } catch (err) {
      console.error("Failed to create table:", err);
      setError("Failed to create table. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Create Casino Table" />

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <TableForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
