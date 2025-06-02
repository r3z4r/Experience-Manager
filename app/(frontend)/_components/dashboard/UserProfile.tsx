'use client'

import { useUser } from './UserContext'
import { Button } from '@/app/(frontend)/_components/ui/button'
import { LogOut, User, Shield } from 'lucide-react'

export default function UserProfile() {
  const { user, isLoading, hasRole, logout } = useUser()

  if (isLoading) {
    return (
      <div className="p-4 rounded-md bg-gray-50 text-gray-500">
        <p className="text-sm">Loading user data...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4 rounded-md bg-gray-50 text-gray-500">
        <p className="text-sm">Not signed in</p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-md bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <User size={20} />
        </div>
        <div>
          <h3 className="font-medium">{user.username}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <Shield size={14} /> Roles
        </h4>
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <span 
              key={role}
              className={`text-xs px-2 py-1 rounded-full ${
                role === 'admin' 
                  ? 'bg-red-100 text-red-700' 
                  : role === 'editor' 
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      </div>
      
      <div className="pt-3 border-t border-gray-100">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full flex items-center justify-center gap-2 text-gray-700"
          onClick={() => logout()}
        >
          <LogOut size={14} />
          Sign out
        </Button>
      </div>
    </div>
  )
}
