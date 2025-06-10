'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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
    const toastId = toast.loading('Signing in...')

    try {
      const runtimeBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'
      const clientBaseUrl = `${window.location.protocol}//${window.location.host}`
      const apiUrl = `${clientBaseUrl}${runtimeBasePath}/api/users/login`

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(rememberMe && { exp: 2592000 }), // 30 days in seconds
        }),
      })

      const result = await response.json()

      if (response.ok && result.user) {
        localStorage.setItem('user', JSON.stringify(result.user))
        if (result.user.username) {
          localStorage.setItem('username', result.user.username)
        }
        if (result.user.roles && Array.isArray(result.user.roles)) {
          localStorage.setItem('userRoles', JSON.stringify(result.user.roles))
        }

        toast.success('Signed in successfully', {
          id: toastId,
        })

        // Redirect after a short delay
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search)
          const next = params.get('next')
          if (next) {
            window.location.href = runtimeBasePath + next
          } else {
            window.location.href = `${runtimeBasePath}/dashboard/pages`
          }
        }, 1000)
      } else {
        const errorMessage =
          result.message || (result.errors && result.errors[0]?.message) || 'Failed to sign in'
        toast.error(errorMessage, {
          id: toastId,
        })
      }
    } catch (error) {
      console.error('Login submission error:', error)
      toast.error('An unexpected error occurred. Please try again.', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
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
                <EyeOffIcon className="w-5 h-5 text-blue-400" />
              ) : (
                <EyeIcon className="w-5 h-5 text-blue-400" />
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-white/80 text-xs mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-blue-500 h-4 w-4"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />{' '}
            Remember Me
          </label>
          <Link href="/forgot-password" className="hover:underline">
            Forget Password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-[#5B5BF6] hover:bg-[#3c3cd1] text-white font-semibold rounded-lg py-2.5 mt-4 transition-colors text-lg shadow-md"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Log In'}
        </button>
      </form>
      <div className="w-full flex flex-col items-center mt-6 text-sm">
        <p className="text-white/80">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-300 hover:underline">
            Sign Up
          </Link>
        </p>
        <div className="flex items-center w-full my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        <Link href={'admin'} className="mt-3 text-white/60 hover:text-white border px-4 py-2">
          Sign in to Admin Panel
        </Link>
      </div>
    </>
  )
}
