"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditJobForm from "./EditJobForm";
import type { Job } from "@/types";

interface EditJobDialogProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onUpdateJob: (updatedJob: Job) => void;
}

const EditJobDialog = ({
  job,
  isOpen,
  onClose,
  onUpdateJob,
}: EditJobDialogProps): JSX.Element => {
  // Prevent closing when clicking outside if form is dirty
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-3xl lg:max-w-5xl xl:max-w-7xl p-0">
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            Edit Job Position
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white dark:bg-gray-800">
          <EditJobForm
            job={job}
            onClose={onClose}
            onUpdateJob={onUpdateJob}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobDialog;