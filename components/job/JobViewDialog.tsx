"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Job } from "@/types";

interface JobViewDialogProps {
  job: Job;
  onClose: () => void;
}

const JobViewDialog: React.FC<JobViewDialogProps> = ({ job, onClose }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job.title.name}</DialogTitle>
          <DialogDescription>{job.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Company:</strong> {job.recruiter.company.name}
          </p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Status:</strong> {job.status}
          </p>
          {/* Add more job details as needed */}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobViewDialog;
