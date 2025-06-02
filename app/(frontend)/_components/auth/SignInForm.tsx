'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AuthBranding from '@/app/(frontend)/_components/auth/AuthBranding'
import Image from 'next/image'
import Link from 'next/link'

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const signupSuccess = urlParams.get('signup')

      if (signupSuccess === 'success') {
        toast.success('Account created successfully! Please sign in.', {
          duration: 5000,
        })
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const toastId = toast.loading('Signing in...')

      const serverFormData = new FormData()
      serverFormData.append('email', formData.email)
      serverFormData.append('password', formData.password)

      const { loginUser } = await import('@/app/(frontend)/_actions/auth')

      const result = await loginUser(serverFormData)

      if (result.success) {
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user))

          if (result.user.username) {
            localStorage.setItem('username', result.user.username)
          }

          if (result.user.roles && Array.isArray(result.user.roles)) {
            localStorage.setItem('userRoles', JSON.stringify(result.user.roles))
          }
        }

        toast.success('Signed in successfully', {
          id: toastId,
        })

        setTimeout(async () => {
          const params = new URLSearchParams(window.location.search)
          const next = params.get('next')

          const { basePath } = await import('@/app/(frontend)/_config/runtime')

          if (next) {
            window.location.href = basePath + next
          } else {
            window.location.href = `${basePath}/dashboard/pages`
          }
        }, 1000)
      } else {
        toast.error(result.message || 'Failed to sign in', {
          id: toastId,
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to sign in')
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
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-full bg-white/5 rounded-xl shadow-xl p-8 backdrop-blur-md z-10">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">
                  EMAIL<span className="text-pink-400">*</span>
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
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-1">
                  PASSWORD<span className="text-pink-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
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
              <div className="flex items-center justify-between text-white/80 text-xs mt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500" /> Remember Me
                </label>
                <a href="#" className="hover:underline">
                  Forget Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-[#5B5BF6] hover:bg-[#3c3cd1] text-white font-semibold rounded-lg py-2.5 mt-4 transition-colors text-lg shadow-md"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Log In'}
              </button>
            </form>
          </div>
          <div className="w-full flex flex-col items-center mt-6">
            <div className="flex items-center w-full my-4">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>
            <Link
              href="/admin"
              className="w-full md:w-auto px-4 py-2 border border-blue-600 text-white rounded-lg hover:bg-[#3c3cd1] transition-colors font-medium text-center"
            >
              Switch to Admin Panel
            </Link>
          </div>
          <div className="text-center mt-6 text-white/80 text-sm">
            New user?{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH}/register`}
              className="text-blue-300 hover:underline"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
