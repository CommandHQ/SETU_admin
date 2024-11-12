"use server";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserData() {
  try {
    const users = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'asc'
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
      }
    });

    const monthlyData = users.reduce((acc: { [key: string]: number }, user) => {
      const month = user.createdAt.toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += user._count.id;
      return acc;
    }, {});

    const chartData = Object.entries(monthlyData).map(([name, users]) => ({
      name,
      users
    }));

    return chartData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
}