'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Filter, Download, Search } from 'lucide-react'

export default function ResumeFilterPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<any[]>([])
  const [filteredApplications, setFilteredApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    minCgpa: '',
    skills: '',
    experience: '',
    search: '',
  })

  useEffect(() => {
    if (user?.role === 'TPO') {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/applications')
      const data = await res.json()
      if (data.applications) {
        setApplications(data.applications)
        setFilteredApplications(data.applications)
      }
    } catch (error) {
      alert('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/resume/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters, applications }),
      })
      const data = await res.json()
      if (data.filtered) {
        setFilteredApplications(data.filtered)
      }
    } catch (error) {
      alert('Failed to filter applications')
    } finally {
      setLoading(false)
    }
  }

  const handleParseResume = async (applicationId: string, resumeText: string) => {
    try {
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })
      const data = await res.json()
      if (data.parsed) {
        alert(`Parsed Resume:\n${JSON.stringify(data.parsed, null, 2)}`)
      }
    } catch (error) {
      alert('Failed to parse resume')
    }
  }

  if (!user || user.role !== 'TPO') {
    return null
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Resume Filter Tool</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum CGPA
              </label>
              <input
                type="number"
                step="0.1"
                value={filters.minCgpa}
                onChange={(e) => setFilters({ ...filters, minCgpa: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 7.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., React, Node.js, Python"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Search by name, email, etc."
              />
            </div>
          </div>
          <button
            onClick={handleFilter}
            disabled={loading}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Filter className="w-5 h-5 mr-2" />
            Apply Filters
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              Applications ({filteredApplications.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    CGPA
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
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {app.student.user.name}
                      </div>
                      <div className="text-sm text-gray-500">{app.student.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.drive.company.name}</div>
                      <div className="text-sm text-gray-500">{app.drive.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.student.cgpa || 'N/A'}
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
                      {app.student.resumeText && (
                        <button
                          onClick={() => handleParseResume(app.id, app.student.resumeText)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Parse Resume
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

