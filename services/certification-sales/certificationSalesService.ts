"use server";

import { db } from "@/lib/db";
import { CertificationSales } from "@prisma/client";

// Create a new CertificationSale
export const createCertificationSale = async (data: {
  type: string;
  course: string;
  price: number;
  tax: number;
  discount: number;
  description: string;
  image: string;
}): Promise<CertificationSales> => {
  return await db.certificationSales.create({
    data,
  });
};

// Get all CertificationSales
export const getAllCertificationSales = async (): Promise<CertificationSales[]> => {
  return await db.certificationSales.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// Get a single CertificationSale by ID
export const getCertificationSaleById = async (
  id: string
): Promise<CertificationSales | null> => {
  return await db.certificationSales.findUnique({
    where: { id },
  });
};

// Update a CertificationSale
export const updateCertificationSale = async (
  id: string,
  data: Partial<{
    type: string;
    course: string;
    price: number;
    tax: number;
    discount: number;
    description: string;
    image: string;
  }>
): Promise<CertificationSales> => {
  try {
    const updatedCertification = await db.certificationSales.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return updatedCertification;
  } catch (error) {
    throw new Error(`Failed to update certification: ${(error as Error).message}`);
  }
};

// Delete a CertificationSale
export const deleteCertificationSale = async (id: string): Promise<void> => {
  await db.certificationSales.delete({
    where: { id },
  });
};

