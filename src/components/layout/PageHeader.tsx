import React from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  action,
  description,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-200">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-gray-600 max-w-2xl">{description}</p>
        )}
      </div>
      {action && (
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={action.onClick}
            className="shadow-sm hover:shadow transition-all"
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};
