// app/actions/userActions.ts
'use server'

import { db } from "@/lib/db"



export async function getUsers(page: number, searchTerm: string, statusFilter: string, roleFilter: string) {
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const where: any = {
    OR: [
      { firstName: { contains: searchTerm, mode: 'insensitive' as const } },
      { lastName: { contains: searchTerm, mode: 'insensitive' as const } },
      { email: { contains: searchTerm, mode: 'insensitive' as const } },
    ],
    ...(statusFilter !== 'all' && {
      ...(statusFilter === 'active' ? { isVerifiedUser: true } :
         statusFilter === 'blocked' ? { isBlocked: true } :
         { isVerifiedUser: false, isBlocked: false })
    }),
    ...(roleFilter !== 'all' && { role: roleFilter }),
  }

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerifiedUser: true,
        isBlocked: true,
        image: true,
        createdAt:true,
        updatedAt: true,
      },
    }),
    db.user.count({ where }),
  ])

  return {
    users,
    totalPages: Math.ceil(totalCount / pageSize),
  }
}
export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isVerifiedUser: true,
      isBlocked: true,
      image: true,
      updatedAt: true,
      phone: true,
      category: true,
      isRecruiter: true,
      isRecruiterVerified: true,
      companyName: true,
      companyEmail: true,
      isPrivateAccount: true,
      isPublicProfile: true,
      allowPushNotification: true,
      allowEmailNotification: true,
      dob: true,
      gender: true,
    },
  })
}

export async function updateUser(userData: any) {
  const { id, ...updateData } = userData

  return db.user.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteUser(id: string) {
  return db.user.update({
    where: { id },
    data: { isDeleted: true },
  })
}

export async function toggleUserBlock(id: string) {
  const user = await db.user.findUnique({ where: { id } })
  if (!user) throw new Error('User not found')

  return db.user.update({
    where: { id },
    data: { isBlocked: !user.isBlocked },
  })
}

export async function resetUserPassword(id: string) {
  // In a real application, you would generate a secure random password here
  const tempPassword = 'TempPassword123!'

  // Update the user's password (you should hash this password in a real application)
  await db.user.update({
    where: { id },
    data: { 
      // This is a placeholder. In a real app, you'd hash the password:
      // password: await bcrypt.hash(tempPassword, 10)
    },
  })

  // In a real application, you would send an email to the user with their new temporary password
  console.log(`Password reset for user ${id}. New temporary password: ${tempPassword}`)

  return { success: true, message: 'Password reset successfully' }
}
