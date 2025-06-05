'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading('Creating your account...')

    try {
      const { getApiUrl, basePath: runtimeBasePath } = await import(
        '@/app/(frontend)/_config/runtime'
      )
      const apiUrl = getApiUrl('/api/users')

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (response.ok && result.doc) {
        toast.success('Account created successfully! Redirecting to login...', {
          id: toastId,
          duration: 3000,
        })

        setTimeout(() => {
          window.location.href = `${runtimeBasePath}/login?signup=success`
        }, 2500)
      } else {
        const errorMessage =
          result.message || (result.errors && result.errors[0]?.message) || 'Failed to sign up'
        toast.error(errorMessage, {
          id: toastId,
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
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
        <Link href={`/login`} className="text-blue-300 hover:underline">
          Login
        </Link>
      </div>
    </>
  )
}

