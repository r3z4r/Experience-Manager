import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Database, FileText, Image as ImageIcon, Users } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Admin Navbar */}
      <nav className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-6 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/pages" className="flex items-center gap-2">
            <Image
              src={`${basePath}/images/tecnotree-blue.png`}
              alt="Tecnotree Logo"
              width={120}
              height={20}
              priority
            />
          </Link>
          <div className="h-6 w-px bg-border mx-2" />
          <span className="text-lg font-medium">Admin Panel</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/pages"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors text-sm font-medium"
          >
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-card border-r border-border flex flex-col py-4 px-0 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-6 pb-2 text-xs text-muted-foreground font-semibold tracking-wider uppercase">
            Content
          </div>
          <nav className="flex flex-col gap-1 px-2 mb-3">
            <Link
              href="/admin/collections/pages"
              className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <FileText size={18} />
              <span className="flex-1">Pages</span>
            </Link>
            <Link
              href="/admin/collections/media"
              className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <ImageIcon size={18} />
              <span className="flex-1">Media</span>
            </Link>
          </nav>

          <div className="px-6 pb-2 mt-2 text-xs text-muted-foreground font-semibold tracking-wider uppercase">
            Administration
          </div>
          <nav className="flex flex-col gap-1 px-2 mb-3">
            <Link
              href="/admin/collections/users"
              className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <Users size={18} />
              <span className="flex-1">Users</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-base text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <Database size={18} />
              <span className="flex-1">Collections</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
