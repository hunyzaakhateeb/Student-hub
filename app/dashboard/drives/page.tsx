import DashboardLayout from '@/components/layout/DashboardLayout'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Eye } from 'lucide-react'

export default async function DrivesPage() {
  const session = await getServerSession()
  if (!session) redirect('/')

  // Students see only active drives, TPO sees all
  const whereClause = session.role === 'STUDENT' 
    ? { status: 'ACTIVE' }
    : {}

  const drives = await prisma.drive.findMany({
    where: whereClause,
    include: {
      company: true,
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {session.role === 'STUDENT' ? 'Active Drives' : 'Placement Drives'}
          </h1>
          {session.role === 'TPO' && (
            <Link
              href="/dashboard/drives/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Drive
            </Link>
          )}
        </div>

        {drives.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <p className="text-gray-500">
              {session.role === 'STUDENT' 
                ? 'No active drives available at the moment.' 
                : 'No drives created yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drives.map((drive) => (
                  <tr key={drive.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{drive.company.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{drive.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        drive.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        drive.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                        drive.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {drive.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {drive._count.applications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dashboard/drives/${drive.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </Link>
                      {session.role === 'TPO' && (
                        <Link
                          href={`/dashboard/drives/${drive.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
