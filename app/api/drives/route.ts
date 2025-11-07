import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const drives = await prisma.drive.findMany({
      include: {
        company: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ drives })
  } catch (error) {
    console.error('Error fetching drives:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'TPO') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      title,
      description,
      companyId,
      role,
      location,
      package: pkg,
      eligibility,
      requirements,
      registrationDeadline,
      driveDate,
    } = data

    const drive = await prisma.drive.create({
      data: {
        title,
        description,
        companyId,
        role,
        location,
        package: pkg,
        eligibility,
        requirements,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        driveDate: driveDate ? new Date(driveDate) : null,
        createdBy: session.userId,
        status: 'DRAFT',
      },
    })

    return NextResponse.json({ drive })
  } catch (error: any) {
    console.error('Error creating drive:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

