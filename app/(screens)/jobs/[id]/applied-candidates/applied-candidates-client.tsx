'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAppliedCandidates, updateApplicationStatus } from '@/services/Job_services/jobService';
import { MoreVertical, Edit, Clock, Eye, Calendar, UserCheck, Send, Award, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ApplicationStatus } from '@/types';

interface AppliedJob {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  appliedAt: string;
  lastUpdatedAt: string;
  status: ApplicationStatus;
}

const ITEMS_PER_PAGE = 10; 

const getStatusConfig = (status: ApplicationStatus) => {
  const configs = {
    APPLIED: {
      variant: 'outline',
      icon: Clock,
      className: 'bg-gray-100 text-gray-800'
    },
    RESUME_VIEWED: {
      variant: 'default',
      icon: Eye,
      className: 'bg-blue-100 text-blue-800'
    },
    INTERVIEW_SCHEDULED: {
      variant: 'default',
      icon: Calendar,
      className: 'bg-purple-100 text-purple-800'
    },
    INTERVIEWED: {
      variant: 'default',
      icon: UserCheck,
      className: 'bg-indigo-100 text-indigo-800'
    },
    OFFER_EXTENDED: {
      variant: 'default',
      icon: Send,
      className: 'bg-yellow-100 text-yellow-800'
    },
    HIRED: {
      variant: 'secondary',
      icon: Award,
      className: 'bg-green-100 text-green-800'
    },
    REJECTED: {
      variant: 'destructive',
      icon: XCircle,
      className: 'bg-red-100 text-red-800'
    }
  };

  return configs[status] || configs.APPLIED;
};

export function AppliedCandidatesClient() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getAppliedCandidates(id);
        setApplications(data as unknown as AppliedJob[]);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      } catch (err) {
        setError('Failed to fetch applications. Please try again later.');
        console.error('Error fetching applications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    startTransition(async () => {
      try {
        await updateApplicationStatus(applicationId, newStatus);
        setApplications(applications.map(application => 
          application.id === applicationId 
            ? { ...application, status: newStatus, lastUpdatedAt: new Date().toISOString() }
            : application
        ));
      } catch (error) {
        console.error('Error updating status:', error);
      } finally {
        setEditingId(null);
      }
    });
  };

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Get current page's data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return applications.slice(startIndex, endIndex);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-2xl mt-8">
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-6xl m-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Applied Candidates for Job {id}</CardTitle>
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          className="ml-4"
        >
          Go Back
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-medium">Candidate Name</TableCell>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell className="font-medium">Applied At</TableCell>
                <TableCell className="font-medium">Status</TableCell>
                <TableCell className="font-medium">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().length > 0 ? (
                getCurrentPageData().map((application) => {
                  const statusConfig = getStatusConfig(application.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <TableRow key={application.id}>
                      <TableCell>{application.user.firstName + " " + application.user.lastName}</TableCell>
                      <TableCell>{application.user.email}</TableCell>
                      <TableCell>
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusConfig.variant as any}
                          className={`flex items-center gap-1 ${statusConfig.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{application.status.replace(/_/g, ' ').toLowerCase()}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(application.id)}
                              disabled={isPending}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(application.id, ApplicationStatus.APPLIED)}
                            >
                              Applied
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(application.id, ApplicationStatus.RESUME_VIEWED)}
                            >
                              Resume Viewed
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(application.id, ApplicationStatus.INTERVIEW_SCHEDULED)}
                            >
                              Interview Scheduled
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(application.id, ApplicationStatus.INTERVIEWED)}
                            >
                              Interviewed
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(application.id, ApplicationStatus.OFFER_EXTENDED)}
                            >
                              Offer Extended
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(application.id, ApplicationStatus.HIRED)}
                            >
                              Hired
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(application.id, ApplicationStatus.REJECTED)}
                            >
                              <span className="text-red-600">Rejected</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {applications.length > 0 && (
          <div className="flex items-center justify-between px-2 py-4 mt-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, applications.length)} of {applications.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {getPageNumbers().map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className="h-8 w-8 p-0"
                >
                  {pageNumber}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}