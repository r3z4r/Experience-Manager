import React from 'react'
import DashboardNavbar from './DashboardNavbar'
import DashboardSidebar from './DashboardSidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar />
      <div className="flex flex-1 ">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto min-h-0">{children}</main>
      </div>
    </div>
  )
}
