"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  createFieldofstudyMaster,
  getAllFieldofstudyMasters,
  updateFieldofstudyMaster,
  deleteFieldofstudyMaster,
} from "@/services/MasterServices/fieldofstudyService";
import { FieldofstudyMaster } from "@prisma/client";
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

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Field of study name is required"),
});

const FieldofstudyMasterCrud: React.FC = () => {
  const [fields, setFields] = useState<FieldofstudyMaster[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldofstudyMaster | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<FieldofstudyMaster | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchFields = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllFieldofstudyMasters();
      setFields(data);
    } catch (error) {
      toast.error("Failed to load fields of study");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleAdd = async (values: z.infer<typeof formSchema>) => {
    try {
      await createFieldofstudyMaster(values.name);
      toast.success("Field of study added successfully");
      await fetchFields();
      setIsAddOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add field of study");
    }
  };

  const handleEdit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedField) return;
    try {
      await updateFieldofstudyMaster(selectedField.id, values.name);
      toast.success("Field of study updated successfully");
      await fetchFields();
      setIsEditOpen(false);
      setSelectedField(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to update field of study");
    }
  };

  const handleDelete = async () => {
    if (!fieldToDelete) return;
    try {
      await deleteFieldofstudyMaster(fieldToDelete.id);
      toast.success("Field of study deleted successfully");
      await fetchFields();
      setDeleteDialogOpen(false);
      setFieldToDelete(null);
    } catch (error) {
      toast.error("Failed to delete field of study");
    }
  };

  const getAnalytics = useCallback(() => {
    const total = fields.length;
    const thisMonth = fields.filter(
      (f) =>
        new Date(f.createdAt).getMonth() === new Date().getMonth() &&
        new Date(f.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const recentUpdates = fields.filter(
      (f) => new Date(f.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { total, thisMonth, recentUpdates };
  }, [fields]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof FieldofstudyMaster,
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as keyof FieldofstudyMaster,
      cell: (item: FieldofstudyMaster) => (
        <Badge variant="secondary" className="font-normal">
          {new Date(item.createdAt).toLocaleDateString()}
        </Badge>
      ),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt" as keyof FieldofstudyMaster,
      cell: (item: FieldofstudyMaster) => (
        <Badge variant="outline" className="font-normal">
          {new Date(item.updatedAt).toLocaleDateString()}
        </Badge>
      ),
    },
  ];

  const rowActions = (item: FieldofstudyMaster) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedField(item);
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
          setFieldToDelete(item);
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
        data={fields}
        columns={columns}
        title="Field of Study Management"
        description="Manage and organize academic fields of study in your system"
        icon={<BookOpen className="h-6 w-6" />}
        isLoading={isLoading}
        searchable
        searchKey="name"
        searchPlaceholder="Search fields of study..."
        actions={rowActions}
        onRefresh={fetchFields}
        addButton={{
          label: "Add Field of Study",
          onClick: () => setIsAddOpen(true),
        }}
      />

      {/* Add Dialog */}
      <FormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Field of Study"
        description="Create a new field of study entry in the system"
        form={form}
        onSubmit={handleAdd}
        submitLabel="Add Field of Study"
      />

      {/* Edit Dialog */}
      <FormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Field of Study"
        description="Modify the existing field of study details"
        form={form}
        onSubmit={handleEdit}
        submitLabel="Update Field of Study"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        itemName={fieldToDelete?.name || ""}
        itemType="field of study"
      />
    </div>
  );
};

export default FieldofstudyMasterCrud;