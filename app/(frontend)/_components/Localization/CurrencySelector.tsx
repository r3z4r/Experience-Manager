'use client'

import React from 'react'
import { useLocalization } from '@/lib/contexts/LocalizationContext'

interface CurrencySelectorProps {
  className?: string
}

export function CurrencySelector({ className = '' }: CurrencySelectorProps) {
  const { currentCurrency, setCurrentCurrency, getCurrencyName, getCurrencySymbol, config } = useLocalization()
  
  // If no currencies are configured or selector is disabled, don't render anything
  if (!config?.showCurrencySelector || !config?.currencies?.length) {
    return null
  }

  return (
    <div className={`currency-selector ${className}`}>
      <select
        value={currentCurrency}
        onChange={(e) => setCurrentCurrency(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
        aria-label="Select currency"
      >
        {config.currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {getCurrencySymbol(currency.code)} {getCurrencyName(currency.code)}
          </option>
        ))}
      </select>
    </div>
  )
}
