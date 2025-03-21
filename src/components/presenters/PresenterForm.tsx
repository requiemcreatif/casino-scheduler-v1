"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Presenter, Shift } from "@/app/types";
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
import {
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface PresenterFormProps {
  initialData?: Partial<Presenter>;
  onSubmit: (
    data: Omit<Presenter, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  isLoading: boolean;
}

// Form input component
interface FormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  error,
  disabled,
}) => (
  <div className="space-y-2">
    <div className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
    <div className="relative">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-md shadow-sm px-3 py-2 text-sm border focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
            : "border-gray-300 focus:border-blue-500"
        }`}
        disabled={disabled}
        placeholder={placeholder}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  </div>
);

// Shift selector component
interface ShiftSelectorProps {
  value: Shift;
  onChange: (value: Shift) => void;
  disabled?: boolean;
}

const ShiftSelector: React.FC<ShiftSelectorProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const getShiftColor = (selectedShift: string) => {
    switch (selectedShift) {
      case "morning":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "afternoon":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "night":
        return "bg-purple-50 border-purple-200 text-purple-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
        <label htmlFor="shift" className="text-sm font-medium text-gray-700">
          Shift
        </label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["morning", "afternoon", "night"].map((shiftOption) => (
          <div
            key={shiftOption}
            onClick={() => !disabled && onChange(shiftOption as Shift)}
            className={`cursor-pointer rounded-md border px-4 py-2 flex items-center justify-center ${
              value === shiftOption
                ? getShiftColor(shiftOption)
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            } transition-colors ${
              disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <div className="text-sm font-medium capitalize">{shiftOption}</div>
            {value === shiftOption && (
              <CheckCircleIcon className="ml-2 h-4 w-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Status toggle component
interface StatusToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const StatusToggle: React.FC<StatusToggleProps> = ({
  value,
  onChange,
  disabled,
}) => (
  <div className="space-y-2">
    <div className="flex items-center">
      <label htmlFor="active" className="text-sm font-medium text-gray-700">
        Status
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <div
        onClick={() => !disabled && onChange(!value)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          value ? "bg-green-500" : "bg-gray-300"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm text-gray-700">
        {value ? "Active" : "Inactive"}
      </span>
    </div>
  </div>
);

export const PresenterForm: React.FC<PresenterFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const { isAllowed } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [shift, setShift] = useState<Shift>(initialData?.shift || "morning");
  const [active, setActive] = useState(
    initialData?.active !== undefined ? initialData.active : true
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<Omit<
    Presenter,
    "id" | "createdAt" | "updatedAt"
  > | null>(null);

  const canEdit = isAllowed("manager");

  const handleFieldChange = (field: string, value: any) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "shift":
        setShift(value);
        break;
      case "active":
        setActive(value);
        break;
    }

    setHasChanges(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\+?[0-9\s]+$/.test(phone)) {
      newErrors.phone = "Phone number is invalid";
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
      email,
      phone,
      shift,
      active,
    };

    if (initialData?.id) {
      setFormData(data);
      setShowConfirmModal(true);
    } else {
      // For new presenters, submit directly
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
    router.push("/presenters");
  };

  if (!canEdit) {
    return (
      <Alert variant="destructive">
        You don't have permission to edit presenters.
      </Alert>
    );
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {initialData?.id ? "Update Presenter" : "Create Presenter"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <FormInput
                id="name"
                label="Name"
                value={name}
                onChange={(value) => handleFieldChange("name", value)}
                placeholder="Enter presenter name"
                icon={<UserIcon className="h-4 w-4 text-gray-500" />}
                error={errors.name}
                disabled={isLoading}
              />

              <FormInput
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(value) => handleFieldChange("email", value)}
                placeholder="email@example.com"
                icon={<EnvelopeIcon className="h-4 w-4 text-gray-500" />}
                error={errors.email}
                disabled={isLoading}
              />

              <FormInput
                id="phone"
                label="Phone"
                type="tel"
                value={phone}
                onChange={(value) => handleFieldChange("phone", value)}
                placeholder="+1 (555) 123-4567"
                icon={<PhoneIcon className="h-4 w-4 text-gray-500" />}
                error={errors.phone}
                disabled={isLoading}
              />

              <ShiftSelector
                value={shift}
                onChange={(value) => handleFieldChange("shift", value)}
                disabled={isLoading}
              />

              <StatusToggle
                value={active}
                onChange={(value) => handleFieldChange("active", value)}
                disabled={isLoading}
              />
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
                  ? "Update Presenter"
                  : "Create Presenter"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title="Confirm Update"
        message={`Are you sure you want to update the information for ${
          initialData?.name || "this presenter"
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
