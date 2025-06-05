'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/(frontend)/_context/UserContext'
import { toast } from 'sonner'
import WithAuth from './withAuth'

interface WithAdminAuthProps {
  children: React.ReactNode
}

/**
 * Higher-order component to protect routes that require admin privileges
 * This component builds on top of WithAuth to add role-based access control
 */
export default function WithAdminAuth({ children }: WithAdminAuthProps) {
  const { user, hasRole, isLoading } = useUser()
  const router = useRouter()

  // State to store basePath
  const [basePath, setBasePath] = useState('')
  
  // Load basePath from runtime config
  useEffect(() => {
    const loadBasePath = async () => {
      const { basePath } = await import('@/app/(frontend)/_config/runtime')
      setBasePath(basePath)
    }
    loadBasePath()
  }, [])

  useEffect(() => {
    // Skip check while loading user data or basePath
    if (isLoading || !basePath) return

    // If user is authenticated but not an admin, redirect to dashboard
    if (user && !hasRole('admin')) {
      console.log('User lacks admin role, redirecting to dashboard')
      toast.error('You need administrator privileges to access this page')
      router.push(`${basePath}/dashboard/pages`)
    }
  }, [user, hasRole, isLoading, router, basePath])

  // First use the basic auth protection, then add admin role check
  return (
    <WithAuth requiredRoles={['admin']}>
      {children}
    </WithAuth>
  )
}
