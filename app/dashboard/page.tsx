import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import StudentDashboard from '@/components/dashboard/StudentDashboard'
import HODDashboard from '@/components/dashboard/HODDashboard'
import TPODashboard from '@/components/dashboard/TPODashboard'

export default async function DashboardPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/')
  }

  if (session.role === 'STUDENT') {
    return <StudentDashboard />
  } else if (session.role === 'HOD') {
    return <HODDashboard />
  } else if (session.role === 'TPO') {
    return <TPODashboard />
  }

  return <div>Unknown role</div>
}

