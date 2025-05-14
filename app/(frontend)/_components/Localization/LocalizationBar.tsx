'use client'

import React from 'react'
import { LanguageSelector } from './LanguageSelector'
import { CurrencySelector } from './CurrencySelector'
import { useLocalization } from '@/lib/contexts/LocalizationContext'

interface LocalizationBarProps {
  className?: string
}

export function LocalizationBar({ className = '' }: LocalizationBarProps) {
  const { config } = useLocalization()
  
  // If neither selector is enabled, don't render anything
  if (!config?.showLanguageSelector && !config?.showCurrencySelector) {
    return null
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <LanguageSelector />
      <CurrencySelector />
    </div>
  )
}
