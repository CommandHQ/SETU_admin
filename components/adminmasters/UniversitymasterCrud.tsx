"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  createUniversityMaster,
  getAllUniversityMasters,
  updateUniversityMaster,
  deleteUniversityMaster,
} from "@/services/MasterServices/universityService";
import { UniversityMaster } from "@prisma/client";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Globe, BookOpen, Trash2, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../common/moduleCommonTable";
import AnalyticsCard from "../common/moduleAnalyticscard";
import { DeleteDialog } from "../common/moduleCrudDialogue";
import { FormDialog } from "../common/universityDialogue";

// Form validation schema
const universityFormSchema = z.object({
  name: z.string().min(1, "University name is required"),
  location: z.string().optional(),
  country: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof universityFormSchema>;

const defaultFormValues = {
  name: "",
  location: "",
  country: "",
  website: "",
};

const UniversityMasterCrud: React.FC = () => {
  const [universities, setUniversities] = useState<UniversityMaster[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityMaster | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState<UniversityMaster | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(universityFormSchema),
    defaultValues: defaultFormValues,
  });

  const fetchUniversities = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllUniversityMasters();
      setUniversities(data);
    } catch (error) {
      toast.error("Failed to load universities");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // Reset form to defaults when opening add dialog
  const handleAddClick = () => {
    form.reset(defaultFormValues);
    setIsAddOpen(true);
  };

  // Reset form when dialogs are closed
  const handleAddDialogChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultFormValues);
    }
    setIsAddOpen(open);
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultFormValues);
      setSelectedUniversity(null);
    }
    setIsEditOpen(open);
  };

  const handleAdd = async (values: FormValues) => {
    try {
      await createUniversityMaster(
        values.name,
        values.location,
        values.country,
        values.website
      );
      toast.success("University added successfully");
      await fetchUniversities();
      setIsAddOpen(false);
      form.reset(defaultFormValues);
    } catch (error) {
      toast.error("Failed to add university");
    }
  };

  const handleEdit = async (values: FormValues) => {
    if (!selectedUniversity) return;
    try {
      await updateUniversityMaster(
        selectedUniversity.id,
        values.name,
        values.location,
        values.country,
        values.website
      );
      toast.success("University updated successfully");
      await fetchUniversities();
      setIsEditOpen(false);
      setSelectedUniversity(null);
      form.reset(defaultFormValues);
    } catch (error) {
      toast.error("Failed to update university");
    }
  };

  const handleDelete = async () => {
    if (!universityToDelete) return;
    try {
      await deleteUniversityMaster(universityToDelete.id);
      toast.success("University deleted successfully");
      await fetchUniversities();
      setDeleteDialogOpen(false);
      setUniversityToDelete(null);
    } catch (error) {
      toast.error("Failed to delete university");
    }
  };

  const getAnalytics = useCallback(() => {
    const total = universities.length;
    const thisMonth = universities.filter(
      (u) =>
        new Date(u.createdAt).getMonth() === new Date().getMonth() &&
        new Date(u.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const recentUpdates = universities.filter(
      (u) => new Date(u.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { total, thisMonth, recentUpdates };
  }, [universities]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof UniversityMaster,
    },
    {
      header: "Location",
      accessorKey: "location" as keyof UniversityMaster,
      cell: (item: UniversityMaster) => item.location || "-",
    },
    {
      header: "Country",
      accessorKey: "country" as keyof UniversityMaster,
      cell: (item: UniversityMaster) => item.country || "-",
    },
    {
      header: "Website",
      accessorKey: "website" as keyof UniversityMaster,
      cell: (item: UniversityMaster) =>
        item.website ? (
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Globe className="h-4 w-4 mr-1" />
            Visit
          </a>
        ) : (
          "-"
        ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as keyof UniversityMaster,
      cell: (item: UniversityMaster) => (
        <Badge variant="secondary" className="font-normal">
          {new Date(item.createdAt).toLocaleDateString()}
        </Badge>
      ),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt" as keyof UniversityMaster,
      cell: (item: UniversityMaster) => (
        <Badge variant="outline" className="font-normal">
          {new Date(item.updatedAt).toLocaleDateString()}
        </Badge>
      ),
    },
  ];

  const rowActions = (item: UniversityMaster) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedUniversity(item);
          form.reset({
            name: item.name,
            location: item.location || "",
            country: item.country || "",
            website: item.website || "",
          });
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
          setUniversityToDelete(item);
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
        data={universities}
        columns={columns}
        title="Universities Management"
        description="Manage and organize universities in your system"
        icon={<BookOpen className="h-6 w-6" />}
        isLoading={isLoading}
        searchable
        searchKey="name"
        searchPlaceholder="Search universities..."
        actions={rowActions}
        onRefresh={fetchUniversities}
        addButton={{
          label: "Add University",
          onClick: handleAddClick,
        }}
      />

      {/* Add Dialog */}
      <FormDialog
        open={isAddOpen}
        onOpenChange={handleAddDialogChange}
        title="Add New University"
        description="Create a new university entry in the system"
        form={form}
        onSubmit={handleAdd}
        submitLabel="Add University"
      />

      {/* Edit Dialog */}
      <FormDialog
        open={isEditOpen}
        onOpenChange={handleEditDialogChange}
        title="Edit University"
        description="Modify the existing university details"
        form={form}
        onSubmit={handleEdit}
        submitLabel="Update University"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        itemName={universityToDelete?.name || ""}
        itemType="university"
      />
    </div>
  );
};

export default UniversityMasterCrud;