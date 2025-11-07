import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session || session.role !== 'TPO') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { filters, applications } = await request.json()

    let filtered = [...applications]

    // Filter by CGPA
    if (filters.minCgpa) {
      const minCgpa = parseFloat(filters.minCgpa)
      filtered = filtered.filter(app => {
        const cgpa = app.student.cgpa
        return cgpa && cgpa >= minCgpa
      })
    }

    // Filter by skills (if resume text is available)
    if (filters.skills) {
      const requiredSkills = filters.skills.split(',').map((s: string) => s.trim().toLowerCase())
      filtered = filtered.filter(app => {
        const resumeText = app.student.resumeText?.toLowerCase() || ''
        return requiredSkills.some((skill: string) => resumeText.includes(skill))
      })
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(app => {
        const name = app.student.user.name.toLowerCase()
        const email = app.student.user.email.toLowerCase()
        const company = app.drive.company.name.toLowerCase()
        return name.includes(searchTerm) || email.includes(searchTerm) || company.includes(searchTerm)
      })
    }

    return NextResponse.json({ filtered })
  } catch (error) {
    console.error('Error filtering applications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

