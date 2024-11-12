"use server";

import { db } from "@/lib/db";
import { DegreeMaster } from "@prisma/client";

// Create a new DegreeMaster
export const createDegreeMaster = async (name: string): Promise<DegreeMaster> => {
  return await db.degreeMaster.create({
    data: { name },
  });
};

// Get all DegreeMasters ordered by creation date descending
export const getAllDegreeMasters = async (): Promise<DegreeMaster[]> => {
  return await db.degreeMaster.findMany({
    include: {
      education: true,
      Job: true,
    },
    orderBy: { createdAt: "desc" }, // Changed from name to createdAt
  });
};

// Get a single DegreeMaster by ID
export const getDegreeMasterById = async (id: string): Promise<DegreeMaster | null> => {
  return await db.degreeMaster.findUnique({
    where: { id },
    include: {
      education: true,
      Job: true,
    },
  });
};

// Update a DegreeMaster
export const updateDegreeMaster = async (
  id: string,
  name: string
): Promise<DegreeMaster> => {
  return await db.degreeMaster.update({
    where: { id },
    data: { name },
  });
};

// Delete a DegreeMaster
export const deleteDegreeMaster = async (id: string): Promise<void> => {
  await db.degreeMaster.delete({
    where: { id },
  });
};

export const getDegreeSearch = async (searchTerm: string) => {
  console.log("Searching for degrees with term:", searchTerm);
  try {
    const searchResult = await db.degreeMaster.findMany({
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