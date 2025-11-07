import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export interface Session {
  userId: string
  email: string
  name: string
  role: 'STUDENT' | 'HOD' | 'TPO'
  department?: string
}

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (!sessionCookie) return null
  
  try {
    const session = JSON.parse(sessionCookie.value) as Session
    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })
    
    if (!user) return null
    
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'STUDENT' | 'HOD' | 'TPO',
      department: user.department || undefined,
    }
  } catch {
    return null
  }
}

export async function createSession(session: Session) {
  const cookieStore = await cookies()
  cookieStore.set('session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

