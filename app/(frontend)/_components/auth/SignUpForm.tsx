'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

export default function SignUpForm() {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        toast.success('Account created successfully')
        router.push(`/login?signup=success`)
      } else {
        toast.error(data.message || 'Failed to sign up')
      }
    } catch {
      toast.error('Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="flex-1 flex flex-col justify-center items-start bg-gradient-to-br from-[#5B5BF6] to-[#1B3E8A] relative p-8 overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/dots.png`}
          alt="Dots"
          width={120}
          height={120}
          className="m-4 opacity-80"
          priority
        />
        <div className="flex flex-col h-full w-full max-w-md z-10 m-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Experience
            <br />
            Manager
          </h1>
        </div>
      </div>
      {/* Right side - Sign Up form */}
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
                onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                onChange={e => setFormData({ ...formData, username: e.target.value })}
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
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="***********"
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 py-2 pr-10"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 cursor-pointer">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path
                      stroke="currentColor"
                      strokeWidth="1.5"
                      d="M1.75 10S4.25 4.75 10 4.75 18.25 10 18.25 10 15.75 15.25 10 15.25 1.75 10 1.75 10Z"
                    />
                    <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
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
            <a href="/login" className="text-blue-300 hover:underline">Login</a>
          </div>
        </div>
      </div>
    </div>
  )
}
