import React from "react";

interface GridProps {
  className?: string;
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({ className, children }) => {
  return <div className={`grid ${className}`}>{children}</div>;
};

interface GridItemProps {
  className?: string;
  children: React.ReactNode;
}

export const GridItem: React.FC<GridItemProps> = ({ className, children }) => {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
};