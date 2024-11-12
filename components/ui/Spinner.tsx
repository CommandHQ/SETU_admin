import React from "react";
import { cn } from "@/lib/utils"; // Utility function for conditional class names

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-4",
  lg: "h-8 w-8 border-4",
};

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  return (
    <div
      className={cn(
        "animate-spin border-t-transparent rounded-full border-blue-500",
        sizeClasses[size],
        className
      )}
    ></div>
  );
};

export { Spinner };