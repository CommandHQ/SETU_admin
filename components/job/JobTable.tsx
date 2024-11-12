// JobTable.tsx
import React, { useEffect, useState } from 'react';
import { deleteJob, getAllJobs } from '@/services/Job_services/jobService';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import JobViewDialog from './JobViewDialog';
import JobEditDialog from './JobEditDialog';
import { Job } from '@/types';

const JobTable: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAppliedCandidatesDialogOpen, setIsAppliedCandidatesDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await getAllJobs();
        console.log('Fetched Jobs:', fetchedJobs);
        setJobs(fetchedJobs as unknown as Job[]);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsViewDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsEditDialogOpen(true);
  };

  const handleAppliedJobs = (job: Job) => {
    setSelectedJob(job);
    setIsAppliedCandidatesDialogOpen(true);
  };

  const closeViewDialog = () => {
    setIsViewDialogOpen(false);
    setSelectedJob(null);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedJob(null);
    // Optionally refresh job list after edit
  };

  const closeAppliedCandidatesDialog = () => {
    setIsAppliedCandidatesDialogOpen(false);
    setSelectedJob(null);
  };

  console.log("Jobs:", jobs);

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
    closeEditDialog();
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job: Job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title.name}</TableCell>
              <TableCell>{job.recruiter.company.name}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleViewJob(job)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditJob(job)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAppliedJobs(job)}>Applied Jobs</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isViewDialogOpen && selectedJob && (
        <JobViewDialog job={selectedJob} onClose={closeViewDialog} />
      )}

      {isEditDialogOpen && selectedJob && (
        <JobEditDialog
          job={selectedJob}
          onClose={closeEditDialog}
          isOpen={isEditDialogOpen}
          onUpdateJob={handleUpdateJob}
        />
      )}

      {isAppliedCandidatesDialogOpen && selectedJob && (
        <JobViewDialog job={selectedJob} onClose={closeAppliedCandidatesDialog} />
      )}
    </>
  );
};

export default JobTable;
