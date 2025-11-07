import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'
import LoginPage from '@/components/auth/LoginPage'

export default async function Home() {
  const session = await getServerSession()
  
  if (session) {
    redirect('/dashboard')
  }
  
  return <LoginPage />
}

