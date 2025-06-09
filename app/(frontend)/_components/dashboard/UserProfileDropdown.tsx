'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser } from '@/app/(frontend)/_context/UserContext'
import { User, ChevronDown, UserCircle } from 'lucide-react'
import LogoutButton from './LogoutButton'
import Link from 'next/link'

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

  const initials = user.username
    ? user.username
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U'

  const roleLabels: Record<string, { label: string; className: string }> = {
    admin: { label: 'Admin', className: 'bg-red-500/20 text-red-300' },
    editor: { label: 'Editor', className: 'bg-blue-500/20 text-blue-300' },
    user: { label: 'User', className: 'bg-green-500/20 text-green-300' },
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
          {initials}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="font-medium text-gray-800">{user.username}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className={`text-xs px-2 py-1 rounded-full ${
                    role === 'admin'
                      ? 'bg-red-100 text-red-600'
                      : role === 'editor'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
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
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors w-full text-left mb-1 text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v1h6V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 5H5a2 2 0 0 0-2 2v1h18V7a2 2 0 0 0-2-2Z" />
                  <path d="M2 8v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8" />
                  <path d="M9 14h6" />
                </svg>
                <span>Admin Dashboard</span>
              </Link>
            )}

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors w-full text-left text-gray-700"
            >
              <UserCircle className="h-4 w-4 text-blue-500" />
              <span>Profile</span>
            </Link>
            <div className="mt-1">
              <LogoutButton className="w-full justify-start text-left text-gray-700 hover:bg-gray-100" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
