import { notFound } from 'next/navigation'
import { getCurrentUser, findUserByUsername } from '@/app/(frontend)/_actions/auth'
import { fetchTemplates } from '@/app/(frontend)/_actions/templates'
import Link from 'next/link'

interface UserProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export default async function UserProfilePage({
  params: paramsPromise,
}: UserProfilePageProps): Promise<JSX.Element> {
  const params = await paramsPromise
  const { username } = params
  const currentUser = await getCurrentUser()
  const profileUser = await findUserByUsername(username)

  if (!profileUser) {
    notFound()
  }

  const isAdmin = currentUser?.roles?.includes('admin')
  const isOwner = currentUser?.id === profileUser.id

  if (!isAdmin && !isOwner) {
    notFound()
  }

  const templatesResult = await fetchTemplates({
    username: profileUser.username,
    sortBy: 'created',
    sortOrder: 'desc',
    enforceUserFiltering: true,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{profileUser.username}'s Profile</h1>
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
                href={`/${username}/${template.slug}`}
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
