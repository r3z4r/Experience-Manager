'use client';

import React, { useState } from 'react';
import { LocalizationConfig } from '@/lib/types/wizard';
import { AlertTriangleIcon, PlusIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import { COMMON_LANGUAGES, COMMON_CURRENCIES } from '@/lib/constants/localization';

interface LocalizationConfigProps {
  value: LocalizationConfig | undefined;
  onChange: (config: LocalizationConfig) => void;
}

export function LocalizationConfigEditor({ value, onChange }: LocalizationConfigProps) {
  const [newLanguage, setNewLanguage] = useState('');
  const [newCurrency, setNewCurrency] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const [currencySearch, setCurrencySearch] = useState('');
  
  // Handle keyboard events for adding languages and currencies
  const handleLanguageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newLanguage) {
      e.preventDefault();
      addLanguage();
    }
  };
  
  const handleCurrencyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCurrency) {
      e.preventDefault();
      addCurrency();
    }
  };
  
  // Initialize with default values if not provided
  const config: LocalizationConfig = value || {
    languages: [],
    currencies: []
  };
  
  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    
    // Don't add duplicates
    if (config.languages?.some(l => l.code === newLanguage)) {
      return;
    }
    
    // Get language name from browser's Intl API
    const languageName = new Intl.DisplayNames(['en'], { type: 'language' }).of(newLanguage);
    
    const updatedConfig = {
      ...config,
      languages: [
        ...(config.languages || []),
        { code: newLanguage, name: languageName || newLanguage }
      ]
    };
    
    onChange(updatedConfig);
    setNewLanguage('');
  };
  
  const removeLanguage = (code: string) => {
    const updatedConfig = {
      ...config,
      languages: config.languages?.filter(l => l.code !== code) || []
    };
    
    onChange(updatedConfig);
  };
  
  const addCurrency = () => {
    if (!newCurrency.trim()) return;
    
    // Don't add duplicates
    if (config.currencies?.some(c => c.code === newCurrency)) {
      return;
    }
    
    // Get currency name and symbol from browser's Intl API
    let currencyName = '';
    let currencySymbol = '';
    
    try {
      currencyName = new Intl.DisplayNames(['en'], { type: 'currency' }).of(newCurrency) || newCurrency;
      currencySymbol = new Intl.NumberFormat('en', { style: 'currency', currency: newCurrency }).formatToParts(1)
        .find(part => part.type === 'currency')?.value || newCurrency;
    } catch (error) {
      console.warn(`Invalid currency code: ${newCurrency}`);
      currencyName = newCurrency;
      currencySymbol = newCurrency;
    }
    
    const updatedConfig = {
      ...config,
      currencies: [
        ...(config.currencies || []),
        { code: newCurrency, name: currencyName, symbol: currencySymbol }
      ]
    };
    
    onChange(updatedConfig);
    setNewCurrency('');
  };
  
  const removeCurrency = (code: string) => {
    const updatedConfig = {
      ...config,
      currencies: config.currencies?.filter(c => c.code !== code) || []
    };
    
    onChange(updatedConfig);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Languages</h3>
          <div className="text-sm text-gray-500">Add languages that will be available in this journey</div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Language</label>
          <div className="relative">
            <input
              type="text"
              value={languageSearch}
              onChange={(e) => {
                setLanguageSearch(e.target.value);
                setShowLanguageDropdown(true);
              }}
              onFocus={() => setShowLanguageDropdown(true)}
              onKeyDown={handleLanguageKeyDown}
              placeholder="Search or select a language"
              className="w-full border border-border rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder-gray-400 bg-background"
            />
            <button 
              type="button" 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              aria-label="Toggle language dropdown"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
            
            {showLanguageDropdown && (
              <div 
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                onBlur={() => setShowLanguageDropdown(false)}
              >
                <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                  {/* Search heading if there are results */}
                  {COMMON_LANGUAGES.filter(lang => 
                    !config.languages?.some(l => l.code === lang.code) &&
                    (lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
                     lang.code.toLowerCase().includes(languageSearch.toLowerCase()))
                  ).length > 0 && (
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available Languages
                    </div>
                  )}
                  
                  {COMMON_LANGUAGES
                    .filter(lang => 
                      !config.languages?.some(l => l.code === lang.code) &&
                      (lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
                       lang.code.toLowerCase().includes(languageSearch.toLowerCase()))
                    )
                    .map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between"
                        onClick={() => {
                          setNewLanguage(lang.code);
                          setLanguageSearch('');
                          setShowLanguageDropdown(false);
                          // Auto-add the language
                          const updatedConfig = {
                            ...config,
                            languages: [
                              ...(config.languages || []),
                              { code: lang.code, name: lang.name }
                            ]
                          };
                          onChange(updatedConfig);
                        }}
                      >
                        <span>{lang.name}</span>
                        <span className="text-xs text-gray-500">{lang.code}</span>
                      </button>
                    ))
                  }
                  {languageSearch && !COMMON_LANGUAGES.some(l => l.code === languageSearch) && (
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between bg-blue-50"
                      onClick={() => {
                        setNewLanguage(languageSearch);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      <span>Use custom code: {languageSearch}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">Select from common languages or type a custom ISO code</p>
        </div>
        
        {(config.languages?.length || 0) === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              No languages configured. The journey will use the browser's default language.
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-3">
            {config.languages?.map(lang => (
              <div key={lang.code} className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-md text-sm group hover:bg-blue-100 transition-colors">
                <span className="font-medium text-blue-800">{lang.name}</span>
                <span className="text-blue-500 text-xs">({lang.code})</span>
                <button
                  type="button"
                  onClick={() => removeLanguage(lang.code)}
                  className="ml-1.5 text-blue-400 hover:text-red-500 opacity-70 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${lang.name}`}
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Currencies</h3>
          <div className="text-sm text-gray-500">Add currencies that will be available in this journey</div>
        </div>
        
        <div className="relative mt-6">
          <label className="block text-sm font-medium mb-1">Currency</label>
          <div className="relative">
            <input
              type="text"
              value={currencySearch}
              onChange={(e) => {
                setCurrencySearch(e.target.value);
                setShowCurrencyDropdown(true);
              }}
              onFocus={() => setShowCurrencyDropdown(true)}
              onKeyDown={handleCurrencyKeyDown}
              placeholder="Search or select a currency"
              className="w-full border border-border rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder-gray-400 bg-background"
            />
            <button 
              type="button" 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              aria-label="Toggle currency dropdown"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
            
            {showCurrencyDropdown && (
              <div 
                className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                onBlur={() => setShowCurrencyDropdown(false)}
              >
                <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                  {/* Search heading if there are results */}
                  {COMMON_CURRENCIES.filter(currency => 
                    !config.currencies?.some(c => c.code === currency.code) &&
                    (currency.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
                     currency.code.toLowerCase().includes(currencySearch.toLowerCase()))
                  ).length > 0 && (
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available Currencies
                    </div>
                  )}
                  
                  {COMMON_CURRENCIES
                    .filter(currency => 
                      !config.currencies?.some(c => c.code === currency.code) &&
                      (currency.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
                       currency.code.toLowerCase().includes(currencySearch.toLowerCase()))
                    )
                    .map(currency => (
                      <button
                        key={currency.code}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between"
                        onClick={() => {
                          setNewCurrency(currency.code);
                          setCurrencySearch('');
                          setShowCurrencyDropdown(false);
                          // Auto-add the currency
                          const updatedConfig = {
                            ...config,
                            currencies: [
                              ...(config.currencies || []),
                              { code: currency.code, name: currency.name, symbol: currency.symbol }
                            ]
                          };
                          onChange(updatedConfig);
                        }}
                      >
                        <span>{currency.name}</span>
                        <span className="text-xs text-gray-500">{currency.symbol} ({currency.code})</span>
                      </button>
                    ))
                  }
                  {currencySearch && !COMMON_CURRENCIES.some(c => c.code === currencySearch) && (
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md flex items-center justify-between bg-blue-50"
                      onClick={() => {
                        setNewCurrency(currencySearch);
                        setShowCurrencyDropdown(false);
                      }}
                    >
                      <span>Use custom code: {currencySearch}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">Select from common currencies or type a custom ISO code</p>
          
          {newCurrency && (
            <div className="mt-2 flex items-center">
              <span className="text-sm">Press Enter to add <strong>{newCurrency}</strong></span>
              <button
                type="button"
                onClick={addCurrency}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Add now
              </button>
            </div>
          )}
        </div>
        
        {(config.currencies?.length || 0) === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              No currencies configured. The journey will use the browser's default currency format.
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-3">
            {config.currencies?.map(currency => (
              <div key={currency.code} className="flex items-center gap-1 bg-green-50 border border-green-100 px-3 py-1.5 rounded-md text-sm group hover:bg-green-100 transition-colors">
                <span className="font-medium text-green-800">{currency.name}</span>
                <span className="text-green-600 text-xs mr-1">{currency.symbol}</span>
                <span className="text-green-500 text-xs">({currency.code})</span>
                <button
                  type="button"
                  onClick={() => removeCurrency(currency.code)}
                  className="ml-1.5 text-green-400 hover:text-red-500 opacity-70 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${currency.name}`}
                >
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
