'use client'

import React from 'react'
import Image from 'next/image'
import UserProfileDropdown from './UserProfileDropdown'

function DashboardNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-8 bg-gray-900 border-b border-gray-800 shadow-sm">
      <div className="flex items-center">
        <Image
          src="/images/tecnotree_logo.png"
          alt="Tecnotree Logo"
          width={120}
          height={20}
          priority
        />
        <div className="ml-4 text-lg font-medium text-white hidden md:block">
          Experience Manager
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Add any additional navbar items here */}
        <UserProfileDropdown />
      </div>
    </nav>
  )
}

export default DashboardNavbar
