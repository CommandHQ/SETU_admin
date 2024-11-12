// getTopCoursesData.ts
"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTopCoursesData() {
  try {
    // Get courses with their enrollments and revenue
    const courseSales = await prisma.course.findMany({
      select: {
        title: true,
        price: true,
        enrollments: {
          select: {
            enrolledAt: true,
          },
        },
        enrollmentCount: true,
      },
      where: {
        isPublished: true,
      },
      orderBy: {
        enrollmentCount: 'desc',
      },
      take: 5,
    });

    const chartData = courseSales.map(course => {
      const revenue = (course.price || 0) * (course.enrollmentCount || 0);
      
      return {
        name: course.title.length > 20 
          ? course.title.substring(0, 20) + '...' 
          : course.title,
        enrollments: course.enrollmentCount || 0,
        revenue: revenue,
      };
    });

    return chartData;
  } catch (error) {
    console.error('Error fetching course sales data:', error);
    throw new Error('Failed to fetch course sales data');
  }
}