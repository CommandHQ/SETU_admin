"use client";
import React from "react";
import { useState, useEffect } from "react";
import { getAllJobs, deleteJob } from "@/services/Job_services/jobService";
import { Job } from "@/types";
import AddJobDialog from "@/components/job/AddJobDialog";
import { Briefcase, Edit, Eye, EyeClosed, MoreVertical, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import EditJobForm from "@/components/job/EditJobForm";

export const JobRow = ({ job }: {job: Job | any}) => {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);

  const handleDeleteJob = async () => {
    if (confirm(`Are you sure you want to delete this job: ${job.title.name}?`)) {
      try {
        await deleteJob(job.id);
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>{job.title.name}</TableCell>
      <TableCell>{job.recruiter.company.name}</TableCell>
      <TableCell>{job.location}</TableCell>
      <TableCell>
        <Badge variant={job.status === 'ACTIVE' ? 'default' : 'destructive'}>
          {job.status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        {job.appliedBy?.length || 0}
      </TableCell>
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push(`/jobs/${job.id}/applied-candidates`)}
            >
              <EyeClosed className="mr-2 h-4 w-4" />
              See Applied Candidates
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={handleDeleteJob}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-4xl h-[90vh] p-0 bg-gray-50">
          <DialogHeader className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-950 rounded-md">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            Edit Job Position
            </DialogTitle>
            </DialogHeader>
            <EditJobForm job={job} onClose={() => setEditOpen(false)} />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};