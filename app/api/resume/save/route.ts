import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'
import { parseResume } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeData } = await request.json()

    const student = await prisma.studentProfile.findUnique({
      where: { userId: session.userId },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })
    }

    // Convert resume data to text for AI parsing
    const resumeText = JSON.stringify(resumeData, null, 2)
    
    // Parse resume with AI
    const parsedData = await parseResume(resumeText)

    await prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        resumeText: resumeText,
        // You can also store parsed data in a JSON field if needed
      },
    })

    return NextResponse.json({ success: true, parsedData })
  } catch (error) {
    console.error('Error saving resume:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

