import Image from 'next/image'
import React from 'react'

interface AuthBrandingProps {
  children?: React.ReactNode
}

export default function AuthBranding({ children }: AuthBrandingProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-start bg-gradient-to-br from-[#5B5BF6] to-[#1B3E8A] relative p-8 overflow-hidden max-h-screen">
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/dots.png`}
        alt="Decorative Dots"
        width={120}
        height={120}
        className="m-8 animate-pulse"
        priority
      />
      <div className="flex flex-col h-full w-full max-w-md z-10 m-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
          Experience
          <br />
          Manager
        </h1>
        <p className="text-lg text-white/80 mt-2 mb-8 max-w-xs drop-shadow">
          Effortless content creation and management for your digital experiences.
        </p>
        {children}
      </div>
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/dots.png`}
        alt="Decorative Dots"
        width={120}
        height={120}
        className="absolute bottom-8 right-8 opacity-80 animate-pulse"
        priority
      />
    </div>
  )
}
