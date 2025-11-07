'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplyButton({ driveId }: { driveId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApply = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveId }),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Application submitted successfully!')
        router.refresh()
      } else {
        alert(data.error || 'Failed to apply')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Applying...' : 'Apply Now'}
    </button>
  )
}

