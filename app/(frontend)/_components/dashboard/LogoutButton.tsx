'use client'

import { LogOut } from 'lucide-react'
import { useUser } from './UserContext'
import { toast } from 'sonner'

interface LogoutButtonProps {
  variant?: 'icon' | 'text' | 'full'
  className?: string
}

export default function LogoutButton({ 
  variant = 'full', 
  className = '' 
}: LogoutButtonProps) {
  const { logout } = useUser()

  const handleLogout = async () => {
    toast.loading('Logging out...')
    try {
      await logout()
      // The redirect is handled in the logout function
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out')
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        className={`p-2 rounded-full hover:bg-gray-700/50 transition-colors ${className}`}
        aria-label="Log out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    )
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleLogout}
        className={`text-sm font-medium hover:text-gray-300 transition-colors ${className}`}
      >
        Log out
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700/50 transition-colors ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </button>
  )
}
