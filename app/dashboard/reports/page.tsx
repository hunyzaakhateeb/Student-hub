'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'

export default function ReportsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGenerateReport = async (type: 'department' | 'offer' | 'student', format: 'excel' | 'pdf') => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/${type}?format=${format}`, {
        method: 'GET',
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${type}-report.${format === 'excel' ? 'xlsx' : 'pdf'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to generate report')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-400 mb-6">Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === 'HOD' && (
            <div className="bg-white glass-card shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-400 mb-4">Department Report</h2>
              <p className="text-gray-600 text-sm mb-4">
                Generate a report of all students in your department
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGenerateReport('department', 'excel')}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </button>
                <button
                  onClick={() => handleGenerateReport('department', 'pdf')}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </button>
              </div>
            </div>
          )}

          {user.role === 'TPO' && (
            <>
              <div className="bg-white glass-card shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-400 mb-4">Offer-wise Report</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Generate a report of all selected students with offers
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGenerateReport('offer', 'excel')}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Excel
                  </button>
                  <button
                    onClick={() => handleGenerateReport('offer', 'pdf')}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </button>
                </div>
              </div>

              <div className="bg-white glass-card shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-00 mb-4">Student-wise Report</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Generate a report of all students and their applications
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGenerateReport('student', 'excel')}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Excel
                  </button>
                  <button
                    onClick={() => handleGenerateReport('student', 'pdf')}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

