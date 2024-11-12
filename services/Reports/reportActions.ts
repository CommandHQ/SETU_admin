'use server'


import { revalidatePath } from 'next/cache'
import { Report, ReportFor } from '@prisma/client'
import { db } from '@/lib/db'
import { tree } from 'next/dist/build/templates/app-page'
import { ReportStatus } from '@/types'

export async function getReports(): Promise<Report[]> {
    return await db.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }) as Report[];
  }
  

  export async function getReportDetails(reportId: string) {
    const report = await db.report.findUnique({
        where: { id: reportId },
    })

    if (!report) {
        return null
    }

    let reportedContent = null
    switch (report.reportFor) {
        case ReportFor.POST:
            if (report.postId) {
                reportedContent = await db.post.findUnique({ where: { id: report.postId } })
            }
            break
        case ReportFor.BLOG:
            if (report.blogId) {
                reportedContent = await db.blog.findUnique({ where: { id: report.blogId } })
            }
            break
        case ReportFor.JOB:
            if (report.postId) {
                reportedContent = await db.job.findUnique({ where: { id: report.postId } })
            }
            break
        case ReportFor.COURSE:
            if (report.postId) {
                reportedContent = await db.course.findUnique({ where: { id: report.postId } })
            }
            break
        case ReportFor.USER:
            if (report.userId) {
                reportedContent = await db.user.findUnique({ where: { id: report.userId } })
            }
            break
    }

    return { report, reportedContent }
}


export async function updateReportStatus(reportId: string, newStatus: ReportStatus) {
  await db.report.update({
    where: { id: reportId },

    data: { status: newStatus },
  })
  revalidatePath('/reports')
}

export async function deleteReport(reportId: string) {
  await db.report.delete({
    where: { id: reportId },
  })
  revalidatePath('/reports')
}

export async function deleteReportedContent(report: Report) {
  switch (report.reportFor) {
    case ReportFor.POST:
      await db.post.update({
        where:{id:report.postId!},
        data: {isDeleted:true},
      })
      break
    case ReportFor.BLOG:
      await db.blog.update({
        where:{id:report.blogId!},
        data:{isDeleted:true},
      })
      break
    case ReportFor.JOB:
      await db.job.delete({ where: { id: report.postId! } })
      break
    case ReportFor.COURSE:
      await db.course.delete({ where: { id: report.postId! } })
      break
    case ReportFor.USER:
      await db.user.update({ 
        where: { id: report.userId },
        data: { isBlocked: true }
      })
      break
  }
//   await deleteReport(report.id)
  revalidatePath('/reports')
}

export async function approveReportedContent(report: Report) {
  switch (report.reportFor) {
    case ReportFor.POST:
      await db.post.update({
        where:{id:report.postId!},
        data: {isDeleted:false,isReported:false},
      })
      break
    case ReportFor.BLOG:
      await db.blog.update({
        where:{id:report.blogId!},
        data:{isDeleted:false,isReported:false},
      })
      break
    case ReportFor.JOB:
      await db.job.delete({ where: { id: report.postId! } })
      break
    case ReportFor.COURSE:
      await db.course.delete({ where: { id: report.postId! } })
      break
    case ReportFor.USER:
      await db.user.update({ 
        where: { id: report.userId },
        data: { isBlocked: true }
      })
      break
  }
  revalidatePath('/reports')
}

export async function warnUser(userId: string) {
  console.log(`Warning user: ${userId}`)
}

export async function banUser(userId: string) {
  await db.user.update({
    where: { id: userId },
    data: { isBlocked: true }
  })
  revalidatePath('/reports')
}