import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h1 className="text-4xl font-bold">Page Not Found</h1>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
        Return Home
      </Link>
    </div>
  )
}
