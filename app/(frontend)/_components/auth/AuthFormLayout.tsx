'use client'

import Image from 'next/image'
import React from 'react'

interface AuthFormLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  logoPath?: string
  logoWidth?: number
  logoHeight?: number
}

export default function AuthFormLayout({
  title,
  subtitle,
  children,
  logoPath,
  logoWidth = 50,
  logoHeight = 50,
}: AuthFormLayoutProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'
  const effectiveLogoPath = logoPath || `${basePath}/images/logo.png`

  return (
    <div className="w-full max-w-md bg-white/5 rounded-xl shadow-xl p-8 backdrop-blur-md z-10">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={effectiveLogoPath}
          alt="Logo"
          width={logoWidth}
          height={logoHeight}
          className="mb-6"
          priority
        />
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-white/70 text-sm text-center mb-4">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
