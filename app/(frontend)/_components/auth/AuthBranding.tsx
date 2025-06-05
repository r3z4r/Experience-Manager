import Image from 'next/image'
import React from 'react'

interface AuthBrandingProps {
  children?: React.ReactNode
}

export default function AuthBranding({ children }: AuthBrandingProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return (
    <div className="flex-1 flex flex-col justify-center items-start relative p-8 overflow-hidden   bg-gradient-to-br from-[#5B5BF6]/30 to-[#1B3E8A]/40 max-h-screen">
      <Image
        src={`${basePath}/bg.svg`}
        alt="Abstract background pattern"
        layout="fill"
        objectFit="cover"
        className="-z-10"
        priority
      />
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/dots.png`}
        alt="Decorative Dots"
        width={120}
        height={120}
        className="m-4 animate-pulse rotate-180"
        priority
      />
      <div className="flex flex-col h-full w-full max-w-md z-10 m-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Experience
          <br />
          Manager
        </h1>
        <p className="text-lg text-white/80 my-2 max-w-xs drop-shadow">
          Effortless content creation and management for your digital experiences.
        </p>
        {children}
      </div>
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/dots.png`}
        alt="Decorative Dots"
        width={160}
        height={160}
        className="absolute bottom-8 right-8 animate-pulse"
        priority
      />
    </div>
  )
}
