"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  createCertificationMaster,
  getAllCertificationMasters,
  updateCertificationMaster,
  deleteCertificationMaster,
} from "@/services/MasterServices/certificationService";
import { CertificationMaster } from "@prisma/client";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Award, PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../common/moduleCommonTable";
import AnalyticsCard from "../common/moduleAnalyticscard";
import { DeleteDialog, FormDialog } from "../common/moduleCrudDialogue";


// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const CertificationMasterCrud: React.FC = () => {
  const [certifications, setCertifications] = useState<CertificationMaster[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<CertificationMaster | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<CertificationMaster | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchCertifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllCertificationMasters();
      setCertifications(data);
    } catch (error) {
      toast.error("Failed to load certifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const handleAdd = async (values: z.infer<typeof formSchema>) => {
    try {
      await createCertificationMaster(values.name);
      toast.success("Certification added successfully");
      await fetchCertifications();
      setIsAddOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add certification");
    }
  };

  const handleEdit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedCertification) return;
    try {
      await updateCertificationMaster(selectedCertification.id, values.name);
      toast.success("Certification updated successfully");
      await fetchCertifications();
      setIsEditOpen(false);
      setSelectedCertification(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to update certification");
    }
  };

  const handleDelete = async () => {
    if (!certToDelete) return;
    try {
      await deleteCertificationMaster(certToDelete.id);
      toast.success("Certification deleted successfully");
      await fetchCertifications();
      setDeleteDialogOpen(false);
      setCertToDelete(null);
    } catch (error) {
      toast.error("Failed to delete certification");
    }
  };

  const getAnalytics = useCallback(() => {
    const total = certifications.length;
    const thisMonth = certifications.filter(
      (c) =>
        new Date(c.createdAt).getMonth() === new Date().getMonth() &&
        new Date(c.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const recentUpdates = certifications.filter(
      (c) => new Date(c.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { total, thisMonth, recentUpdates };
  }, [certifications]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof CertificationMaster,
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as keyof CertificationMaster,
      cell: (item: CertificationMaster) => (
        <Badge variant="secondary" className="font-normal">
          {new Date(item.createdAt).toLocaleDateString()}
        </Badge>
      ),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt" as keyof CertificationMaster,
      cell: (item: CertificationMaster) => (
        <Badge variant="outline" className="font-normal">
          {new Date(item.updatedAt).toLocaleDateString()}
        </Badge>
      ),
    },
  ];

  const rowActions = (item: CertificationMaster) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedCertification(item);
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
          setCertToDelete(item);
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
        data={certifications}
        columns={columns}
        title="Certification Management"
        description="Manage and organize certifications in your system"
        icon={<Award className="h-6 w-6" />}
        isLoading={isLoading}
        searchable
        searchKey="name"
        searchPlaceholder="Search certifications..."
        actions={rowActions}
        onRefresh={fetchCertifications}
        addButton={{
          label: "Add Certification",
          onClick: () => setIsAddOpen(true),
        }}
      />

      {/* Add Dialog */}
      <FormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Certification"
        description="Create a new certification entry in the system"
        form={form}
        onSubmit={handleAdd}
        submitLabel="Add Certification"
      />

      {/* Edit Dialog */}
      <FormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Certification"
        description="Modify the existing certification details"
        form={form}
        onSubmit={handleEdit}
        submitLabel="Update Certification"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        itemName={certToDelete?.name || ""}
        itemType="certification"
      />
    </div>
  );
};

export default CertificationMasterCrud;




