import AuthBranding from '@/app/(frontend)/_components/auth/AuthBranding'
import React from 'react'

export default function AuthPagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 xl:w-2/3">
        <AuthBranding />
      </div>
      <div className="w-full md:w-1/2 xl:w-1/3 flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-[#2242A4] to-[#1B3E8A] lg:p-16 md:p-8 p-4">
        {children}
      </div>
    </div>
  )
}
