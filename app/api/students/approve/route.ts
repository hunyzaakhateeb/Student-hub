import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'HOD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { studentId } = await request.json()

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: true },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (student.user.department !== session.department) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        isApproved: true,
        approvedBy: session.userId,
        approvedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error approving student:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

