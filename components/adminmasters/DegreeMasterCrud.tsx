"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  createDegreeMaster,
  getAllDegreeMasters,
  updateDegreeMaster,
  deleteDegreeMaster,
} from "@/services/MasterServices/degreeService";
import { DegreeMaster } from "@prisma/client";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../common/moduleCommonTable";
import AnalyticsCard from "../common/moduleAnalyticscard";
import { DeleteDialog, FormDialog } from "../common/moduleCrudDialogue";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Degree name is required"),
});

const DegreeMasterCrud: React.FC = () => {
  const [degrees, setDegrees] = useState<DegreeMaster[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<DegreeMaster | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [degreeToDelete, setDegreeToDelete] = useState<DegreeMaster | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchDegrees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllDegreeMasters();
      setDegrees(data);
    } catch (error) {
      toast.error("Failed to load degrees");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDegrees();
  }, [fetchDegrees]);

  const handleAdd = async (values: z.infer<typeof formSchema>) => {
    try {
      await createDegreeMaster(values.name);
      toast.success("Degree added successfully");
      await fetchDegrees();
      setIsAddOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add degree");
    }
  };

  const handleEdit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedDegree) return;
    try {
      await updateDegreeMaster(selectedDegree.id, values.name);
      toast.success("Degree updated successfully");
      await fetchDegrees();
      setIsEditOpen(false);
      setSelectedDegree(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to update degree");
    }
  };

  const handleDelete = async () => {
    if (!degreeToDelete) return;
    try {
      await deleteDegreeMaster(degreeToDelete.id);
      toast.success("Degree deleted successfully");
      await fetchDegrees();
      setDeleteDialogOpen(false);
      setDegreeToDelete(null);
    } catch (error) {
      toast.error("Failed to delete degree");
    }
  };

  const getAnalytics = useCallback(() => {
    const total = degrees.length;
    const thisMonth = degrees.filter(
      (d) =>
        new Date(d.createdAt).getMonth() === new Date().getMonth() &&
        new Date(d.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const recentUpdates = degrees.filter(
      (d) => new Date(d.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { total, thisMonth, recentUpdates };
  }, [degrees]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof DegreeMaster,
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as keyof DegreeMaster,
      cell: (item: DegreeMaster) => (
        <Badge variant="secondary" className="font-normal">
          {new Date(item.createdAt).toLocaleDateString()}
        </Badge>
      ),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt" as keyof DegreeMaster,
      cell: (item: DegreeMaster) => (
        <Badge variant="outline" className="font-normal">
          {new Date(item.updatedAt).toLocaleDateString()}
        </Badge>
      ),
    },
  ];

  const rowActions = (item: DegreeMaster) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedDegree(item);
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
          setDegreeToDelete(item);
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
        data={degrees}
        columns={columns}
        title="Degree Management"
        description="Manage and organize degrees in your system"
        icon={<GraduationCap className="h-6 w-6" />}
        isLoading={isLoading}
        searchable
        searchKey="name"
        searchPlaceholder="Search degrees..."
        actions={rowActions}
        onRefresh={fetchDegrees}
        addButton={{
          label: "Add Degree",
          onClick: () => setIsAddOpen(true),
        }}
      />

      {/* Add Dialog */}
      <FormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Degree"
        description="Create a new degree entry in the system"
        form={form}
        onSubmit={handleAdd}
        submitLabel="Add Degree"
      />

      {/* Edit Dialog */}
      <FormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Degree"
        description="Modify the existing degree details"
        form={form}
        onSubmit={handleEdit}
        submitLabel="Update Degree"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        itemName={degreeToDelete?.name || ""}
        itemType="degree"
      />
    </div>
  );
};

export default DegreeMasterCrud;