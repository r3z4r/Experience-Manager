import { Skeleton } from '@/app/(frontend)/_components/ui/skeleton'

export default function EditorLoading() {
  return (
    <div className="h-screen w-full bg-background">
      {/* Top Panel Skeleton */}
      <div className="h-[50px] w-full border-b bg-card px-4 py-2">
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Main Editor Area Skeleton */}
      <div className="flex h-[calc(100vh-50px)] w-full">
        {/* Left Sidebar Skeleton */}
        <div className="w-[240px] border-r bg-card p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Canvas Area Skeleton */}
        <div className="flex-1 bg-muted/10 p-8">
          <div className="h-full rounded-lg border border-dashed border-muted-foreground/25 bg-card/50">
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-10 w-10">
                  <div className="absolute animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
                <p className="text-sm text-muted-foreground">Loading editor...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="w-[240px] border-l bg-card p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
