'use client'

import { useUser } from '@/app/(frontend)/_components/dashboard/UserContext'
import { useState } from 'react'
import { toast } from 'sonner'
import LogoutButton from '@/app/(frontend)/_components/dashboard/LogoutButton'

export default function ProfilePage() {
  const { user, isLoading } = useUser()
  
  // Role label styling
  const roleLabels: Record<string, { label: string; className: string }> = {
    admin: { label: 'Administrator', className: 'bg-red-500/20 text-red-300' },
    editor: { label: 'Editor', className: 'bg-blue-500/20 text-blue-300' },
    user: { label: 'User', className: 'bg-green-500/20 text-green-300' }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-400">Not signed in</h2>
        <p className="mt-2 text-gray-500">Please sign in to view your profile</p>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-white">Your Profile</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gray-700 p-6 flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-semibold text-white">{user.username}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.roles.map(role => (
                <span
                  key={role}
                  className={`text-xs px-3 py-1 rounded-full ${
                    roleLabels[role]?.className || 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {roleLabels[role]?.label || role}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="p-6 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                  <div className="bg-gray-700 p-3 rounded text-white">{user.username}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <div className="bg-gray-700 p-3 rounded text-white">{user.email}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Account Created</label>
                  <div className="bg-gray-700 p-3 rounded text-white">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Account Actions</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => toast.info('Password change feature coming soon')}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Change Password
                </button>
                
                <button
                  onClick={() => toast.info('Profile update feature coming soon')}
                  className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Update Profile
                </button>
                
                <div className="pt-4 mt-4 border-t border-gray-700">
                  <LogoutButton className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded transition-colors" variant="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
