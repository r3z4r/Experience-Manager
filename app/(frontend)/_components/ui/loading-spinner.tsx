import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  text?: string
  subText?: string
  className?: string
}

export function LoadingSpinner({
  text = 'Loading',
  subText = 'Please wait...',
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div
        className="w-12 h-12 rounded-full animate-spin mb-4 
        border-4 border-y-blue-600 border-r-purple-600 border-l-purple-600 border-t-transparent"
      />
      <div className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {text}
      </div>
      {subText && <div className="text-sm text-gray-500">{subText}</div>}
    </div>
  )
}
