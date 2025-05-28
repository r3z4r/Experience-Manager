import React from 'react'
import Image from 'next/image'

interface DashboardNavbarProps {
  userEmail?: string | null
}

export function DashboardNavbar({ userEmail }: DashboardNavbarProps) {
  const initial = userEmail && userEmail.length > 0 ? userEmail[0].toUpperCase() : 'U'
  return (
    <nav className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200 shadow-sm z-20">
      <div className="flex items-center">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/tecnotree_blue.png`}
          alt="Tecnotree Logo"
          width={120}
          height={20}
          priority
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-gray-300">
          <span className="text-blue-700 font-bold text-lg select-none">{initial}</span>
        </div>
      </div>
    </nav>
  )
}

// Server Component wrapper to read cookie and render DashboardNavbar
import { cookies } from 'next/headers'
export default function DashboardNavbarServer() {
  const cookieStore = cookies()
  const userEmail = cookieStore.get('user-email')?.value ?? null
  return <DashboardNavbar userEmail={userEmail} />
}
