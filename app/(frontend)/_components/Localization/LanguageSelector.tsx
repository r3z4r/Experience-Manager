'use client'

import React from 'react'
import { useLocalization } from '@/lib/contexts/LocalizationContext'

interface LanguageSelectorProps {
  className?: string
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { currentLanguage, setCurrentLanguage, getLanguageName, config } = useLocalization()
  
  // If no languages are configured or selector is disabled, don't render anything
  if (!config?.showLanguageSelector || !config?.languages?.length) {
    return null
  }

  return (
    <div className={`language-selector ${className}`}>
      <select
        value={currentLanguage}
        onChange={(e) => setCurrentLanguage(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
        aria-label="Select language"
      >
        {config.languages.map((language) => (
          <option key={language.code} value={language.code}>
            {getLanguageName(language.code)}
          </option>
        ))}
      </select>
    </div>
  )
}
