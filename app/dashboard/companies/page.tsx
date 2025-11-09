import DashboardLayout from '@/components/layout/DashboardLayout'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function CompaniesPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'TPO') {
    redirect('/dashboard')
  }

  const companies = await prisma.company.findMany({
    include: {
      _count: {
        select: { drives: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-400">Companies</h1>
          <Link
            href="/dashboard/companies/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Company
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company.id} className="bg-white glas-card shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h3>
              {company.description && (
                <p className="text-gray-600 text-sm mb-4">{company.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {company._count.drives} drive(s)
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

