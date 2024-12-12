import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  return (
    <div className="admin-layout">
      <header className="template-header">
        <div className="header-logo">
          <Link href="/template-list" className="admin-back-link">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <div className="admin-divider" />
          <div className="ml-4">
            <Image
              src="/xpm/logo.webp"
              alt="Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
          <span className="header-title">Admin Panel</span>
        </div>
        {/* <Link href="/template-list" className="template-admin-link">
          Switch to Templates
        </Link> */}
      </header>

      <main className="admin-content">
        <div className="mx-auto w-full h-full flex-1">{children}</div>
      </main>
    </div>
  )
}
