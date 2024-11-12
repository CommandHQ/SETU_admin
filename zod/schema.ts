import { z } from "zod";

export const personalInfoSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "Invalid date of birth"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  alternativeNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  passportSizePhoto: z.string().optional(),
});

const educationSchema = z.object({
  nameOfUniversity: z.string().min(2, "University name must be at least 2 characters"),
  degree: z.string().min(2, "Degree must be at least 2 characters"),
  grade: z.string().min(1, "Grade is required"),
  fieldOfStudy: z.string().min(2, "Field of study must be at least 2 characters"),
  yearOfEnrollment: z.number()
    .int("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  yearOfPassing: z.number()
    .int("Year must be a whole number")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 10, "Year cannot be more than 10 years in the future"),
}).refine(
  (data) => data.yearOfPassing >= data.yearOfEnrollment,
  {
    message: "Year of passing must be equal to or greater than year of enrollment",
    path: ["yearOfPassing"],
  }
);

export const educationInfoSchema = z.object({
  education: z.array(educationSchema)
    .min(1, "At least one education entry is required")
    .max(5, "Maximum of 5 education entries allowed"),
});

// Military Info validation schema
export const militaryInfoSchema = z.object({
  service: z.string().min(2, "Service must be at least 2 characters"),
  dateOfCommission: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "Invalid date of commission"),
  rank: z.string().min(2, "Rank must be at least 2 characters"),
  dateOfRetirement: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "Invalid date of retirement"),
  armOrBranch: z.string().min(2, "Arm or branch must be at least 2 characters"),
});

// Essay validation schema
export const essaySchema = z.object({
  essay: z.string().optional(),
});

// Documents validation schema
export const documentsSchema = z.object({
  resumeFile: z.string().min(1, "Resume file is required"),
  certificationFile: z.string().min(1, "Certification file is required"),
});