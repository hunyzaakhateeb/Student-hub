import DashboardLayout from '@/components/layout/DashboardLayout'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, FileText, CheckCircle, Clock } from 'lucide-react'

export default async function StudentDashboard() {
  const session = await getServerSession()
  if (!session || session.role !== 'STUDENT') {
    redirect('/')
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: session.userId },
    include: {
      applications: {
        include: {
          drive: {
            include: { company: true },
          },
        },
      },
    },
  })

  if (!student) {
    return <div>Student profile not found</div>
  }

  const stats = [
    { label: 'Active Drives', value: 0, icon: Briefcase, bgColor: 'bg-blue-500' },
    { label: 'My Applications', value: student.applications.length, icon: FileText, bgColor: 'bg-purple-500' },
    { label: 'Selected', value: student.applications.filter(a => a.status === 'SELECTED').length, icon: CheckCircle, bgColor: 'bg-green-500' },
    { label: 'Pending', value: student.applications.filter(a => a.status === 'PENDING').length, icon: Clock, bgColor: 'bg-yellow-500' },
  ]

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session.name}!</p>
        </div>

        {!student.isApproved && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Your profile is pending approval from HOD. You cannot apply to drives until approved.
            </p>
          </div>
        )}

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
                href="/dashboard/profile"
                className="block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium"
              >
                Update Profile
              </Link>
              <Link
                href="/dashboard/resume-builder"
                className="block w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium"
              >
                Build Resume
              </Link>
              <Link
                href="/dashboard/drives"
                className="block w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium"
              >
                Browse Drives
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
            {student.applications.length === 0 ? (
              <p className="text-gray-500">No applications yet</p>
            ) : (
              <div className="space-y-3">
                {student.applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="border-b pb-3">
                    <p className="font-medium">{app.drive.company.name} - {app.drive.role}</p>
                    <p className="text-sm text-gray-500">Status: {app.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

