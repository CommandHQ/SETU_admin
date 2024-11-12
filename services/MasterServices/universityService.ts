"use server";

import { db } from "@/lib/db";
import { UniversityMaster } from "@prisma/client";

// Create a new UniversityMaster
export const createUniversityMaster = async (
  name: string,
  location?: string,
  country?: string,
  website?: string
): Promise<UniversityMaster> => {
  return await db.universityMaster.create({
    data: { name, location, country, website },
  });
};

// Get all UniversityMasters ordered by creation date descending
export const getAllUniversityMasters = async (): Promise<UniversityMaster[]> => {
  return await db.universityMaster.findMany({
    include: {
      educations: true,
    },
    orderBy: { createdAt: "desc" }, // Changed from name to createdAt
  });
};

// Get a single UniversityMaster by ID
export const getUniversityMasterById = async (id: string): Promise<UniversityMaster | null> => {
  return await db.universityMaster.findUnique({
    where: { id },
    include: {
      educations: true,
    },
  });
};

// Update a UniversityMaster
export const updateUniversityMaster = async (
  id: string,
  name: string,
  location?: string,
  country?: string,
  website?: string
): Promise<UniversityMaster> => {
  return await db.universityMaster.update({
    where: { id },
    data: { name, location, country, website },
  });
};

// Delete a UniversityMaster
export const deleteUniversityMaster = async (id: string): Promise<void> => {
  await db.universityMaster.delete({
    where: { id },
  });
};