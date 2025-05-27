// Reusable header for Wizard pages, matching Xmanager TemplateList styling
'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface WizardHeaderProps {
  title?: string
  description?: string
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  title = 'Wizard Journeys',
  description,
}) => (
  <header className="template-header">
    <div className="header-logo">
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo.webp`}
        alt="Logo"
        width={120}
        height={120}
        className="object-contain"
      />
      <div className="flex flex-col">
        <span className="header-title">{title}</span>
        {description && <span className="text-sm text-gray-500 mt-1">{description}</span>}
      </div>
    </div>

    <Link href="/template-list" className="button-primary-outline button-lg">
      Template List
    </Link>
  </header>
)
