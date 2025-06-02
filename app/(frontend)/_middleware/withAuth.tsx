'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/app/(frontend)/_context/UserContext'
import { toast } from 'sonner'

interface WithAuthProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

/**
 * Higher-order component to protect routes that require authentication
 * @param children - The page content to render if authenticated
 * @param requiredRoles - Optional array of roles required to access the page
 */
export default function WithAuth({ children, requiredRoles = [] }: WithAuthProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  const [basePath, setBasePath] = useState('')

  useEffect(() => {
    const loadBasePath = async () => {
      const { basePath } = await import('@/app/(frontend)/_config/runtime')
      setBasePath(basePath)
    }
    loadBasePath()
  }, [])

  useEffect(() => {
    if (isLoading || !basePath) return

    if (!user) {
      toast.error('Please sign in to access this page')

      const returnPath = encodeURIComponent(pathname)
      router.push(`${basePath}/login?next=${returnPath}`)
      return
    }

    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role))

      if (!hasRequiredRole) {
        toast.error('You do not have permission to access this page')
        router.push(`${basePath}/dashboard/pages`)
        return
      }
    }
  }, [user, isLoading, router, pathname, requiredRoles, basePath])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
