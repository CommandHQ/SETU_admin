// components/ui/vstack.tsx
import React from "react";

interface VStackProps {
  children: React.ReactNode;
  gap?: string; // Optional gap between elements
  align?: "start" | "center" | "end"; // Optional alignment of items
}

export const VStack = ({ children, gap = "gap-4", align = "center" }: VStackProps) => {
  const alignment = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  return (
    <div className={`flex flex-col ${gap} ${alignment[align]}`}>
      {children}
    </div>
  );
};
