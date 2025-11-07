import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'
import { sendEmail } from '@/lib/email'
import { generateEmailTemplate } from '@/lib/gemini'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const driveId = searchParams.get('driveId')

    let applications

    if (session.role === 'TPO') {
      applications = await prisma.application.findMany({
        where: driveId ? { driveId } : undefined,
        include: {
          student: {
            include: { user: true },
          },
          drive: {
            include: { company: true },
          },
        },
        orderBy: { appliedAt: 'desc' },
      })
    } else if (session.role === 'STUDENT') {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: session.userId },
      })
      if (!student) {
        return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
      }
      applications = await prisma.application.findMany({
        where: { studentId: student.id },
        include: {
          drive: {
            include: { company: true },
          },
        },
        orderBy: { appliedAt: 'desc' },
      })
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { driveId } = await request.json()

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
      include: { user: true },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    if (!student.isApproved) {
      return NextResponse.json(
        { error: 'Your profile is not approved yet' },
        { status: 403 }
      )
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        studentId: student.id,
        driveId,
      },
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this drive' },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        studentId: student.id,
        driveId,
        status: 'PENDING',
      },
      include: {
        drive: {
          include: { company: true },
        },
      },
    })

    // Send notification email
    const emailTemplate = await generateEmailTemplate('drive', {
      studentName: student.user.name,
      companyName: application.drive.company.name,
      role: application.drive.role,
    })

    if (emailTemplate) {
      await sendEmail(
        student.user.email,
        emailTemplate.subject || 'Application Submitted',
        emailTemplate.body || `Your application for ${application.drive.company.name} has been submitted.`
      )
    }

    return NextResponse.json({ application })
  } catch (error: any) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

