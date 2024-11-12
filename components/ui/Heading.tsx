import React from "react";
import { cn } from "@/lib/utils"; // Utility function for conditional class names

interface HeadingProps {
  as?: keyof JSX.IntrinsicElements;
  size?: "xl" | "lg" | "md" | "sm";
  className?: string;
  children: React.ReactNode;
}

const sizeClasses = {
  xl: "text-3xl font-bold",
  lg: "text-2xl font-semibold",
  md: "text-xl font-medium",
  sm: "text-lg font-normal",
};

const Heading: React.FC<HeadingProps> = ({
  as: Component = "h1",
  size = "xl",
  className,
  children,
}) => {
  return (
    <Component className={cn(sizeClasses[size], className)}>
      {children}
    </Component>
  );
};

export { Heading };