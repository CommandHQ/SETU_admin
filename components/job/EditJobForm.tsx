
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateJob } from "@/services/Job_services/jobService";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import SearchComponent from "../adminJobs/searchComponents";
import { Job } from "@/types";
import { Switch } from "@/components/ui/switch";
import {JobStatus } from "@prisma/client";
import toast from "react-hot-toast";

interface Option {
  value: string;
  label: string;
}

type FieldType = {
  name: string;
  label: string;
  type: string;
  options?: string[];
  isMulti?: boolean;
  required?: boolean;
};

const steps: { title: string; fields: FieldType[] }[] = [
  {
    title: "Job Details",
    fields: [
      { name: "titleId", label: "Job Title", type: "select", required: true },
      { name: "recruiterId", label: "Recruiter ID", type: "select", required: true },
      { name: "location", label: "Location", type: "input", required: true },
      {
        name: "locationType",
        label: "Location Type",
        type: "select",
        options: ["Remote", "Hybrid", "On-site"],
        required: true,
      },
      {
        name: "employmentType",
        label: "Employment Type",
        type: "select",
        options: ["Full-time", "Part-time", "Contract", "Internship"],
        required: true,
      },
      { name: "salary", label: "Salary", type: "input", required: true },
      { name: "openings", label: "Openings", type: "input", required: true },
    ],
  },
  {
    title: "Job Description",
    fields: [
      { name: "description", label: "Job Description", type: "textarea", required: true },
    ],
  },
  {
    title: "Requirements",
    fields: [
      {
        name: "skills",
        label: "Required Skills",
        type: "select",
        isMulti: true,
        required: true,
      },
      {
        name: "experience",
        label: "Experience Level",
        type: "select",
        options: ["Entry-level", "Mid-level", "Senior", "Executive"],
        required: true,
      },
      {
        name: "department",
        label: "Department",
        type: "select",
        isMulti: true,
        required: true,
      },
      {
        name: "education",
        label: "Education Requirements",
        type: "select",
        isMulti: true,
        required: true,
      },
    ],
  },
  {
    title: "Company Information",
    fields: [
      { name: "industryType", label: "Industry Type", type: "input", required: true },
      {
        name: "companyDescription",
        label: "Company Description",
        type: "textarea",
        required: true,
      },
      { name: "companyWebsite", label: "Company Website", type: "input", required: true },
    ],
  },
];

interface EditJobFormProps {
  job: Job;
  onClose: () => void;
  onUpdateJob?: (updatedJob: Job) => void;
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job, onClose, onUpdateJob }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Job | any >({
        ...job,
        salary: job.salary?.toString() || "",
        openings: job.openings?.toString() || "",
        skills: job.skills?.map((skill) => ({ id: skill.id, name: skill.name })) || [],
        education: job.education?.map((edu) => ({ id: edu.id, name: edu.name })) || [],
        department: job.department?.map((dept) => ({ id: dept.id , name: dept.name })) || [],
        titleId: job.title ? { id: job.title.id, name: job.title.name } : null,
        recruiterId: job.recruiter ? { id: job.recruiter.id, name: job.recruiter.name } : null,
      });
      
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepIndex: number) => {
    const currentFields = steps[stepIndex].fields;
    const newErrors: Record<string, string> = {};
    
    currentFields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name as keyof Job];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: number[] ) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange =
  (name: string, isMulti: boolean) =>
  (value: Option | Option[] | null) => {
    if (isMulti) {
      setFormData((prev : number[]) => ({
        ...prev,
        [name]: Array.isArray(value) ? value.map((v) => ({ id: v.value, name: v.label })) : [],
      }));
    } else {
      setFormData((prev : number[]) => ({
        ...prev,
        [name]: value ? { id: (value as Option).value, name: (value as Option).label } : null,
      }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };



  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
        const updatedJobData = {
            ...job,
            ...formData,
            salary: formData.salary ? parseInt(formData.salary.toString()) : 0,
            openings: formData.openings ? parseInt(formData.openings.toString()) : 0,
            skills: formData.skills ? formData.skills.map((s: any) => ({ id: s.id })) : [],
            education: formData.education ? formData.education.map((e: any) => ({ id: e.id })) : [],
            department: formData.department ? formData.department.map((d: any) => ({ id: d.id })) : [],
            titleId: formData.titleId ? (formData.titleId as any).id : null,
            recruiterId: formData.recruiterId ? (formData.recruiterId as any).id : null,
            status: formData.status ,
          };
    
        const result = await updateJob(job.id, updatedJobData as any);    
        toast.success("Job Updated successfully");

      // Only call onUpdateJob if it exists
      if (typeof onUpdateJob === 'function') {
        onUpdateJob(result as any);
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error("Failed to Updated Job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(90vh-120px)]">
      {/* Progress Steps */}
      <div className="flex justify-between px-6 py-4 border-b bg-white sticky top-0 z-20">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index <= currentStep ? "text-black-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? "bg-gray-600" : "bg-gray-200"
              } text-white mb-2 transition-colors duration-200`}
            >
              {index + 1}
            </div>
            <span className="text-xs text-center">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <Card className="m-4 bg-white shadow-sm">
          <div className="p-6">
            {/* Status Toggle */}
            {currentStep === 0 && (
              <div className="flex items-center mb-4">
                <Label className="mr-4">Active Status:</Label>
                <Switch
                  checked={formData.status === JobStatus.ACTIVE}
                  onCheckedChange={(checked) =>
                    setFormData((prev : number[]) => ({
                      ...prev,
                      status: checked ? JobStatus.ACTIVE : JobStatus.INACTIVE,
                    }))
                  }
                />
                <span className="ml-2 text-sm">
                  {formData.status === JobStatus.ACTIVE ? "Active" : "Inactive"}
                </span>
              </div>
            )}
            <div className="space-y-6">
              {steps[currentStep].fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label
                    htmlFor={field.name}
                    className="text-sm font-medium text-gray-700 flex items-center"
                  >
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>

                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      onChange={handleInputChange}
                      value={
                        (formData[field.name as keyof Job] as string) || ""
                      }
                      className={`w-full min-h-[100px] ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  ) : field.type === "select" ? (
                    <div className="relative w-full z-10">
                      <SearchComponent
                            field={field}
                            value={
                                formData[field.name as keyof Job]
                                ? Array.isArray(formData[field.name as keyof Job])
                                    ? (formData[field.name as keyof Job] as any[]).map((v: any) => ({
                                        value: v.id || v.value || v,
                                        label: v.name || v.label || v,
                                    }))
                                    : [
                                        {
                                        value:
                                            (formData[field.name as keyof Job] as any).id ||
                                            (formData[field.name as keyof Job] as any).value ||
                                            (formData[field.name as keyof Job] as string),
                                        label:
                                            (formData[field.name as keyof Job] as any).name ||
                                            (formData[field.name as keyof Job] as any).label ||
                                            (formData[field.name as keyof Job] as string),
                                        },
                                    ]
                                : []
                            }
                            onChange={handleSelectChange(field.name, field.isMulti || false)}
                            isMulti={field.isMulti}
                            />
                    </div>
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      onChange={handleInputChange}
                      value={
                        (formData[field.name as keyof Job] as string) || ""
                      }
                      className={`w-full ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}

                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 sticky ">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditJobForm;