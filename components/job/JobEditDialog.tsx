// EditJobDialog.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditJobForm from "./EditJobForm";
import { Job } from "@/types";

interface EditJobDialogProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onUpdateJob: (updatedJob: Job) => void;
}

const EditJobDialog: React.FC<EditJobDialogProps> = ({
  job,
  isOpen,
  onClose,
  onUpdateJob,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 bg-gray-50">
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-950 rounded-md">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            Edit Job Position
          </DialogTitle>
        </DialogHeader>
        <EditJobForm job={job} onClose={onClose} onUpdateJob={onUpdateJob} />
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;
