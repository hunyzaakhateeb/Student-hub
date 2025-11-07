import DashboardLayout from '@/components/layout/DashboardLayout'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react'

export default async function HODDashboard() {
  const session = await getServerSession()
  if (!session || session.role !== 'HOD') {
    redirect('/')
  }

  const department = session.department || ''

  const [totalStudents, approvedStudents, pendingStudents, selectedCount] = await Promise.all([
    prisma.studentProfile.count({
      where: { user: { department } },
    }),
    prisma.studentProfile.count({
      where: { user: { department }, isApproved: true },
    }),
    prisma.studentProfile.count({
      where: { user: { department }, isApproved: false },
    }),
    prisma.application.count({
      where: {
        student: { user: { department } },
        status: 'SELECTED',
      },
    }),
  ])

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, bgColor: 'bg-blue-500' },
    { label: 'Approved', value: approvedStudents, icon: CheckCircle, bgColor: 'bg-green-500' },
    { label: 'Pending Approval', value: pendingStudents, icon: Clock, bgColor: 'bg-yellow-500' },
    { label: 'Selected', value: selectedCount, icon: CheckCircle, bgColor: 'bg-purple-500' },
  ]

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HOD Dashboard</h1>
          <p className="text-gray-600 mt-2">Department: {department}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.label}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/students"
                className="block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium"
              >
                Approve Students
              </Link>
              <Link
                href="/dashboard/reports"
                className="block w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium"
              >
                Generate Reports
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Department Statistics</h2>
            <p className="text-gray-500">Detailed statistics will appear here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

