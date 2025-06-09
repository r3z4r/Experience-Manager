'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NotFound() {
  const router = useRouter()
  const REDIRECT_DELAY_MS = 5000
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY_MS / 1000)

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push('/dashboard')
      return
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((prevSeconds) => prevSeconds - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [secondsLeft, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="text-sm text-muted-foreground mb-8">
          {secondsLeft > 1 ? (
            <p>
              You will be redirected to the dashboard in <b>{secondsLeft}</b> seconds
            </p>
          ) : (
            <p>Redirecting you to the dashboard now...</p>
          )}
        </div>
        <Link href="/dashboard/pages" className="button-primary button-md">
          Go to Dashboard Now
        </Link>
      </div>
    </div>
  )
}
