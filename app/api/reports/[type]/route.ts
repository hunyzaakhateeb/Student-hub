import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { getDepartmentReport, getOfferWiseReport, generateExcelReport, generatePDFReport } from '@/lib/reports'

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'excel'
    const type = params.type

    let data: any[] = []
    let columns: string[] = []

    if (type === 'department' && session.role === 'HOD') {
      data = await getDepartmentReport(session.department || '')
      columns = ['enrollmentNo', 'name', 'email', 'cgpa', 'totalApplications', 'selected', 'pending', 'rejected']
    } else if (type === 'offer' && session.role === 'TPO') {
      data = await getOfferWiseReport()
      columns = ['studentName', 'enrollmentNo', 'company', 'role', 'package', 'appliedAt']
    } else if (type === 'student' && session.role === 'TPO') {
      // Similar to department report but for all students
      data = await getDepartmentReport('')
      columns = ['enrollmentNo', 'name', 'email', 'cgpa', 'totalApplications', 'selected', 'pending', 'rejected']
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (format === 'excel') {
      const buffer = await generateExcelReport(data, `${type}-report`)
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${type}-report.xlsx"`,
        },
      })
    } else {
      const buffer = await generatePDFReport(data, columns, `${type}-report`)
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${type}-report.pdf"`,
        },
      })
    }
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

