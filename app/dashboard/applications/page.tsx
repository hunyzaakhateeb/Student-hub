'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import Link from 'next/link'
import { Eye, Download } from 'lucide-react'

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetch('/api/applications')
        .then(res => res.json())
        .then(data => {
          if (data.applications) {
            setApplications(data.applications)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [user])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {user.role === 'STUDENT' ? 'My Applications' : 'Applications'}
        </h1>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <p className="text-gray-500">No applications found</p>
            {user.role === 'STUDENT' && (
              <Link
                href="/dashboard/drives"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700"
              >
                Browse Active Drives
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {user.role === 'TPO' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id}>
                    {user.role === 'TPO' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {app.student.user.name}
                        </div>
                        <div className="text-sm text-gray-500">{app.student.user.email}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.drive.company.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.drive.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === 'SELECTED' ? 'bg-green-100 text-green-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dashboard/drives/${app.driveId}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Eye className="w-4 h-4 inline" />
                      </Link>
                      {app.status === 'SELECTED' && app.offerLetterUrl && (
                        <a
                          href={app.offerLetterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="w-4 h-4 inline" />
                        </a>
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

