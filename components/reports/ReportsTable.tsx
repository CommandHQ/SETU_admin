"use client"
import { Search, Eye, CheckCircle, Trash, Ban, ClipboardList, EyeClosed } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {  ReportFor } from '@prisma/client'
import { deleteReport, updateReportStatus } from '@/services/Reports/reportActions'
import ReportDetails from './ReportDetails'
import { useState } from 'react'
import DataTable from '../common/moduleCommonTable'
import { Report, ReportStatus } from '@/types'
import { string } from 'zod'
import toast from 'react-hot-toast'

interface ReportsTableProps {
  initialReports: Report[];
  onReportSelect?: (reportId: string) => void;
}

const formatDate = (date: Date | string | number): string => {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export default function ReportsTable({ initialReports }: ReportsTableProps) {
  const [reports, setReports] = useState(initialReports.map(report => ({
    ...report,
    createdAt: new Date(report.createdAt as string)
  })))
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    await updateReportStatus(reportId, newStatus as ReportStatus)
    setReports(reports.map(report =>
      report.id === reportId ? { ...report, status: newStatus } : report
    ))
  }

  const handleDeleteReport = async (reportId: string) => {
    await deleteReport(reportId)
    toast.success("Report delete successfully");
    setReports(reports.filter(report => report.id !== reportId))
  }

  const columns = [
    {
      header: "Report ID",
      accessorKey: "id",
    },
    {
      header: "Content Type",
      accessorKey: "reportFor",
    },
    {
      header: "Reason",
      accessorKey: "category",
    },
    {
      header: "Reported By",
      accessorKey: "user",
      cell: (report: Report) => `${report.user?.firstName} ${report.user?.lastName}`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (report: Report) => (
        <Badge variant={report.status === 'PENDING' ? 'default' : "outline"}>
          {report.status}
        </Badge>
      ),
    },
    {
      header: "Date Reported",
      accessorKey: "createdAt",
      cell: (report: Report) => formatDate(report.createdAt as unknown as string),
    },
  ]

  const renderActions = (report: Report) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <Eye className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setSelectedReportId(report.id as string)}>
          <EyeClosed className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange(report.id as string, 'RESOLVED')}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as Resolved
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDeleteReport(report.id as string)}>
          <Trash className="mr-2 h-4 w-4" />
          Delete Report
        </DropdownMenuItem>
        {report.reportFor === ReportFor.USER && (
          <DropdownMenuItem onClick={() => {/* Implement user ban logic */}}>
            <Ban className="mr-2 h-4 w-4" />
            Ban User
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <DataTable
        data={reports}
        columns={columns as any}
        title="Reports Management"
        description="Monitor and manage reported content across the platform"
        icon={<ClipboardList className="h-6 w-6" />}
        searchable={true}
        searchKey="description"
        searchPlaceholder="Search reports..."
        actions={renderActions}
        itemsPerPage={10}
        emptyMessage="No reports found"
      />

      {selectedReportId && (
        <ReportDetails
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
        />
      )}
    </>
  )
}