import DashboardLayout from '@/components/layout/DashboardLayout'
import { prisma } from '@/lib/db'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ApplyButton from '@/components/drives/ApplyButton'
import Link from 'next/link'

export default async function DriveDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) redirect('/')

  const drive = await prisma.drive.findUnique({
    where: { id: params.id },
    include: {
      company: true,
      applications: session.role === 'STUDENT' ? {
        where: {
          student: { userId: session.userId },
        },
      } : undefined,
      _count: {
        select: { applications: true },
      },
    },
  })

  if (!drive) {
    return (
      <DashboardLayout>
        <div className="px-4 py-6 sm:px-0">
          <p>Drive not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const hasApplied = session.role === 'STUDENT' && drive.applications && drive.applications.length > 0

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <Link
            href="/dashboard/drives"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-block"
          >
            ← Back to Drives
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-400 mb-2">{drive.title}</h1>
              <p className="text-xl text-gray-600">{drive.company.name}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              drive.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              drive.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
              drive.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {drive.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
              <p className="text-lg text-gray-900">{drive.role}</p>
            </div>
            {drive.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                <p className="text-lg text-gray-900">{drive.location}</p>
              </div>
            )}
            {drive.package && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Package</h3>
                <p className="text-lg text-gray-900">{drive.package}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Applications</h3>
              <p className="text-lg text-gray-900">{drive._count.applications}</p>
            </div>
          </div>

          {drive.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{drive.description}</p>
            </div>
          )}

          {drive.eligibility && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Eligibility</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{drive.eligibility}</p>
            </div>
          )}

          {drive.requirements && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Requirements</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{drive.requirements}</p>
            </div>
          )}

          {drive.registrationDeadline && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Registration Deadline</h3>
              <p className="text-gray-900">
                {new Date(drive.registrationDeadline).toLocaleString()}
              </p>
            </div>
          )}

          {drive.driveDate && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Drive Date</h3>
              <p className="text-gray-900">
                {new Date(drive.driveDate).toLocaleString()}
              </p>
            </div>
          )}

          {session.role === 'STUDENT' && drive.status === 'ACTIVE' && (
            <div className="mt-6">
              {hasApplied ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">You have already applied for this drive.</p>
                </div>
              ) : (
                <ApplyButton driveId={drive.id} />
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

