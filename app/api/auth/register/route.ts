import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, department, enrollmentNo, phone, dateOfBirth, address } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role.toUpperCase(),
        department: department || null,
        ...(role.toUpperCase() === 'STUDENT' && enrollmentNo && {
          studentProfile: {
            create: {
              enrollmentNo,
              phone: phone || '',
              dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
              address: address || '',
            },
          },
        }),
        ...(role.toUpperCase() === 'HOD' && department && {
          hodProfile: {
            create: {
              department,
            },
          },
        }),
      },
    })

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'STUDENT' | 'HOD' | 'TPO',
      department: user.department || undefined,
    })

    return NextResponse.json({
      success: true,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

