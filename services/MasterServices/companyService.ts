"use server";

import { db } from "@/lib/db";
import { CompanyMaster } from "@prisma/client";

// Create a new CompanyMaster
export const createCompanyMaster = async (
  name: string,
  logo?: string,
  industry?: string,
  website?: string,
  location?: string
): Promise<CompanyMaster> => {
  return await db.companyMaster.create({
    data: { name, logo, industry, website, location },
  });
};

// Get all CompanyMasters ordered by creation date descending
export const getAllCompanyMasters = async (): Promise<CompanyMaster[]> => {
  return await db.companyMaster.findMany({
    include: {
      experiences: true,
      Recruiter: true,
    },
    orderBy: { createdAt: "desc" }, // Changed from name to createdAt
  });
};

// Get a single CompanyMaster by ID
export const getCompanyMasterById = async (id: string): Promise<CompanyMaster | null> => {
  return await db.companyMaster.findUnique({
    where: { id },
    include: {
      experiences: true,
      Recruiter: true,
    },
  });
};

// Update a CompanyMaster
export const updateCompanyMaster = async (
  id: string,
  name: string,
  logo?: string,
  industry?: string,
  website?: string,
  location?: string
): Promise<CompanyMaster> => {
  return await db.companyMaster.update({
    where: { id },
    data: { name, logo, industry, website, location },
  });
};

// Delete a CompanyMaster
export const deleteCompanyMaster = async (id: string): Promise<void> => {
  await db.companyMaster.delete({
    where: { id },
  });
};