import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { generateResumeSuggestions } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeData, jobDescription } = await request.json()

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data required' }, { status: 400 })
    }

    const suggestions = await generateResumeSuggestions(
      resumeData,
      jobDescription || 'Software Engineer position'
    )

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

