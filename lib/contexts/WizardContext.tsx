'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { WizardJourney, WizardStep, LocalizationConfig } from '@/lib/types/wizard'

// Define the shape of the wizard state
interface WizardState {
  // Current active step index
  currentStepIndex: number
  
  // Form data collected across all steps
  formData: Record<string, any>
  
  // Validation errors for each step
  validationErrors: Record<string, string[]>
  
  // Completion status for each step
  completedSteps: Record<string, boolean>
  
  // Overall submission status
  isSubmitting: boolean
  isSubmitted: boolean
  
  // Localization state
  currentLanguage: string
  currentCurrency: string
}

// Define the context interface
interface WizardContextType {
  // The journey definition
  journey: WizardJourney
  
  // Current state
  state: WizardState
  
  // Navigation methods
  goToStep: (index: number) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  
  // Current step information
  currentStep: WizardStep | null
  isFirstStep: boolean
  isLastStep: boolean
  
  // Data management
  updateFormData: (stepId: string, data: Record<string, any>) => void
  getStepData: (stepId: string) => Record<string, any>
  
  // Validation
  validateStep: (stepId: string) => boolean
  setStepValidationErrors: (stepId: string, errors: string[]) => void
  
  // Step completion
  markStepAsCompleted: (stepId: string, isCompleted?: boolean) => void
  isStepCompleted: (stepId: string) => boolean
  
  // Form submission
  submitWizard: () => Promise<void>
  
  // Localization methods
  setLanguage: (code: string) => void
  setCurrentCurrency: (code: string) => void
  getLanguageName: (code: string) => string
  getCurrencySymbol: (code: string) => string
  getCurrencyName: (code: string) => string
  formatCurrency: (amount: number) => string
  
  // Localization config
  localizationConfig: LocalizationConfig | undefined
}

// Create the context with undefined default value
const WizardContext = createContext<WizardContextType | undefined>(undefined)

// Provider props interface
interface WizardProviderProps {
  children: ReactNode
  journey: WizardJourney
  onSubmit?: (formData: Record<string, any>) => Promise<void>
}

// Create the provider component
export function WizardProvider({ children, journey, onSubmit }: WizardProviderProps) {
  // Initialize wizard state
  const [state, setState] = useState<WizardState>({
    currentStepIndex: 0,
    formData: {},
    validationErrors: {},
    completedSteps: {},
    isSubmitting: false,
    isSubmitted: false,
    currentLanguage: journey.localization?.languages?.find(lang => lang.default)?.code || 'en',
    currentCurrency: journey.localization?.currencies?.find(curr => curr.default)?.code || 'USD'
  })
  
  // Get current step
  const currentStep = journey.steps[state.currentStepIndex] || null
  
  // Navigation methods
  const goToStep = (index: number) => {
    if (index >= 0 && index < journey.steps.length) {
      setState(prev => ({ ...prev, currentStepIndex: index }))
    }
  }
  
  const goToNextStep = () => {
    if (state.currentStepIndex < journey.steps.length - 1) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }))
    }
  }
  
  const goToPreviousStep = () => {
    if (state.currentStepIndex > 0) {
      setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex - 1 }))
    }
  }
  
  // Data management methods
  const updateFormData = (stepId: string, data: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [stepId]: data
      }
    }))
  }
  
  const getStepData = (stepId: string): Record<string, any> => {
    return state.formData[stepId] || {}
  }
  
  // Validation methods
  const validateStep = (stepId: string): boolean => {
    // Find the step
    const step = journey.steps.find(s => s.id === stepId)
    
    // If step has a validate function, use it
    if (step?.validate) {
      const isValid = step.validate(getStepData(stepId))
      
      // If not valid, ensure we have an empty errors array at minimum
      if (!isValid && !state.validationErrors[stepId]) {
        setStepValidationErrors(stepId, ['Validation failed'])
      }
      
      return isValid
    }
    
    // If no validation function, consider it valid
    return true
  }
  
  const setStepValidationErrors = (stepId: string, errors: string[]) => {
    setState(prev => ({
      ...prev,
      validationErrors: {
        ...prev.validationErrors,
        [stepId]: errors
      }
    }))
  }
  
  // Step completion methods
  const markStepAsCompleted = (stepId: string, isCompleted = true) => {
    setState(prev => ({
      ...prev,
      completedSteps: {
        ...prev.completedSteps,
        [stepId]: isCompleted
      }
    }))
  }
  
  const isStepCompleted = (stepId: string): boolean => {
    return !!state.completedSteps[stepId]
  }
  
  // Form submission
  const submitWizard = async () => {
    // Mark as submitting
    setState(prev => ({ ...prev, isSubmitting: true }))
    
    try {
      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(state.formData)
      }
      
      // Mark as submitted
      setState(prev => ({ ...prev, isSubmitting: false, isSubmitted: true }))
    } catch (error) {
      console.error('Error submitting wizard:', error)
      setState(prev => ({ ...prev, isSubmitting: false }))
      throw error
    }
  }
  
  // Localization methods
  const setLanguage = (code: string) => {
    setState(prev => ({ ...prev, currentLanguage: code }))
  }
  
  const setCurrentCurrency = (code: string) => {
    setState(prev => ({ ...prev, currentCurrency: code }))
  }
  
  const getLanguageName = (code: string): string => {
    return journey.localization?.languages?.find(lang => lang.code === code)?.name || code
  }
  
  const getCurrencySymbol = (code: string): string => {
    return journey.localization?.currencies?.find(curr => curr.code === code)?.symbol || '$'
  }
  
  const getCurrencyName = (code: string): string => {
    return journey.localization?.currencies?.find(curr => curr.code === code)?.name || code
  }
  
  const formatCurrency = (amount: number): string => {
    const symbol = getCurrencySymbol(state.currentCurrency)
    return `${symbol}${amount.toFixed(2)}`
  }
  
  // Create the context value
  const contextValue: WizardContextType = {
    journey,
    state,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    currentStep,
    isFirstStep: state.currentStepIndex === 0,
    isLastStep: state.currentStepIndex === journey.steps.length - 1,
    updateFormData,
    getStepData,
    validateStep,
    setStepValidationErrors,
    markStepAsCompleted,
    isStepCompleted,
    submitWizard,
    setLanguage,
    setCurrentCurrency,
    getLanguageName,
    getCurrencySymbol,
    getCurrencyName,
    formatCurrency,
    localizationConfig: journey.localization
  }
  
  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  )
}

// Hook for using the wizard context
export function useWizard() {
  const context = useContext(WizardContext)
  
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  
  return context
}
