// app/reports/components/ReportDetails.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, AlertTriangle, Ban } from 'lucide-react'
import { Report, ReportFor } from '@prisma/client'
import { approveReportedContent, banUser, deleteReportedContent, getReportDetails, updateReportStatus, warnUser } from '@/services/Reports/reportActions'
import { ReportStatus } from '@/types'

interface ReportDetailsProps {
  reportId: string;
  onClose: () => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export default function ReportDetails({ reportId, onClose }: ReportDetailsProps) {
  const [report, setReport] = useState<Report | null>(null)
  const [reportedContent, setReportedContent] = useState<any>(null)

  useEffect(() => {
    if (reportId) {
      fetchReportDetails(reportId)
    }
  }, [reportId])

  const fetchReportDetails = async (id: string) => {
    const details = await getReportDetails(id)
    if (details) {
      setReport(details.report)
      setReportedContent(details.reportedContent)
    }
  }


  const handleStatusChange = async (newStatus: ReportStatus) => {
    if (report) {
      await updateReportStatus(report.id, newStatus)
      setReport((prevReport) => {
        if (prevReport) {
          return { ...prevReport, status: newStatus }
        }
        return prevReport
      })
    }
  }

  const handleDeleteContent = async () => {
    if (report) {
      await deleteReportedContent(report)
      onClose()
    }
  }

  const handleApproveContent = async()=>{
    if(report){
      await approveReportedContent(report)
      onClose()
    }
  }

  const handleWarnUser = async () => {
    if (report) {
      await warnUser(report.userId)
    }
  }

  const handleBanUser = async () => {
    if (report) {
      await banUser(report.userId)
    }
  }

  if (!report) return null

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            Review the details of the reported content
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Reported Content</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="content">
            <div className="grid gap-4 py-4">
              <div>
                <Label>Content Type</Label>
                <Input value={report.reportFor} readOnly />
              </div>
              <div>
                <Label>Reported Content</Label>
                <Textarea 
                  value={
                    report.reportFor === ReportFor.POST ? reportedContent?.content :
                    report.reportFor === ReportFor.BLOG ? reportedContent?.content :
                    report.reportFor === ReportFor.JOB ? JSON.stringify(reportedContent, null, 2) :
                    report.reportFor === ReportFor.COURSE ? reportedContent?.title :
                    report.reportFor === ReportFor.USER ? reportedContent?.email :
                    'Content not available'
                  } 
                  readOnly 
                  className="h-[200px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reported By</Label>
                  <Input value={report.userId} readOnly />
                </div>
                <div>
                  <Label>Date Reported</Label>
                  <Input value={formatDate(new Date(report.createdAt))} readOnly suppressHydrationWarning />
                </div>
              </div>
              <div>
                <Label>Reason for Report</Label>
                <Input value={report.category} readOnly />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="actions">
            <div className="grid gap-4 py-4">
              <div>
                <Label>Current Status</Label>
                <Select defaultValue={(report as any).status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Admin Notes</Label>
                <Textarea placeholder="Add notes about this report..." className="h-[100px]" />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={handleApproveContent}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Content
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleDeleteContent}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Remove Content
                </Button>
              </div>
              {report.reportFor === ReportFor.USER && (
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={handleWarnUser}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Warn User
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleBanUser}>
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}