"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Presenter } from "@/app/types";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { PresenterList } from "@/components/presenters/PresenterList";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/providers/AuthProvider";

export default function PresentersPage() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAllowed } = useAuth();

  const fetchPresenters = async () => {
    try {
      setLoading(true);
      const data = await api.presenters.getAll();
      setPresenters(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch presenters:", err);
      setError("Failed to load presenters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresenters();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.presenters.delete(id);
      setPresenters(presenters.filter((presenter) => presenter.id !== id));
    } catch (err) {
      console.error("Failed to delete presenter:", err);
      setError("Failed to delete presenter. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Game Presenters"
        action={
          isAllowed("manager")
            ? {
                label: "Add Presenter",
                onClick: () => router.push("/presenters/create"),
              }
            : undefined
        }
      />

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <PresenterList
        presenters={presenters}
        onDelete={handleDelete}
        isLoading={loading}
      />
    </div>
  );
}
