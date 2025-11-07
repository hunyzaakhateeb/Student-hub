import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
      include: {
        user: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { enrollmentNo, phone, dateOfBirth, address, cgpa } = data

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!student) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    await prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        enrollmentNo: enrollmentNo || student.enrollmentNo,
        phone: phone || student.phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : student.dateOfBirth,
        address: address || student.address,
        cgpa: cgpa ? parseFloat(cgpa) : student.cgpa,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

