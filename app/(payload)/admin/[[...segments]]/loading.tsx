import { Skeleton } from '@/app/(frontend)/_components/ui/skeleton'

export default function AdminLoading(): JSX.Element {
  return (
    <div className="w-full p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      {/* Main Content Section */}
      <div className="space-y-4">
        {/* Card-like skeleton */}
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <Skeleton className="h-4 w-full max-w-[500px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>

        {/* Table-like skeleton */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-[30%]" />
                <Skeleton className="h-4 w-[40%]" />
                <Skeleton className="h-4 w-[20%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
