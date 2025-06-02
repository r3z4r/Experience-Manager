import DashboardLayout from '@/app/(frontend)/_components/dashboard/DashboardLayout'
import { cookies } from 'next/headers'
import WithAuth from '@/app/(frontend)/_middleware/withAuth'
import { Toaster } from 'sonner'
import { UserProvider } from '@/app/(frontend)/_context/UserContext'

export default async function DashboardSubpathLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const userEmail = cookieStore.get('user-email')?.value ?? null

  return (
    <UserProvider>
      <WithAuth>
        <DashboardLayout>
          <Toaster position="top-right" richColors />
          {children}
        </DashboardLayout>
      </WithAuth>
    </UserProvider>
  )
}
