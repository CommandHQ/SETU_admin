"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // Ensure you have a Dialog component or use a library like Radix UI
import { Button } from "@/components/ui/button";
import { useForm, FormProvider, SubmitHandler, DefaultValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Path } from "react-hook-form";

export interface Field {
  name: string;
  label: string;
  type: string;
  isRequired: boolean;
}

interface ModalFormProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValues?: DefaultValues<T>;
  onSubmit: (values: T) => Promise<void>;
  fields: Field[];
  error?: string | null;
}

const ModalForm = <T extends Record<string, any>>({
  isOpen,
  onClose,
  title,
  initialValues = {} as DefaultValues<T>,
  onSubmit,
  fields,
  error,
}: ModalFormProps<T>) => {
  const methods = useForm<T>({
    defaultValues: initialValues,
  });

  const handleSubmit: SubmitHandler<T> = async (values) => {
    await onSubmit(values);
    methods.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogClose />
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  {...methods.register(field.name as Path<T>, {
                    required: field.isRequired ? `${field.label} is required` : false,
                  })}
                  className={methods.formState.errors[field.name] ? "border-red-500" : ""}
                />
                {methods.formState.errors[field.name] && (
                  <p className="text-sm text-red-500">
                    {methods.formState.errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            ))}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  methods.reset(initialValues);
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={methods.formState.isSubmitting}>
                {methods.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ModalForm;
