"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  createSkillMaster,
  getAllSkillMasters,
  updateSkillMaster,
  deleteSkillMaster,
} from "@/services/MasterServices/skillService";
import { SkillMaster } from "@prisma/client";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, PenSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "../common/moduleCommonTable";
import AnalyticsCard from "../common/moduleAnalyticscard";
import { DeleteDialog, FormDialog } from "../common/moduleCrudDialogue";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
});

const SkillMasterCrud: React.FC = () => {
  const [skills, setSkills] = useState<SkillMaster[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillMaster | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<SkillMaster | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllSkillMasters();
      setSkills(data);
    } catch (error) {
      toast.error("Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleAdd = async (values: z.infer<typeof formSchema>) => {
    try {
      await createSkillMaster(values.name);
      toast.success("Skill added successfully");
      await fetchSkills();
      setIsAddOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add skill");
    }
  };

  const handleEdit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedSkill) return;
    try {
      await updateSkillMaster(selectedSkill.id, values.name);
      toast.success("Skill updated successfully");
      await fetchSkills();
      setIsEditOpen(false);
      setSelectedSkill(null);
      form.reset();
    } catch (error) {
      toast.error("Failed to update skill");
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    try {
      await deleteSkillMaster(skillToDelete.id);
      toast.success("Skill deleted successfully");
      await fetchSkills();
      setDeleteDialogOpen(false);
      setSkillToDelete(null);
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  const getAnalytics = useCallback(() => {
    const total = skills.length;
    const thisMonth = skills.filter(
      (s) =>
        new Date(s.createdAt).getMonth() === new Date().getMonth() &&
        new Date(s.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const recentUpdates = skills.filter(
      (s) => new Date(s.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { total, thisMonth, recentUpdates };
  }, [skills]);

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof SkillMaster,
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as keyof SkillMaster,
      cell: (item: SkillMaster) => (
        <Badge variant="secondary" className="font-normal">
          {new Date(item.createdAt).toLocaleDateString()}
        </Badge>
      ),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt" as keyof SkillMaster,
      cell: (item: SkillMaster) => (
        <Badge variant="outline" className="font-normal">
          {new Date(item.updatedAt).toLocaleDateString()}
        </Badge>
      ),
    },
  ];

  const rowActions = (item: SkillMaster) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setSelectedSkill(item);
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
          setSkillToDelete(item);
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
        data={skills}
        columns={columns}
        title="Skills Management"
        description="Manage and organize skills in your system"
        icon={<Lightbulb className="h-6 w-6" />}
        isLoading={isLoading}
        searchable
        searchKey="name"
        searchPlaceholder="Search skills..."
        actions={rowActions}
        onRefresh={fetchSkills}
        addButton={{
          label: "Add Skill",
          onClick: () => setIsAddOpen(true),
        }}
      />

      {/* Add Dialog */}
      <FormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Add New Skill"
        description="Create a new skill entry in the system"
        form={form}
        onSubmit={handleAdd}
        submitLabel="Add Skill"
      />

      {/* Edit Dialog */}
      <FormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title="Edit Skill"
        description="Modify the existing skill details"
        form={form}
        onSubmit={handleEdit}
        submitLabel="Update Skill"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        itemName={skillToDelete?.name || ""}
        itemType="skill"
      />
    </div>
  );
};

export default SkillMasterCrud;