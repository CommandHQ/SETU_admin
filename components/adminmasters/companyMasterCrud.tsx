"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  createCompanyMaster,
  getAllCompanyMasters,
  updateCompanyMaster,
  deleteCompanyMaster,
} from "@/services/MasterServices/companyService";
import { CompanyMaster } from "@prisma/client";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../common/moduleCommonTable";
import AnalyticsCard from "../common/moduleAnalyticscard";
import { CompanyFormDialog, CompanyDeleteDialog, companyFormSchema, CompanyFormValues } from "../common/companyDialogue";

const defaultFormValues: CompanyFormValues = {
  name: "",
  logo: "",
  industry: "",
  website: "",
  location: "",
};

const CompanyMasterCrud: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyMaster[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyMaster | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<CompanyMaster | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: defaultFormValues,
  });

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllCompanyMasters();
      setCompanies(data);
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Handler for opening add dialog
  const handleAddClick = () => {
    form.reset(defaultFormValues);
    setIsAddOpen(true);
  };

  // Handler for add dialog state changes
  const handleAddDialogChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultFormValues);
    }
    setIsAddOpen(open);
  };

  // Handler for edit dialog state changes
  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      form.reset(defaultFormValues);
      setSelectedCompany(null);
    }
    setIsEditOpen(open);
  };

  const handleAdd = async (values: CompanyFormValues) => {
    try {
      await createCompanyMaster(
        values.name,
        values.logo,
        values.industry,
        values.website,
        values.location
      );
      toast.success("Company added successfully");
      await fetchCompanies();
      setIsAddOpen(false);
      form.reset(defaultFormValues);
    } catch (error) {
      toast.error("Failed to add company");
    }
  };

  const handleEdit = async (values: CompanyFormValues) => {
    if (!selectedCompany) return;
    try {
      await updateCompanyMaster(
        selectedCompany.id,
        values.name,
        values.logo,
        values.industry,
        values.website,
        values.location
      );
      toast.success("Company updated successfully");
      await fetchCompanies();
      setIsEditOpen(false);
      setSelectedCompany(null);
      form.reset(defaultFormValues);
    } catch (error) {
      toast.error("Failed to update company");
    }
  };

  const handleDelete = async () => {
    if (!companyToDelete) return;
    try {
      await deleteCompanyMaster(companyToDelete.id);
      toast.success("Company deleted successfully");
      await fetchCompanies();
      setIsDeleteDialogOpen(false);
      setCompanyToDelete(null);
    } catch (error) {
      toast.error("Failed to delete company");
    }
  };

  const getAnalytics = useCallback(() => {
    const total = companies.length;
    const thisMonth = companies.filter(
      (c) =>
        new Date(c.createdAt).getMonth() === new Date().getMonth() &&
        new Date(c.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const recentUpdates = companies.filter(
      (c) => new Date(c.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { total, thisMonth, recentUpdates };
  }, [companies]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof CompanyMaster,
    },
    {
      header: "Logo",
      accessorKey: "logo" as keyof CompanyMaster,
      cell: (item: CompanyMaster) => (
        item.logo ? (
          <img src={item.logo} alt={`${item.name} Logo`} className="h-8 w-8 object-contain" />
        ) : "-"
      ),
    },
    {
      header: "Industry",
      accessorKey: "industry" as keyof CompanyMaster,
      cell: (item: CompanyMaster) => (
        <Badge variant="secondary" className="font-normal">
          {item.industry || "-"}
        </Badge>
      ),
    },
    {
      header: "Location",
      accessorKey: "location" as keyof CompanyMaster,
    },
    {
      header: "Website",
      accessorKey: "website" as keyof CompanyMaster,
      cell: (item: CompanyMaster) => (
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
        ) : "-"
      ),
    },
  ];

  const rowActions = (item: CompanyMaster) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedCompany(item);
          form.reset({
            name: item.name,
            logo: item.logo || "",
            industry: item.industry || "",
            website: item.website || "",
            location: item.location || "",
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
          setCompanyToDelete(item);
          setIsDeleteDialogOpen(true);
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
        data={companies}
        columns={columns}
        title="Company Management"
        description="Manage and organize companies in your system"
        icon={<Building2 className="h-6 w-6" />}
        isLoading={isLoading}
        searchable
        searchKey="name"
        searchPlaceholder="Search companies..."
        actions={rowActions}
        onRefresh={fetchCompanies}
        addButton={{
          label: "Add Company",
          onClick: handleAddClick,
        }}
      />

      {/* Add Dialog */}
      <CompanyFormDialog
        open={isAddOpen}
        onOpenChange={handleAddDialogChange}
        title="Add New Company"
        description="Create a new company entry in the system"
        form={form}
        onSubmit={handleAdd}
        submitLabel="Add Company"
      />

      {/* Edit Dialog */}
      <CompanyFormDialog
        open={isEditOpen}
        onOpenChange={handleEditDialogChange}
        title="Edit Company"
        description="Modify the existing company details"
        form={form}
        onSubmit={handleEdit}
        submitLabel="Update Company"
      />

      {/* Delete Dialog */}
      <CompanyDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        companyName={companyToDelete?.name || ""}
      />
    </div>
  );
};

export default CompanyMasterCrud;