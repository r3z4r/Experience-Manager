import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/(frontend)/_components/ui/card'
import { LockKeyhole } from 'lucide-react'
import { AuthBlockProps } from '../types'

export function SignInBlock({ className }: AuthBlockProps): React.ReactElement {
  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="space-y-4 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <LockKeyhole className="w-8 h-8 text-primary" />
        </div>
        <CardTitle>Sign In Required</CardTitle>
        <CardDescription>This is a placeholder for the authentication component</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-32 rounded-lg bg-muted animate-pulse" />
      </CardContent>
    </Card>
  )
}
