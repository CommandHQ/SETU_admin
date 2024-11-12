"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  createJobtitleMaster,
  getAllJobtitleMasters,
  updateJobtitleMaster,
  deleteJobtitleMaster,
} from "@/services/MasterServices/jobtitleService";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../common/moduleCommonTable";
import AnalyticsCard from "../common/moduleAnalyticscard";
import { DeleteDialog, FormDialog } from "../common/moduleCrudDialogue";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Job title name is required"),
});

// Type definition for JobtitleMaster
type JobtitleMasterBasic = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const JobtitleMasterCrud: React.FC = () => {
  const [jobtitles, setJobtitles] = useState<JobtitleMasterBasic[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedJobtitle, setSelectedJobtitle] = useState<JobtitleMasterBasic | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobtitleToDelete, setJobtitleToDelete] = useState<JobtitleMasterBasic | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchJobtitles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllJobtitleMasters();
      setJobtitles(data);
    } catch (error) {
      console.error("Error fetching JobtitleMasters:", error);
      toast.error("Failed to load job titles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobtitles();
  }, [fetchJobtitles]);

  const handleAdd = async (values: z.infer<typeof formSchema>) => {
    try {
      await createJobtitleMaster(values.name);
      toast.success("Job title added successfully");
      await fetchJobtitles();
      setIsAddOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add job title");
    }
  };

  const handleEdit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedJobtitle) return;
    try {
      await updateJobtitleMaster(selectedJobtitle.id, values.name);
      toast.success("Job title updated successfully");
      await fetchJobtitles();
      setIsEditOpen(false);
      setSelectedJobtitle(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to update job title");
    }
  };

  const handleDelete = async () => {
    if (!jobtitleToDelete) return;
    try {
      await deleteJobtitleMaster(jobtitleToDelete.id);
      toast.success("Job title deleted successfully");
      await fetchJobtitles();
      setDeleteDialogOpen(false);
      setJobtitleToDelete(null);
    } catch (error) {
      toast.error("Failed to delete job title");
    }
  };

  const getAnalytics = useCallback(() => {
    const total = jobtitles.length;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = jobtitles.filter(
      (jt) => new Date(jt.createdAt) >= startOfMonth
    ).length;
    const recentUpdates = jobtitles.filter(
      (jt) => new Date(jt.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { total, thisMonth, recentUpdates };
  }, [jobtitles]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof JobtitleMasterBasic,
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as keyof JobtitleMasterBasic,
      cell: (item: JobtitleMasterBasic) => (
        <Badge variant="secondary" className="font-normal">
          {new Date(item.createdAt).toLocaleDateString()}
        </Badge>
      ),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt" as keyof JobtitleMasterBasic,
      cell: (item: JobtitleMasterBasic) => (
        <Badge variant="outline" className="font-normal">
          {new Date(item.updatedAt).toLocaleDateString()}
        </Badge>
      ),
    },
  ];

  const rowActions = (item: JobtitleMasterBasic) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedJobtitle(item);
          form.setValue("name", item.name);
          setIsEditOpen(true);
        }}
        className="hover:bg-primary/10"
      >
        <PenSquare className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setJobtitleToDelete(item);
          setDeleteDialogOpen(true);
        }}
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const analytics = getAnalytics();

  return (
    <div className="p-4 space-y-4">
      <div>
        <AnalyticsCard
          total={analytics.total}
          thisMonth={analytics.thisMonth}
          recentUpdates={analytics.recentUpdates}
        />
      </div>
      <DataTable
        data={jobtitles}
        columns={columns}
        title="Job Title Management"
        description="Manage and organize job titles within your organization"
        icon={<BookOpen className="h-6 w-6" />}
        isLoading={isLoading}
        searchable
        searchKey="name"
        searchPlaceholder="Search job titles..."
        actions={rowActions}
        onRefresh={fetchJobtitles}
        addButton={{
          label: "Add Job Title",
          onClick: () => setIsAddOpen(true),
        }}
      />

      {/* Add Dialog */}
      <FormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Job Title"
        description="Create a new job title entry in the system"
        form={form}
        onSubmit={handleAdd}
        submitLabel="Add Job Title"
      />

      {/* Edit Dialog */}
      <FormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Job Title"
        description="Modify the existing job title details"
        form={form}
        onSubmit={handleEdit}
        submitLabel="Update Job Title"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        itemName={jobtitleToDelete?.name || ""}
        itemType="job title"
      />
    </div>
  );
};

export default JobtitleMasterCrud;