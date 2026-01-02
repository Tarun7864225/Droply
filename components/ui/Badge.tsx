import { cn } from "@/lib/utils";
import React from "react";

export type BadgeProps = {
  children: React.ReactNode;
  icon?: React.ReactNode; // optional icon
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "solid" | "flat" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
};

export const Badge = ({
  children,
  icon,
  color = "default",
  variant = "solid",
  size = "md",
  className,
  ...props
}: BadgeProps & React.HTMLAttributes<HTMLSpanElement>) => {
  const colorStyles = {
    default: {
      solid: "bg-gray-500 text-white",
      flat: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      outline: "border border-gray-300 text-gray-800 hover:bg-gray-50",
    },
    primary: {
      solid: "bg-blue-600 text-white",
      flat: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      outline: "border border-blue-300 text-blue-800 hover:bg-blue-50",
    },
    secondary: {
      solid: "bg-purple-600 text-white",
      flat: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      outline: "border border-purple-300 text-purple-800 hover:bg-purple-50",
    },
    success: {
      solid: "bg-green-600 text-white",
      flat: "bg-green-100 text-green-800 hover:bg-green-200",
      outline: "border border-green-300 text-green-800 hover:bg-green-50",
    },
    warning: {
      solid: "bg-yellow-500 text-white",
      flat: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      outline: "border border-yellow-300 text-yellow-800 hover:bg-yellow-50",
    },
    danger: {
      solid: "bg-red-600 text-white",
      flat: "bg-red-100 text-red-800 hover:bg-red-200",
      outline: "border border-red-300 text-red-800 hover:bg-red-50",
    },
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 rounded-md",
    md: "text-sm px-3 py-1 rounded-md",
    lg: "text-base px-4 py-1.5 rounded-md",
  };

  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center justify-center font-medium select-none",
        colorStyles[color][variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1 flex items-center">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
