'use client'

import React from 'react'
import { WizardJourney, WizardStepType } from '@/lib/types/wizard'
import { WizardEngine } from '@/app/(frontend)/_components/Wizard/WizardEngine'
import { LocalizationProvider } from '@/lib/contexts/LocalizationContext'
import { LocalizationBar } from '@/app/(frontend)/_components/Localization/LocalizationBar'
import { WizardProvider, useWizard } from '@/lib/contexts/WizardContext'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

interface WizardRunnerContentProps {
  journey: WizardJourney
}

// WizardStepper component for displaying the progress steps
const WizardStepper: React.FC = () => {
  const { journey, state, goToStep } = useWizard()
  
  // Helper function to determine step status
  const getStepStatus = (stepIndex: number, stepId: string) => {
    const isActive = stepIndex === state.currentStepIndex
    const isCompleted = stepIndex < state.currentStepIndex || state.completedSteps[stepId]
    
    return { isActive, isCompleted }
  }

  return (
    <div className="sticky top-[73px] bg-background z-10 pt-4 pb-2 px-6 border-b border-border">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Progress bar container with proper positioning */}
          <div className="absolute top-4 left-0 right-0 w-full -z-10 px-8">
            {/* Only show progress bar if we have more than one step */}
            {journey.steps.length > 1 && (
              <div className="relative w-full h-1">
                {/* Progress bar background */}
                <div className="w-full h-full bg-gray-100 rounded-full"></div>
                
                {/* Progress bar filled portion */}
                <div 
                  className="h-full absolute top-0 left-0 bg-primary rounded-full transition-all duration-300" 
                  style={{ 
                    width: `${Math.max(
                      (state.currentStepIndex / (journey.steps.length - 1)) * 100, 
                      5
                    )}%` 
                  }}
                ></div>
              </div>
            )}  
          </div>

          {/* Steps */}
          <div className="flex justify-between relative z-10 px-4">
            {journey.steps.map((step, idx) => {
              const { isActive, isCompleted } = getStepStatus(idx, step.id)

              return (
                <div key={step.id} className="flex flex-col items-center group">
                  <button
                    onClick={() => isCompleted && goToStep(idx)}
                    disabled={!isCompleted && !isActive}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : isCompleted
                          ? 'bg-primary/80 text-primary-foreground hover:ring-2 hover:ring-primary/20'
                          : 'bg-muted text-muted-foreground cursor-default'
                    }`}
                    aria-label={`Go to step ${idx + 1}: ${step.label}`}
                  >
                    {isCompleted ? <CheckIcon className="w-4 h-4" /> : idx + 1}
                  </button>
                  <span
                    className={`mt-2 text-xs font-medium truncate max-w-[120px] text-center ${isActive ? 'text-primary' : isCompleted ? 'text-primary/80' : 'text-muted-foreground'}`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// WizardFooter component for navigation buttons
const WizardFooter: React.FC = () => {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    validateStep,
    markStepAsCompleted,
    submitWizard,
    state
  } = useWizard()

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border py-4 px-6 z-20">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <button
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          className={`px-5 py-2.5 rounded-md flex items-center gap-1 transition-colors ${isFirstStep ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-background border border-border hover:bg-muted/30 text-foreground'}`}
          aria-disabled={isFirstStep}
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Back
        </button>

        {isLastStep ? (
          <button
            onClick={async () => {
              try {
                await submitWizard()
              } catch (error) {
                console.error('Error submitting wizard:', error)
              }
            }}
            disabled={state.isSubmitting}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
          >
            {state.isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              'Complete'
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              if (currentStep && validateStep(currentStep.id)) {
                markStepAsCompleted(currentStep.id)
                goToNextStep()
              }
            }}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-1 transition-colors"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Submission confirmation - shown when submitted successfully */}
      {state.isSubmitted && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20">
              <CheckIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Submission Complete</h3>
            <p className="mb-8 text-center text-muted-foreground">
              Your journey has been submitted successfully!
            </p>
            <div className="flex justify-center">
              <Link
                href="/wizard"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Main Page
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function WizardRunnerContent({ journey }: WizardRunnerContentProps) {
  if (!journey) {
    return <div className="p-8 text-center text-red-600">Journey not found</div>
  }

  // Ensure localization config has the necessary properties
  const localizationConfig = journey.localization
    ? {
        ...journey.localization,
        // Enable selectors if we have languages/currencies
        showLanguageSelector:
          journey.localization.showLanguageSelector ||
          (journey.localization.languages && journey.localization.languages.length > 0),
        showCurrencySelector:
          journey.localization.showCurrencySelector ||
          (journey.localization.currencies && journey.localization.currencies.length > 0),
      }
    : undefined

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Header - Full width, sticky */}
      <header className="w-full bg-card border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-semibold">{journey.label}</h1>
          {journey.description && <p className="text-muted-foreground text-sm mt-1">{journey.description}</p>}
        </div>
        
        {/* Localization controls in header */}
        <div className="flex items-center">
          <LocalizationProvider config={localizationConfig}>
            <LocalizationBar className="" />
          </LocalizationProvider>
        </div>
      </header>
      
      {/* Stepper - Sticky below header */}
      <LocalizationProvider config={localizationConfig}>
        <WizardProvider
          journey={journey}
          onSubmit={async (formData: Record<string, any>) => {
            console.log('Submitting wizard data:', formData)
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
          }}
        >
          <WizardStepper />
          
          {/* Main content - Takes remaining height */}
          <main className="flex-1 w-full overflow-auto px-6 pb-24">
            <div className="max-w-4xl mx-auto">
              <WizardEngine journey={journey} />
            </div>
          </main>
          
          {/* Footer with navigation - Sticky at bottom */}
          <WizardFooter />
        </WizardProvider>
      </LocalizationProvider>
    </div>
  )
}
