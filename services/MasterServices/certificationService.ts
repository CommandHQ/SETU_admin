"use server";

import { db } from "@/lib/db";
import { CertificationMaster } from "@prisma/client";

// Create a new CertificationMaster
export const createCertificationMaster = async (name: string): Promise<CertificationMaster> => {
  return await db.certificationMaster.create({
    data: { name },
  });
};

// Get all CertificationMasters ordered by creation date descending
export const getAllCertificationMasters = async (): Promise<CertificationMaster[]> => {
  return await db.certificationMaster.findMany({
    include: {
      certifications: true,
    },
    orderBy: { createdAt: "desc" }, // Changed from name to createdAt
  });
};

// Get a single CertificationMaster by ID
export const getCertificationMasterById = async (id: string): Promise<CertificationMaster | null> => {
  return await db.certificationMaster.findUnique({
    where: { id },
    include: {
      certifications: true,
    },
  });
};

// Update a CertificationMaster
export const updateCertificationMaster = async (
  id: string,
  name: string
): Promise<CertificationMaster> => {
  return await db.certificationMaster.update({
    where: { id },
    data: { name },
  });
};

// Delete a CertificationMaster
export const deleteCertificationMaster = async (id: string): Promise<void> => {
  await db.certificationMaster.delete({
    where: { id },
  });
};