import DashboardLayout from '@/components/layout/DashboardLayout'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, Users, Building2, TrendingUp } from 'lucide-react'

export default async function TPODashboard() {
  const session = await getServerSession()
  if (!session || session.role !== 'TPO') {
    redirect('/')
  }

  const [drives, companies, applications, selectedCount] = await Promise.all([
    prisma.drive.count(),
    prisma.company.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'SELECTED' } }),
  ])

  const stats = [
    { label: 'Total Drives', value: drives, icon: Briefcase, bgColor: 'bg-blue-500' },
    { label: 'Companies', value: companies, icon: Building2, bgColor: 'bg-green-500' },
    { label: 'Applications', value: applications, icon: Users, bgColor: 'bg-purple-500' },
    { label: 'Selected', value: selectedCount, icon: TrendingUp, bgColor: 'bg-orange-500' },
  ]

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TPO Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage placement drives and recruitment</p>
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
                href="/dashboard/drives/new"
                className="block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium"
              >
                Create New Drive
              </Link>
              <Link
                href="/dashboard/companies/new"
                className="block w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium"
              >
                Add Company
              </Link>
              <Link
                href="/dashboard/applications"
                className="block w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium"
              >
                View Applications
              </Link>
              <Link
                href="/dashboard/resume-filter"
                className="block w-full text-left px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 font-medium"
              >
                Resume Filter Tool
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-500">Activity feed will appear here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

