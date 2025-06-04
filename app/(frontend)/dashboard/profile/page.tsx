'use client'

import { useUser } from '@/app/(frontend)/_context/UserContext'
import { useState } from 'react'
import { toast } from 'sonner'
import LogoutButton from '@/app/(frontend)/_components/dashboard/LogoutButton'

export default function ProfilePage() {
  const { user, isLoading, logout } = useUser()

  // Role label styling
  const roleLabels: Record<string, { label: string; className: string }> = {
    admin: { label: 'Administrator', className: 'bg-red-500/20 text-red-300' },
    editor: { label: 'Editor', className: 'bg-blue-500/20 text-blue-300' },
    user: { label: 'User', className: 'bg-green-500/20 text-green-300' },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-12 h-12 border-4 border-t-primary border-border rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-muted-foreground">Not Signed In</h2>
        <p className="mt-3 text-base text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-card rounded-xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 sm:p-8 flex items-center bg-card-header border-b border-border">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground ring-4 ring-background">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.roles?.map((role) => (
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
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-3">
                Account Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Username
                  </label>
                  <div className="bg-muted/30 p-3 rounded-md text-foreground text-sm">
                    {user.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </label>
                  <div className="bg-muted/30 p-3 rounded-md text-foreground text-sm">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Account Created
                  </label>
                  <div className="bg-muted/30 p-3 rounded-md text-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-3">
                Account Actions
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => toast.info('Password change feature coming soon')}
                  className="w-full py-2.5 px-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors font-medium text-sm"
                >
                  Change Password
                </button>

                <button
                  onClick={() => toast.info('Profile update feature coming soon')}
                  className="w-full py-2.5 px-5 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors font-medium text-sm"
                >
                  Update Profile
                </button>

                <div className="pt-4 mt-4 border-t border-gray-700">
                  <LogoutButton className="w-full py-2.5 px-5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors font-medium text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
