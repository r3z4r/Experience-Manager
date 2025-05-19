'use client'

import React from 'react'
import { useLocalization } from '@/lib/contexts/LocalizationContext'
import { DollarSign } from 'lucide-react'

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
    <div className={`currency-selector relative ${className}`}>
      <div className="flex items-center">
        <DollarSign size={16} className="text-primary mr-2" />
        <select
          value={currentCurrency}
          onChange={(e) => setCurrentCurrency(e.target.value)}
          className="pl-1 pr-6 py-1 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition appearance-none"
          aria-label="Select currency"
        >
          {config.currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {getCurrencySymbol(currency.code)} {getCurrencyName(currency.code)}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
