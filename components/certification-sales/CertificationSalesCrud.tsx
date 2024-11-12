"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  createCertificationSale,
  getAllCertificationSales,
  updateCertificationSale,
  deleteCertificationSale,
} from "@/services/certification-sales/certificationSalesService";
import { CertificationSales } from "@prisma/client";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../common/moduleCommonTable";
import AnalyticsCard from "../common/moduleAnalyticscard";
import { DeleteDialog } from "../common/moduleCrudDialogue";
import { FormDialog } from "../common/cetificationsalesDialogue";

const certificationSaleFormSchema = z.object({
  type: z.string().min(1, "Type is required"),
  course: z.string().min(1, "Course is required"),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Price must be a positive number")
  ),
  tax: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Tax must be a positive number")
  ),
  discount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Discount must be a positive number")
  ),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Invalid Image URL"),
});

type FormValues = z.infer<typeof certificationSaleFormSchema>;

const CertificationSalesCrud = () => {
  const [sales, setSales] = useState<CertificationSales[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<CertificationSales | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<CertificationSales | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addForm = useForm<FormValues>({
    resolver: zodResolver(certificationSaleFormSchema),
  });

  const editForm = useForm<FormValues>({
    resolver: zodResolver(certificationSaleFormSchema),
    defaultValues: {
      type: "",
      course: "",
      price: undefined,
      tax: undefined,
      discount: undefined,
      description: "",
      image: "",
    },
  });

  // Reset form when dialogs close
  useEffect(() => {
    if (!isAddOpen && !isEditOpen) {
      addForm.reset();
      editForm.reset();
    }
  }, [isAddOpen, isEditOpen, addForm, editForm]);

  // Populate form when editing
  useEffect(() => {
    if (selectedSale && isEditOpen) {
      editForm.reset({
        type: selectedSale.type,
        course: selectedSale.course,
        price: selectedSale.price,
        tax: selectedSale.tax,
        discount: selectedSale.discount,
        description: selectedSale.description,
        image: selectedSale.image,
      });
    }
  }, [selectedSale, isEditOpen, editForm]);

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllCertificationSales();
      setSales(data);
    } catch (error) {
      toast.error("Failed to load certification sales");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleAdd = async (values: FormValues) => {
    try {
      await createCertificationSale(values);
      toast.success("Certification sale added successfully");
      await fetchSales();
      setIsAddOpen(false);
      addForm.reset();
    } catch (error) {
      toast.error("Failed to add certification sale");
    }
  };

  const handleEdit = async (values: FormValues) => {
    if (!selectedSale) return;
    try {
      await updateCertificationSale(selectedSale.id, values);
      toast.success("Certification sale updated successfully");
      await fetchSales();
      setIsEditOpen(false);
      setSelectedSale(null);
      editForm.reset();
    } catch (error) {
      toast.error("Failed to update certification sale");
    }
  };
  const handleDelete = async () => {
    if (!saleToDelete) return;
    try {
      await deleteCertificationSale(saleToDelete.id);
      toast.success("Certification sale deleted successfully");
      await fetchSales();
      setDeleteDialogOpen(false);
      setSaleToDelete(null);
    } catch (error) {
      toast.error("Failed to delete certification sale");
    }
  };

  const getAnalytics = useCallback(() => {
    const total = sales.length;
    const thisMonth = sales.filter(
      (sale) =>
        new Date(sale.createdAt).getMonth() === new Date().getMonth() &&
        new Date(sale.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const recentUpdates = sales.filter(
      (sale) => new Date(sale.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    return { total, thisMonth, recentUpdates };
  }, [sales]);

  const columns = [
    {
      header: "Type",
      accessorKey: "type" as keyof CertificationSales,
    },
    {
      header: "Course",
      accessorKey: "course" as keyof CertificationSales,
    },
    {
      header: "Price",
      accessorKey: "price" as keyof CertificationSales,
      cell: (item: CertificationSales) => (
        <Badge variant="secondary">₹{item.price.toFixed(2)}</Badge>
      ),
    },
    {
      header: "Tax",
      accessorKey: "tax" as keyof CertificationSales,
      cell: (item: CertificationSales) => (
        <Badge variant="outline">₹{item.tax.toFixed(2)}</Badge>
      ),
    },
    {
      header: "Discount",
      accessorKey: "discount" as keyof CertificationSales,
      cell: (item: CertificationSales) => (
        <Badge variant="outline">₹{item.discount.toFixed(2)}</Badge>
      ),
    },
    {
      header: "Description",
      accessorKey: "description" as keyof CertificationSales,
      cell: (item: CertificationSales) => (
        <div className="max-w-xs truncate">{item.description}</div>
      ),
    },
    {
      header: "Image",
      accessorKey: "image" as keyof CertificationSales,
      cell: (item: CertificationSales) => (
        <img src={item.image} alt={item.course} className="w-16 h-16 object-cover rounded" />
      ),
    },
  ];

  const rowActions = (item: CertificationSales) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedSale(item);
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
          setSaleToDelete(item);
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
    <div className="px-8 p-4 space-y-4">
      <div>
        <AnalyticsCard
          total={analytics.total}
          thisMonth={analytics.thisMonth}
          recentUpdates={analytics.recentUpdates}
        />
      </div>

      <DataTable
        data={sales}
        columns={columns}
        title="Certification Sales Management"
        description="Manage and organize certification sales in your system"
        icon={<BookOpen className="h-6 w-6" />}
        isLoading={isLoading}
        searchable
        searchKey="course"
        searchPlaceholder="Search certification sales..."
        actions={rowActions}
        onRefresh={fetchSales}
        addButton={{
          label: "Add Certification Sale",
          onClick: () => setIsAddOpen(true),
        }}
      />

      {/* Add Dialog */}
      <FormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Certification Sale"
        description="Create a new certification sale entry in the system"
        form={addForm}
        onSubmit={handleAdd}
        submitLabel="Add Certification Sale"
      />

      {/* Edit Dialog */}
      <FormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Certification Sale"
        description="Modify the existing certification sale details"
        form={editForm}
        onSubmit={handleEdit}
        submitLabel="Update Certification Sale"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        itemName={saleToDelete?.course || ""}
        itemType="certification sale"
      />
    </div>
  );
};

export default CertificationSalesCrud;