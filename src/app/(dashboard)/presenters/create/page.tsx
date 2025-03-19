// src/app/presenters/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PresenterForm } from "@/components/presenters/PresenterForm";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { api } from "@/lib/api";

export default function CreatePresenterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await api.presenters.create(data);
      router.push("/presenters");
    } catch (err) {
      console.error("Failed to create presenter:", err);
      setError("Failed to create presenter. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Create Game Presenter" />

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <PresenterForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
