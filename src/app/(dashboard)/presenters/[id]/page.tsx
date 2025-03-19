"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PresenterForm } from "@/components/presenters/PresenterForm";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Presenter } from "@/app/types";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPresenterPage({ params }: PageProps) {
  const { id } = use(params);
  const [presenter, setPresenter] = useState<Presenter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPresenter = async () => {
      try {
        setIsLoading(true);
        const data = await api.presenters.getById(id);
        if (data) {
          setPresenter(data);
        } else {
          setError("Presenter not found");
        }
      } catch (err) {
        console.error("Failed to fetch presenter:", err);
        setError("Failed to load presenter details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPresenter();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      setError(null);
      await api.presenters.update(id, data);
      router.push("/presenters");
    } catch (err) {
      console.error("Failed to update presenter:", err);
      setError("Failed to update presenter. Please try again later.");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-32" />;
  }

  if (error && !presenter) {
    return (
      <Alert variant="destructive">
        {error}
        <div className="mt-2">
          <button
            onClick={() => router.push("/presenters")}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Back to Presenters
          </button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <PageHeader title="Edit Game Presenter" />

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          {presenter && (
            <PresenterForm
              initialData={presenter}
              onSubmit={handleSubmit}
              isLoading={isSaving}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
