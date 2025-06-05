'use client'

import React from 'react'
import Image from 'next/image'
import UserProfileDropdown from './UserProfileDropdown'

function DashboardNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-8 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/tecnotree-blue.png`}
          alt="Tecnotree Logo"
          width={120}
          height={20}
          priority
        />
      </div>

      <div className="flex items-center gap-4">
        <UserProfileDropdown />
      </div>
    </nav>
  )
}

export default DashboardNavbar
