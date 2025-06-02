'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from './UserContext'
import { User, ChevronDown, UserCircle } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function UserProfileDropdown() {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) {
    return null
  }

  // Get user initials for avatar
  const initials = user.username
    ? user.username
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U'

  // Format roles for display
  const roleLabels: Record<string, { label: string; className: string }> = {
    admin: { label: 'Admin', className: 'bg-red-500/20 text-red-300' },
    editor: { label: 'Editor', className: 'bg-blue-500/20 text-blue-300' },
    user: { label: 'User', className: 'bg-green-500/20 text-green-300' }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium">{user.username}</div>
          <div className="text-xs text-gray-400">{user.email}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-md shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-800">
            <div className="font-medium">{user.username}</div>
            <div className="text-sm text-gray-400">{user.email}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {user.roles.map(role => (
                <span
                  key={role}
                  className={`text-xs px-2 py-1 rounded-full ${
                    roleLabels[role]?.className || 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {roleLabels[role]?.label || role}
                </span>
              ))}
            </div>
          </div>
          <div className="px-2 py-2">
            {/* Admin Dashboard Link - Only visible to admin users */}
            {user.roles.includes('admin') && (
              <a
                href="/dashboard/admin"
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-800 transition-colors w-full text-left mb-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v1h6V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 5H5a2 2 0 0 0-2 2v1h18V7a2 2 0 0 0-2-2Z" />
                  <path d="M21 8H3v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
                  <path d="M12 12v4" />
                </svg>
                <span>Admin Dashboard</span>
              </a>
            )}
            
            <a
              href="/dashboard/profile"
              className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-800 transition-colors w-full text-left"
            >
              <UserCircle className="h-4 w-4" />
              <span>Profile</span>
            </a>
            <div className="mt-1">
              <LogoutButton className="w-full justify-start text-left" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
