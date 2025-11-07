'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApproveStudentButton({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/students/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to approve student')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="text-green-600 hover:text-green-900 disabled:opacity-50"
    >
      {loading ? 'Approving...' : 'Approve'}
    </button>
  )
}

