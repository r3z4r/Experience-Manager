import { CheckCircle2, Clock, Archive } from 'lucide-react'
import { Badge } from '@/app/(frontend)/_components/ui/badge'
import { Page } from '@/payload-types'

export const statusConfig = {
  draft: {
    label: 'Draft',
    icon: Clock,
    className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  },
  published: {
    label: 'Published',
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    className: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
  },
}

export const StatusChip = ({ currentStatus }: { currentStatus: Page['status'] }) => {
  const config = statusConfig[currentStatus]
  const Icon = config.icon

  return (
    <Badge variant="secondary" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}
