// AddJobDialog.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import JobCreationForm from "./JobCreationForm";

const AddJobDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gray-900 hover:bg-gray-950 text-white font-medium p-2 rounded-lg flex items-center">
          <Plus className="w-5 h-5" />
          <span>Add New Job</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl h-[90vh] p-0 bg-gray-50">
        <DialogHeader className="px-6 py-2 bg-gradient-to-r from-gray-900 to-gray-950 rounded-md">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2 mt-5">
            Create New Job Position
          </DialogTitle>
        </DialogHeader>
        <JobCreationForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddJobDialog;