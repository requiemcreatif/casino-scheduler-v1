"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Table } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { Alert } from "@/components/ui/alert";
import { CancelButton } from "@/components/ui/cancel-button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { HashtagIcon, UserIcon } from "@heroicons/react/24/outline";

interface TableFormProps {
  initialData?: Partial<Table>;
  onSubmit: (
    data: Omit<Table, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  isLoading: boolean;
}

export const TableForm: React.FC<TableFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { isAllowed } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [number, setNumber] = useState(initialData?.number || 0);
  const [active, setActive] = useState(
    initialData?.active !== undefined ? initialData.active : true
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<Omit<
    Table,
    "id" | "createdAt" | "updatedAt"
  > | null>(null);

  const canEdit = isAllowed("manager");

  // Check if form data has changed from initial values
  const handleFieldChange = (field: string, value: any) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "number":
        setNumber(value);
        break;
      case "active":
        setActive(value);
        break;
    }

    // Mark form as having changes after any modification
    setHasChanges(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (number <= 0) {
      newErrors.number = "Number must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data = {
      name,
      number,
      active,
    };

    // If this is an update (not a new table), show confirmation modal
    if (initialData?.id) {
      setFormData(data);
      setShowConfirmModal(true);
    } else {
      // For new tables, submit directly
      await onSubmit(data);
    }
  };

  const handleConfirmUpdate = async () => {
    if (formData) {
      await onSubmit(formData);
      setShowConfirmModal(false);
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    router.push("/tables");
  };

  if (!canEdit) {
    return (
      <Alert variant="destructive">
        You don't have permission to edit tables.
      </Alert>
    );
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {initialData?.id ? "Update Table" : "Create Table"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className={`block w-full rounded-md shadow-sm px-3 py-2 text-sm border focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    disabled={isLoading}
                    placeholder="Enter table name"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <HashtagIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <label
                    htmlFor="number"
                    className="text-sm font-medium text-gray-700"
                  >
                    Table Number
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    id="number"
                    value={number}
                    onChange={(e) =>
                      handleFieldChange("number", parseInt(e.target.value) || 0)
                    }
                    className={`block w-full rounded-md shadow-sm px-3 py-2 text-sm border focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all ${
                      errors.number
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    min="1"
                    disabled={isLoading}
                    placeholder="Enter table number"
                  />
                  {errors.number && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.number}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <label
                    htmlFor="active"
                    className="text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    onClick={() =>
                      !isLoading && handleFieldChange("active", !active)
                    }
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      active ? "bg-green-500" : "bg-gray-300"
                    } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-700">
                    {active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <CardFooter className="px-0 pt-4 pb-0 flex justify-between">
              <CancelButton
                onCancel={handleCancel}
                isDirty={hasChanges}
                confirmationTitle="Discard Changes"
                confirmationMessage="Are you sure you want to cancel? Any unsaved changes will be lost."
                buttonText="Cancel"
                size="default"
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center"
              >
                {isLoading
                  ? "Processing..."
                  : initialData?.id
                  ? "Update Table"
                  : "Create Table"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Update"
        message={`Are you sure you want to update the information for ${
          initialData?.name || `Table #${initialData?.number || ""}`
        }?`}
        type="info"
        confirmText="Update"
        cancelText="Cancel"
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
      />
    </>
  );
};
