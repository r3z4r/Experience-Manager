import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { User } from '@/payload-types'
import { getCurrentUser } from '@/app/(frontend)/_actions/auth'
import Link from 'next/link'

interface PageProps {
  params: {
    username: string
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = params
  const currentUser = await getCurrentUser()
  
  // Initialize PayloadCMS
  const payload = await getPayload({
    config: configPromise,
  })
  
  // Find the user by username
  const usersResult = await payload.find({
    collection: 'users',
    where: {
      username: {
        equals: username,
      },
    },
    limit: 1,
  })
  
  // If user doesn't exist, show 404
  if (!usersResult.docs || usersResult.docs.length === 0) {
    notFound()
  }
  
  const profileUser = usersResult.docs[0] as User
  
  // Check if current user has access to this profile
  // Admin can view all profiles, users can only view their own
  const isAdmin = currentUser?.roles?.includes('admin')
  const isOwner = currentUser?.id === profileUser.id
  
  if (!isAdmin && !isOwner) {
    // User doesn't have permission to view this profile
    notFound()
  }
  
  // Fetch user's templates
  const templatesResult = await payload.find({
    collection: 'pages',
    where: {
      createdBy: {
        equals: profileUser.id,
      },
    },
    sort: '-updatedAt',
  })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {profileUser.username}'s Profile
        </h1>
        <p className="text-gray-600 mb-4">@{profileUser.username}</p>
        <div className="text-sm text-gray-500">
          Member since {new Date(profileUser.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Pages</h2>
          {isOwner && (
            <Link
              href="/dashboard/pages"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Create New Page
            </Link>
          )}
        </div>
        
        {templatesResult.docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templatesResult.docs.map((template) => (
              <Link
                key={template.id}
                href={`/dashboard/${username}/${template.slug}`}
                className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors"
              >
                <h3 className="font-medium text-gray-800 mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {template.description || 'No description'}
                </p>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {isOwner ? (
              <p>You haven't created any pages yet. Create your first page to get started!</p>
            ) : (
              <p>This user hasn't created any pages yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
