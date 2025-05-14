'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { LocalizationConfig } from '@/lib/types/wizard'

interface LocalizationContextType {
  currentLanguage: string
  setCurrentLanguage: (code: string) => void
  currentCurrency: string
  setCurrentCurrency: (code: string) => void
  getLanguageName: (code: string) => string
  getCurrencySymbol: (code: string) => string
  getCurrencyName: (code: string) => string
  formatCurrency: (amount: number) => string
  config: LocalizationConfig | undefined
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

interface LocalizationProviderProps {
  children: ReactNode
  config?: LocalizationConfig
}

export function LocalizationProvider({ children, config }: LocalizationProviderProps) {
  // Get default language and currency from config or use fallbacks
  const defaultLanguage = config?.languages?.find(lang => lang.default)?.code || 'en'
  const defaultCurrency = config?.currencies?.find(curr => curr.default)?.code || 'USD'

  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage)
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency)

  // Update language/currency if defaults change in config
  useEffect(() => {
    if (config?.languages?.find(lang => lang.default)?.code) {
      setCurrentLanguage(config.languages.find(lang => lang.default)?.code || 'en')
    }
    if (config?.currencies?.find(curr => curr.default)?.code) {
      setCurrentCurrency(config.currencies.find(curr => curr.default)?.code || 'USD')
    }
  }, [config])

  // Helper functions to get language and currency information
  const getLanguageName = (code: string): string => {
    return config?.languages?.find(lang => lang.code === code)?.name || code
  }

  const getCurrencySymbol = (code: string): string => {
    return config?.currencies?.find(curr => curr.code === code)?.symbol || '$'
  }

  const getCurrencyName = (code: string): string => {
    return config?.currencies?.find(curr => curr.code === code)?.name || code
  }

  // Format currency amount based on current currency
  const formatCurrency = (amount: number): string => {
    const symbol = getCurrencySymbol(currentCurrency)
    return `${symbol}${amount.toFixed(2)}`
  }

  const value = {
    currentLanguage,
    setCurrentLanguage,
    currentCurrency,
    setCurrentCurrency,
    getLanguageName,
    getCurrencySymbol,
    getCurrencyName,
    formatCurrency,
    config
  }

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}

export function useLocalization() {
  const context = useContext(LocalizationContext)
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider')
  }
  return context
}
