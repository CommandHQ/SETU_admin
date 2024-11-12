"use server"

import { prisma } from '@/lib/prisma';

export async function getUserStats() {
  try {
    const userStats = await prisma.user.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      where: {
        isDeleted: false,
        isProfileDeleted: false
      }
    });

    const stats = {
      VETERAN: 0,
      SERVING: 0,
      SPOUSE: 0,
      CIVILIAN: 0
    };

    userStats.forEach((stat) => {
      stats[stat.category] = stat._count.category;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw new Error('Failed to fetch user statistics');
  }
}