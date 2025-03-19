import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-4 text-sm shadow-sm flex items-start gap-3",
  {
    variants: {
      variant: {
        default: "bg-blue-50 border-blue-200 text-blue-800",
        destructive: "bg-red-50 border-red-200 text-red-800",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {
  title?: string;
}

function Alert({ className, variant, children, title, ...props }: AlertProps) {
  const icon =
    variant === "destructive"
      ? ExclamationTriangleIcon
      : variant === "success"
      ? CheckCircleIcon
      : InformationCircleIcon;

  const Icon = icon;

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-grow">
        {title && <AlertTitle>{title}</AlertTitle>}
        {typeof children === "string" ? (
          <AlertDescription>{children}</AlertDescription>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("font-medium text-base mb-1", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
