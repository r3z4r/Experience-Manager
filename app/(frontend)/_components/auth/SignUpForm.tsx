'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import AuthBranding from '@/app/(frontend)/_components/auth/AuthBranding'

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Show a toast indicating signup is in progress
      const toastId = toast.loading('Creating your account...')
      
      // Log for debugging
      console.log('Submitting signup form...')
      
      // Create FormData from the current form state
      const serverFormData = new FormData()
      serverFormData.append('email', formData.email)
      serverFormData.append('username', formData.username)
      serverFormData.append('password', formData.password)
      
      // Import the signupUser Server Action
      const { signupUser } = await import('@/app/(frontend)/_actions/auth')
      
      // Call the Server Action
      const result = await signupUser(serverFormData)
      
      if (result.success) {
        // Update the loading toast to success
        toast.success('Account created successfully! Redirecting to login...', {
          id: toastId,
          duration: 3000
        })
        
        console.log('Signup successful, redirecting to login page...')
        
        // Use a longer delay to ensure toast is visible before redirect
        setTimeout(async () => {
          // Import the runtime config dynamically to avoid SSR issues
          const { basePath } = await import('@/app/(frontend)/_config/runtime')
          
          // Navigate to login page with correct basePath
          console.log('Redirecting to login page...')
          window.location.href = `${basePath}/login?signup=success`
        }, 2500)
      } else {
        // Update the loading toast to error
        toast.error(result.message || 'Failed to sign up', {
          id: toastId,
          duration: 3000
        })
        console.error('Signup failed:', result)
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Failed to sign up. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthBranding />
      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#2242A4] to-[#1B3E8A] p-16 relative overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`}
          alt="Logo"
          width={60}
          height={60}
          className="mb-8"
          priority
        />
        <div className="w-full max-w-md bg-white/5 rounded-xl shadow-xl p-8 backdrop-blur-md z-10">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Sign-Up</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">
                BUSINESS EMAIL ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Your email goes here"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 py-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-white mb-1">
                USER NAME
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Type here"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 py-2"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-1">
                PASSWORD<span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="***********"
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 py-2 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeWidth="1.5" d="M2 2l16 16" />
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        d="M1.75 10S4.25 4.75 10 4.75c2.12 0 3.94.39 5.32 1.01M18.25 10S15.75 15.25 10 15.25c-2.12 0-3.94-.39-5.32-1.01"
                      />
                      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        d="M1.75 10S4.25 4.75 10 4.75 18.25 10 18.25 10 15.75 15.25 10 15.25 1.75 10 1.75 10Z"
                      />
                      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#5B5BF6] hover:bg-[#3c3cd1] text-white font-semibold rounded-lg py-2.5 mt-4 transition-colors text-lg shadow-md"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <div className="text-center mt-6 text-white/80 text-sm">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-300 hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
