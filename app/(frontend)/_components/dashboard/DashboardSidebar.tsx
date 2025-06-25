'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import {
  Settings,
  User,
  Folder,
  Layers,
  LayoutTemplate,
  LayoutGrid,
  Plus,
  GitFork,
} from 'lucide-react'
import LogoutButton from './LogoutButton'

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

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-0">
      <div className="px-6 pb-2 text-xs text-gray-400 font-semibold tracking-wider uppercase">
        Pages
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {/* Pages group with sub-items */}
        <div>
          <div className="flex items-center px-2 py-1 text-gray-700 font-semibold">
            <span className="mr-2">
              <Folder size={18} className="text-blue-600" />
            </span>
            <span>Pages</span>
          </div>
          <div className="pl-8 flex flex-col gap-1">
            <SidebarItem href="/dashboard/pages" icon={<LayoutGrid size={18} />} badge={98}>
              All Pages
            </SidebarItem>
            <SidebarItem href="#" icon={<Plus size={18} />}>
              New Group
            </SidebarItem>
          </div>
        </div>
        <SidebarItem href="#" icon={<LayoutTemplate size={20} />}>
          Templates
        </SidebarItem>
        <SidebarItem href="/dashboard/flows" icon={<GitFork size={20} />}>
          Flows
        </SidebarItem>
        <SidebarItem href="/dashboard/wizard" icon={<Layers size={20} />}>
          Wizards
        </SidebarItem>
      </nav>
      <div className="px-6 pt-6 pb-2 mt-4 text-xs text-gray-400 font-semibold tracking-wider uppercase">
        Settings
      </div>
      <nav className="flex flex-col gap-1 px-2 mb-4">
        <SidebarItem href="#" icon={<Settings size={20} />}>
          Settings
        </SidebarItem>
        <SidebarItem href="/dashboard/profile" icon={<User size={20} />}>
          Account
        </SidebarItem>
        <LogoutButton />
      </nav>
    </aside>
  )
}
