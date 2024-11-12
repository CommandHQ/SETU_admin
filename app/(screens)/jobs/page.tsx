"use client";
import React from "react";
import { useState, useEffect } from "react";
import { getAllJobs, deleteJob } from "@/services/Job_services/jobService";
import { Job } from "@/types";
import AddJobDialog from "@/components/job/AddJobDialog";
import { ArrowLeft, ArrowRight, Briefcase, Eye, MoreVertical } from "lucide-react";
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
import AnalyticsCard from "@/components/common/moduleAnalyticscard";
import SearchAndFilter from "@/components/job/searchJobfilter";
import EditJobForm from "@/components/job/EditJobForm";
import { JobRow } from "@/components/job/JobRow";

const Page = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState<
    "title" | "company" | "location"
  >("title");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await getAllJobs();
        setJobs(fetchedJobs as unknown as Job[]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getAnalytics = () => {
    const total = jobs.length;
    const thisMonth = jobs.filter(
      (jobs) => new Date(jobs.createdAt).getMonth() === new Date().getMonth()
    ).length;
    const recentUpdates = jobs.filter(
      (jobs) =>
        new Date(jobs.updatedAt) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { total, thisMonth, recentUpdates };
  };

  const analytics = getAnalytics();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchFilter]);

  const safeStringIncludes = (value: any, searchTerm: string): boolean => {
    if (typeof value === "string") {
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (typeof value === "number") {
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  };

  const filteredJobs = jobs.filter((job) => {
    if (!job || !searchTerm) return true;

    switch (searchFilter) {
      case "title":
        return safeStringIncludes(job?.title.name, searchTerm);
      case "company":
        return safeStringIncludes(job?.recruiter.company.name, searchTerm);
      case "location":
        return safeStringIncludes(job?.location, searchTerm);
      default:
        return true;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-2 sm:p-4 md:p-10 bg-slate-100 h-full ">
      <div className="space-y-8">
      <div className="mb-6">
          <AnalyticsCard
            total={analytics.total}
            thisMonth={analytics.thisMonth}
            recentUpdates={analytics.recentUpdates}
          />
        </div>

        <Card className="w-full bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-primary" />
                  Job Management
                </CardTitle>
                <CardDescription>
                  Manage and organize jobs in your system
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="w-full sm:w-2/3">
                <SearchAndFilter
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchFilter={searchFilter}
                  setSearchFilter={setSearchFilter}
                />
              </div>
              <div className="w-full sm:w-auto">
                <AddJobDialog />
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden bg-background/50">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="font-semibold">Job Title</TableHead>
                    <TableHead className="font-semibold">Company</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-center">Applications</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={6}>
                          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4 py-4">
                            <div className="h-4 bg-gray-200 rounded w-full sm:w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full sm:w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full sm:w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full sm:w-1/6"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : currentJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <span className="text-muted-foreground">
                          {searchTerm ? "No matching jobs found" : "No jobs available"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentJobs.map((job) => (
                      <JobRow key={job.id} job={job} />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredJobs.length)} of {filteredJobs.length} entries
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Page;