import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { parseResume } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'TPO') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeText } = await request.json()

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text required' }, { status: 400 })
    }

    const parsed = await parseResume(resumeText)

    return NextResponse.json({ parsed })
  } catch (error) {
    console.error('Error parsing resume:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

