'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Settings, User, FileText, ChevronDown, Folder } from 'lucide-react'

interface SidebarItemProps {
  href: string
  icon: ReactNode
  children: ReactNode
  badge?: ReactNode
  active?: boolean
}

function SidebarItem({ href, icon, children, badge, active }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = typeof active === 'boolean' ? active : pathname === href
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-base ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-blue-50'}`}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="ml-2 text-xs bg-blue-600 text-white rounded px-2 py-0.5 font-bold">
          {badge}
        </span>
      )}
    </Link>
  )
}

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function DashboardSidebar() {
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }, [router])

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col py-6 px-0">
      <div className="px-6 pb-2 text-xs text-gray-400 font-semibold tracking-wider uppercase">
        Pages
      </div>
      <nav className="flex flex-col gap-1 px-2">
        <SidebarItem href="/dashboard/template-list" icon={<FileText size={20} />} badge={98}>
          All Pages
        </SidebarItem>
        <SidebarItem href="#" icon={<ChevronDown size={20} />}>
          New Group
        </SidebarItem>
        <SidebarItem href="#" icon={<Folder size={20} />}>
          Popups & Sticky Bars
        </SidebarItem>
        <SidebarItem href="#" icon={<Folder size={20} />}>
          Others
        </SidebarItem>
      </nav>
      <div className="px-6 pt-6 pb-2 mt-4 text-xs text-gray-400 font-semibold tracking-wider uppercase">
        Settings
      </div>
      <nav className="flex flex-col gap-1 px-2 mb-4">
        <SidebarItem href="#" icon={<Settings size={20} />}>
          Settings
        </SidebarItem>
        <SidebarItem href="#" icon={<User size={20} />}>
          Account
        </SidebarItem>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-base font-semibold w-full"
        >
          <LogOut size={20} />
          Log out
        </button>
      </nav>
    </aside>
  )
}
