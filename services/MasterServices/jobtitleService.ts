"use server";

import { db } from "@/lib/db";
import { JobtitleMaster } from "@prisma/client";

// Create a new JobtitleMaster
export const createJobtitleMaster = async (name: string): Promise<JobtitleMaster> => {
  return await db.jobtitleMaster.create({
    data: { name },
  });
};

// Get all JobtitleMasters ordered by creation date descending
export const getAllJobtitleMasters = async (): Promise<JobtitleMaster[]> => {
  return await db.jobtitleMaster.findMany({
    include: {
      experiences: true,
      MilitaryProfile: true,
      Job: true,
    },
    orderBy: { createdAt: "desc" }, // Changed from name to createdAt
  });
};

// Get a single JobtitleMaster by ID
export const getJobtitleMasterById = async (id: string): Promise<JobtitleMaster | null> => {
  return await db.jobtitleMaster.findUnique({
    where: { id },
    include: {
      experiences: true,
      MilitaryProfile: true,
      Job: true,
    },
  });
};

// Update a JobtitleMaster
export const updateJobtitleMaster = async (
  id: string,
  name: string
): Promise<JobtitleMaster> => {
  return await db.jobtitleMaster.update({
    where: { id },
    data: { name },
  });
};

// Delete a JobtitleMaster
export const deleteJobtitleMaster = async (id: string): Promise<void> => {
  await db.jobtitleMaster.delete({
    where: { id },
  });
};