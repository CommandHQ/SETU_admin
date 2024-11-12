"use server";

import { db } from "@/lib/db";
import { SkillMaster } from "@prisma/client";

// Create a new SkillMaster
export const createSkillMaster = async (name: string): Promise<SkillMaster> => {
  return await db.skillMaster.create({
    data: { name },
  });
};

// Get all SkillMasters ordered by creation date descending
export const getAllSkillMasters = async (): Promise<SkillMaster[]> => {
  return await db.skillMaster.findMany({
    include: {
      skills: true,
      Job: true,
    },
    orderBy: { createdAt: "desc" }, // Changed from name to createdAt
  });
};

// Get a single SkillMaster by ID
export const getSkillMasterById = async (id: string): Promise<SkillMaster | null> => {
  return await db.skillMaster.findUnique({
    where: { id },
    include: {
      skills: true,
      Job: true,
    },
  });
};

// Update a SkillMaster
export const updateSkillMaster = async (
  id: string,
  name: string
): Promise<SkillMaster> => {
  return await db.skillMaster.update({
    where: { id },
    data: { name },
  });
};

// Delete a SkillMaster
export const deleteSkillMaster = async (id: string): Promise<void> => {
  await db.skillMaster.delete({
    where: { id },
  });
};

export const searchSkillMastersByName = async (searchTerm: string) => {
  console.log("Searching for skill titles with term:", searchTerm);
  const searchResult = await db.skillMaster.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
  });
  console.log(searchResult);
  return searchResult;
};