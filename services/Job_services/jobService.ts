"use server"
import { PrismaClient, Job, AppliedJob, SavedJob, Prisma, JobStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { addDays } from 'date-fns';
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";


interface UpdateJobDto {
  id: string;
  titleId?: string;
  recruiterId?: string;
  location?: string;
  locationType?: string;
  salary?: number;
  description?: string;
  skills?: { id: string }[];
  experience?: string;
  openings?: number;
  applicants?: number;
  education?: { id: string }[];
  department?: { id: string }[];
  employmentType?: string;
  companyDescription?: string;
  industryType?: string;
  companyWebsite?: string;
  status?: JobStatus;
  appliedBy?: { id: string }[];
  savedBy?: { id: string }[];
}
export interface Skill {
  id: string;
  name: string;
}

export interface Education {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

interface CreateJobDto {
  titleId: string;
  recruiterId: string;
  location: string;
  locationType: string;
  salary: number;
  description: string;
  skills: string[];
  experience: string;
  openings: number;
  education: string[];
  department: string[];
  employmentType: string;
  companyDescription: string;
  industryType: string;
  companyWebsite: string;
}

export const createJob = async (jobData: CreateJobDto) => {
  console.log("Data received:", jobData);

  try {
    const recruiter = await db.recruiter.findUnique({
      where: { id: jobData.recruiterId },
    });

    if (!recruiter) {
      throw new Error('Recruiter not found');
    }
    const jobCreateData = {
      ...jobData,
      id: uuidv4(),
      applicants: 0,
      skills: {
        connect: jobData.skills.map(skill => ({ id: skill })),
      },
      education: {
        connect: jobData.education.map(edu => ({ id: edu })),
      },
      department: {
        connect: jobData.department.map(dep => ({ id: dep })),
      },
      salary: typeof jobData.salary === 'string' ? parseInt(jobData.salary) : jobData.salary,
      openings: typeof jobData.openings === 'string' ? parseInt(jobData.openings) : jobData.openings,
      status: 'ACTIVE' as JobStatus,
    };

    console.log("Prepared job data:", jobCreateData);

    const job = await db.job.create({
      data: jobCreateData,
      include: {
        skills: true,
        education: true,
        department: true,
        title:true,
        recruiter: {
          include: {
            company: true,
          },
        },
      },
    });

    console.log("Job created successfully:", job);
    return job;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const getJob = async (id: string): Promise<Job | null> => {
  return db.job.findUnique({ 
    where: { id },
    include: {
      title:true,
      recruiter: {
        include: {
          company: true,
        },
      },
      skills: true,
      education: true,
      department: true,
      appliedBy: true,
      savedBy: true,
    },

  });
};

export const getAllJobs = async (): Promise<Job[]> => {
  try {
    console.log('Fetching all jobs');
    
    const data = await db.job.findMany({
      include: {
        recruiter: {
          include: {
            company: true,
          },
        },
        title: true,
        skills: true,
        education: true,
        department: true,
        appliedBy: {
          include: {
            user: true,
            job: true,
          },
        },
        savedBy: {
          include: {
            user: true,
            job: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Successfully fetched ${data.length} jobs`);
    return data as Job[];
  } catch (error) {
    console.log('Error fetching all jobs:', error);
    throw new Error('Failed to fetch jobs. Please try again later.');
  }
};


export const getAllActiveJobs = async (): Promise<Job[]> => {
  return db.job.findMany({
    where: {
      status: JobStatus.ACTIVE
    },
    include: {
      recruiter: {
        include: {
          company: true,
        },
      },
      title: true,
      skills: true,
      education: true,
      department: true,
      appliedBy: {
        include: {
          user: true,
          job: true,
        },
      },
      savedBy: {
        include: {
          user: true,
          job: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateJob = async (
  id: string,
  jobData: UpdateJobDto
): Promise<Job> => {
  const {
    skills,
    education,
    department,
    titleId,
    recruiterId,
    appliedBy,
    savedBy,
    ...basicData
  } = jobData;

  const { id: _, ...updateData } = basicData;
  const updateObj: Prisma.JobUpdateInput = {
    ...updateData,
    title: titleId ? {
      connect: { id: titleId }
    } : undefined,

    recruiter: recruiterId ? {
      connect: { id: recruiterId }
    } : undefined,

    skills: skills ? {
      set: skills.map(skill => ({ id: skill.id }))
    } : undefined,

    education: education ? {
      set: education.map(edu => ({ id: edu.id }))
    } : undefined,

    department: department ? {
      set: department.map(dep => ({ id: dep.id }))
    } : undefined,

    ...(appliedBy && {
      appliedBy: {
        set: appliedBy.map(application => ({
          id: application.id
        }))
      }
    }),

    ...(savedBy && {
      savedBy: {
        set: savedBy.map(saved => ({
          id: saved.id
        }))
      }
    })
  };

  const cleanedUpdateObj = Object.fromEntries(
    Object.entries(updateObj).filter(([_, value]) => value !== undefined)
  ) as Prisma.JobUpdateInput;

  try {
    const updatedJob = await db.job.update({
      where: { id },
      data: cleanedUpdateObj,
      include: {
        title: true,
        recruiter: {
          include: {
            company: true,
          }
        },
        skills: true,
        education: true,
        department: true,
        appliedBy: {
          include: {
            user: true,
          }
        },
        savedBy: {
          include: {
            user: true,
          }
        },
      },
    });

    return updatedJob;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const listJobs = async (
  page: number = 1,
  limit: number = 10,
  filters: { 
    locationType?: string; 
    employmentType?: string;
    industryType?: string;
    experience?: string;
    companyId?: string;
    status?: JobStatus;
  } = {}
): Promise<{ jobs: Job[]; total: number }> => {
  const where = { ...filters };
  const [jobs, total] = await Promise.all([
    db.job.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        recruiter: {
          include: {
            company: true,
          },
        },
        skills: true,
        education: true,
        department: true,
        appliedBy: true,
        savedBy: true,
      },
    }),
    db.job.count({ where }),
  ]);
  return { jobs, total };
};

export const searchJobs = async (
  searchTerm: string,
  page: number = 1,
  limit: number = 10
): Promise<{ jobs: Job[]; total: number }> => {
  const where: Prisma.JobWhereInput = {
    OR: [
      { title:{name:{ contains: searchTerm, mode: 'insensitive' } } },
      { location: { contains: searchTerm, mode: 'insensitive' } },
      { industryType: { contains: searchTerm, mode: 'insensitive' } },
      { employmentType: { contains: searchTerm, mode: 'insensitive' } },
      { 
        recruiter: { 
          company: { 
            name: { contains: searchTerm, mode: 'insensitive' } 
          } 
        } 
      },
    ],
  };

  const [jobs, total] = await Promise.all([
    db.job.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        recruiter: {
          include: {
            company: true,
          },
        },
        skills: true,
        education: true,
        department: true,
      },
    }),
    db.job.count({ where }),
  ]);

  return { jobs, total };
};

interface JobFilterOptions {
  searchTerm: string;
  locationType: string;
  datePosted?: string;
  page?: number;
  limit?: number;
}

export async function getFilteredJobs(filters: JobFilterOptions) {
  console.log('Received filters:', filters);

  const {
    searchTerm,
    locationType,
    datePosted,
    page = 1,
    limit = 10
  } = filters;

  let dateFilter: Date | undefined;
  if (datePosted) {
    switch (datePosted) {
      case 'last24h':
        dateFilter = addDays(new Date(), -1);
        break;
      case 'last7d':
        dateFilter = addDays(new Date(), -7);
        break;
      case 'last30d':
        dateFilter = addDays(new Date(), -30);
        break;
    }
  }

  const where: Prisma.JobWhereInput = {
    status: "ACTIVE",
  };

  if (searchTerm && searchTerm.trim() !== '') {
    where.OR = [
      { title: { name: { contains: searchTerm, mode: 'insensitive' } } },
      { location: { contains: searchTerm, mode: 'insensitive' } },
      { industryType: { contains: searchTerm, mode: 'insensitive' } },
      { employmentType: { contains: searchTerm, mode: 'insensitive' } },
      { recruiter: { company: { name: { contains: searchTerm, mode: 'insensitive' } } } },
    ];
  }

  if (locationType && locationType !== 'all') {
    where.locationType = {
      equals: locationType,
      mode: 'insensitive'
    };
  }

  if (dateFilter) {
    where.createdAt = { gte: dateFilter };
  }

  console.log('Final where clause:', JSON.stringify(where, null, 2));

  const [jobs, total] = await Promise.all([
    db.job.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        title: true,
        skills: true,
        recruiter: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    db.job.count({ where }),
  ]);

  console.log(`Found ${total} jobs matching the criteria.`);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export const getJobfieldSearch = async (searchTerm: string) => {
  console.log("Searching for job titles with term:", searchTerm);
  try {
    const searchResult = await db.jobtitleMaster.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
    });
    console.log("Search results:", searchResult);

    return searchResult.map(job => ({ id: job.id, name: job.name }));
  } catch (error) {
    console.error("Database search error:", error);
    throw error;
  }
};

export const getAppliedCandidates = async (jobId: string) => {
  try {
    const appliedCandidates = await db.appliedJob.findMany({
      where: { jobId },
      include: {
        user: true,
      },
    });
    return appliedCandidates;
  } catch (error) {
    console.error("Error fetching applied candidates:", error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    await db.job.delete({
      where: { id },
    });
    console.log(`Job ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete job ${id}:`, error);
    throw error;
  }
};

export async function updateApplicationStatus(
  applicationId: string, 
  status: any
) {
  try {
    const updatedApplication = await db.appliedJob.update({
      where: { id: applicationId },
      data: { 
        status,
        lastUpdatedAt: new Date()
      }
    });

    revalidatePath('/jobs/[id]/applications');
    
    return updatedApplication;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update application status');
  }
}