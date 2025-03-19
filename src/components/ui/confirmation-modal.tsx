"use client";

import React from "react";
import {
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

type ModalType = "info" | "warning" | "danger" | "success" | "confirm";

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  type = "confirm",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case "success":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "info":
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
      case "confirm":
      default:
        return <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getButtonVariant = () => {
    switch (type) {
      case "danger":
        return "destructive";
      case "warning":
        return "outline";
      case "success":
        return "default";
      case "info":
        return "secondary";
      case "confirm":
      default:
        return "default";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-50 dark:bg-red-900/30";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/30";
      case "success":
        return "bg-green-50 dark:bg-green-900/30";
      case "info":
        return "bg-blue-50 dark:bg-gray-700";
      case "confirm":
      default:
        return "bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="relative max-w-lg w-full mx-4 overflow-hidden rounded-lg transform transition-all sm:max-w-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className={`p-4 ${getBackgroundColor()}`}>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{getIcon()}</div>
              <div className="flex-1">
                {title && (
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title}
                  </h3>
                )}
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {message}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={onConfirm}
              variant={getButtonVariant()}
              size="sm"
              className="sm:ml-3 w-full sm:w-auto"
            >
              {confirmText}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="mt-3 sm:mt-0 w-full sm:w-auto"
            >
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ConfirmationModal };
