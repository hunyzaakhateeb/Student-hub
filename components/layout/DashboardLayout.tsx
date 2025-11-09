'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Building2,
  ClipboardList,
  BarChart3
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const getNavItems = () => {
    if (user.role === 'TPO') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/drives', label: 'Drives', icon: Briefcase },
        { href: '/dashboard/companies', label: 'Companies', icon: Building2 },
        { href: '/dashboard/applications', label: 'Applications', icon: ClipboardList },
        { href: '/dashboard/resume-filter', label: 'Resume Filter', icon: FileText },
        { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
      ]
    } else if (user.role === 'HOD') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/students', label: 'Students', icon: Users },
        { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
      ]
    } else {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/profile', label: 'Profile', icon: Users },
        { href: '/dashboard/drives', label: 'Active Drives', icon: Briefcase },
        { href: '/dashboard/applications', label: 'My Applications', icon: ClipboardList },
        { href: '/dashboard/resume-builder', label: 'Resume Builder', icon: FileText },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl glass-card mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Placement Portal</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-blue-500 text-gray-400'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-gray-400 focus:outline-none"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

