"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CancelButtonProps {
  onCancel: () => void;
  isDirty?: boolean;
  confirmationMessage?: string;
  confirmationTitle?: string;
  buttonText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  className?: string;
}

export const CancelButton: React.FC<CancelButtonProps> = ({
  onCancel,
  isDirty = false,
  confirmationMessage = "Are you sure you want to cancel? Any unsaved changes will be lost.",
  confirmationTitle = "Confirm Cancel",
  buttonText = "Cancel",
  variant = "outline",
  size = "default",
  showIcon = true,
  className = "",
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancelClick = () => {
    if (isDirty) {
      setShowConfirmation(true);
    } else {
      onCancel();
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onCancel();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleCancelClick}
        className={`${showIcon ? "inline-flex items-center" : ""} ${className}`}
      >
        {showIcon && <XMarkIcon className="h-4 w-4 mr-2" />}
        {buttonText}
      </Button>

      <ConfirmationModal
        isOpen={showConfirmation}
        title={confirmationTitle}
        message={confirmationMessage}
        type="warning"
        confirmText="Yes, Cancel"
        cancelText="Continue Editing"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};
