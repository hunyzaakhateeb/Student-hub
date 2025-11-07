import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { prisma } from './db'

export async function generateExcelReport(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')
  
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  return buffer
}

export async function generatePDFReport(data: any[], columns: string[], filename: string) {
  const doc = new jsPDF()
  
  autoTable(doc, {
    head: [columns],
    body: data.map(row => columns.map(col => row[col] || '')),
  })
  
  return doc.output('arraybuffer')
}

export async function getDepartmentReport(department: string) {
  const students = await prisma.studentProfile.findMany({
    where: department ? {
      user: { department },
    } : undefined,
    include: {
      user: true,
      applications: {
        include: {
          drive: {
            include: { company: true },
          },
        },
      },
    },
  })
  
  return students.map(student => ({
    enrollmentNo: student.enrollmentNo,
    name: student.user.name,
    email: student.user.email,
    cgpa: student.cgpa,
    totalApplications: student.applications.length,
    selected: student.applications.filter(a => a.status === 'SELECTED').length,
    pending: student.applications.filter(a => a.status === 'PENDING').length,
    rejected: student.applications.filter(a => a.status === 'REJECTED').length,
  }))
}

export async function getOfferWiseReport() {
  const selected = await prisma.application.findMany({
    where: { status: 'SELECTED' },
    include: {
      student: { include: { user: true } },
      drive: {
        include: { company: true },
      },
    },
  })
  
  return selected.map(app => ({
    studentName: app.student.user.name,
    enrollmentNo: app.student.enrollmentNo,
    company: app.drive.company.name,
    role: app.drive.role,
    package: app.drive.package,
    appliedAt: app.appliedAt,
  }))
}

