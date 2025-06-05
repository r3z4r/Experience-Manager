import DashboardLayout from '@/app/(frontend)/_components/dashboard/DashboardLayout'
import WithAuth from '@/app/(frontend)/_middleware/withAuth'
import { UserProvider } from '@/app/(frontend)/_context/UserContext'

export default async function DashboardSubpathLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <WithAuth>
        <DashboardLayout>{children}</DashboardLayout>
      </WithAuth>
    </UserProvider>
  )
}
