import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(frontend)/_components/ui/card'
import { CreditCard } from 'lucide-react'

interface PaymentBlockProps {
  className?: string
}

export function PaymentBlock({ className }: PaymentBlockProps): React.ReactElement {
  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="space-y-4 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <CardTitle>Payment Required</CardTitle>
        <CardDescription>This is a placeholder for the payment component</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-12 rounded-lg bg-muted animate-pulse" />
        <div className="h-12 rounded-lg bg-muted animate-pulse" />
        <div className="h-8 w-1/2 rounded-lg bg-muted animate-pulse" />
      </CardContent>
    </Card>
  )
}
