"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Ensure you have these table components or use a library like ShadCN/UI
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => any);
  Cell?: (props: { row: { original: T } }) => React.ReactNode;
}

interface MasterTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

const MasterTable = <T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
}: MasterTableProps<T>) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-xl">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.accessor)}>
                {col.header}
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              {columns.map((col) => {
                const value =
                  typeof col.accessor === "function"
                    ? col.accessor(item)
                    : item[col.accessor];

                return (
                  <TableCell key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {value instanceof Date
                      ? value.toLocaleDateString()
                      : String(value) as React.ReactNode}
                  </TableCell>
                );
              })}
              <TableCell className="px-6 py-4 whitespace-nowrap flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(item)}
                  aria-label="Edit"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item)}
                  aria-label="Delete"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MasterTable;