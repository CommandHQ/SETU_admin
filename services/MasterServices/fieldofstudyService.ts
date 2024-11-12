"use server";

import { db } from "@/lib/db";
import { FieldofstudyMaster } from "@prisma/client";

// Create a new FieldofstudyMaster
export const createFieldofstudyMaster = async (name: string): Promise<FieldofstudyMaster> => {
  return await db.fieldofstudyMaster.create({
    data: { name },
  });
};

// Get all FieldofstudyMasters ordered by creation date descending
export const getAllFieldofstudyMasters = async (): Promise<FieldofstudyMaster[]> => {
  return await db.fieldofstudyMaster.findMany({
    include: {
      education: true,
      Job: true,
    },
    orderBy: { createdAt: "desc" }, // Changed from name to createdAt
  });
};

// Get a single FieldofstudyMaster by ID
export const getFieldofstudyMasterById = async (id: string): Promise<FieldofstudyMaster | null> => {
  return await db.fieldofstudyMaster.findUnique({
    where: { id },
    include: {
      education: true,
      Job: true,
    },
  });
};

// Update a FieldofstudyMaster
export const updateFieldofstudyMaster = async (
  id: string,
  name: string
): Promise<FieldofstudyMaster> => {
  return await db.fieldofstudyMaster.update({
    where: { id },
    data: { name },
  });
};

// Delete a FieldofstudyMaster
export const deleteFieldofstudyMaster = async (id: string): Promise<void> => {
  await db.fieldofstudyMaster.delete({
    where: { id },
  });
};

export const getFieldOfStudySearch = async (searchTerm: string) => {
  console.log("Searching for fields of study with term:", searchTerm);
  try {
    const searchResult = await db.fieldofstudyMaster.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });
    console.log("Search results:", searchResult);
    return searchResult;
  } catch (error) {
    console.error("Database search error:", error);
    throw error;
  }
};