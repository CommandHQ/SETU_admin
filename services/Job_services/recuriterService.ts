
'use server'

import { revalidatePath } from "next/cache";
import { PrismaClient, Recruiter } from "@prisma/client";

const prisma = new PrismaClient();

export async function createRecruiter(recruiter: Omit<Recruiter, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const newRecruiter = await prisma.recruiter.create({
      data: recruiter
    });

    revalidatePath('/recruiters'); // Adjust the path as needed
    return newRecruiter;
  } catch (error) {
    console.error('Error creating recruiter:', error);
    throw error;
  }
}

export async function getRecruiterSearch(searchTerm: string) {
  try {
    const recruiters = await prisma.recruiter.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { company: { name: { contains: searchTerm, mode: 'insensitive' } } }
        ]
      },
      include: {
        company: true
      }
    });

    return recruiters;
  } catch (error) {
    console.error('Error searching recruiters:', error);
    throw error;
  }
}

// Additional helper function to get a recruiter by ID
export async function getRecruiterById(id: string) {
  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { id },
      include: {
        company: true,
        jobs: true
      }
    });

    if (!recruiter) {
      throw new Error('Recruiter not found');
    }
  }
  catch (error) {
    console.error('Error searching recruiters:', error);
    throw error;
  }
}
