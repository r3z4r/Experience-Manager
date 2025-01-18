import { Clock, CheckCircle2, Archive } from 'lucide-react'
import { Badge } from '@/app/(frontend)/_components/ui/badge'

export const statusConfig = {
  draft: {
    label: 'Draft',
    icon: Clock,
    className: 'bg-yellow-300/85 text-yellow-800 hover:bg-yellow-400 cursor-default',
  },
  published: {
    label: 'Published',
    icon: CheckCircle2,
    className: 'bg-green-300/85 text-green-800 hover:bg-green-400 cursor-default',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    className: 'bg-gray-300/85 text-gray-800 hover:bg-gray-400 cursor-default',
  },
} as const

type StatusType = keyof typeof statusConfig

interface StatusChipProps {
  status: StatusType
}

export function StatusChip({ status }: StatusChipProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant="secondary" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}
