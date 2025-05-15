'use client'

import React from 'react'
import { WizardJourney, WizardStepType } from '@/lib/types/wizard'
import { WizardProvider, useWizard } from '@/lib/contexts/WizardContext'
import { LocalizationProvider } from '@/lib/contexts/LocalizationContext'
import { LocalizationBar } from '@/app/(frontend)/_components/Localization/LocalizationBar'
import Link from 'next/link'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'

interface WizardEngineProps {
  journey: WizardJourney
}

/**
 * Main WizardEngine component that wraps the wizard content with the WizardProvider
 */
export const WizardEngine: React.FC<WizardEngineProps> = ({ journey }) => {
  return (
    <WizardProvider 
      journey={journey} 
      onSubmit={async (formData) => {
        console.log('Submitting wizard data:', formData)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      }}
    >
      <LocalizationProvider config={journey.localization}>
        <WizardContent />
      </LocalizationProvider>
    </WizardProvider>
  )
}

/**
 * Inner component that uses the wizard context
 */
const WizardContent: React.FC = () => {
  // Use the wizard context
  const {
    journey,
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    state,
    updateFormData,
    getStepData,
    validateStep,
    markStepAsCompleted,
    submitWizard,
    localizationConfig
  } = useWizard()
  // Render the step content based on type
  const renderStepContent = () => {
    if (!currentStep) return null

    // Create a placeholder component for each step type
    // In a real implementation, you would import and render actual step components
    switch (currentStep.type) {
      case WizardStepType.Predefined:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">{currentStep.label}</h3>
            <p className="mb-4">This is a predefined step with reference: {currentStep.ref}</p>
            <p className="text-sm text-gray-500 mb-4">In a real implementation, this would render a specific predefined component.</p>
            
            {/* Example form fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Sample Field</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded"
                  onChange={(e) => updateFormData(currentStep.id, { 
                    ...getStepData(currentStep.id),
                    sampleField: e.target.value 
                  })}
                  value={getStepData(currentStep.id).sampleField || ''}
                />
              </div>
            </div>
          </div>
        )
      
      case WizardStepType.Template:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">{currentStep.label}</h3>
            <p className="mb-4">This is a template step with reference: {currentStep.ref}</p>
            <p className="text-sm text-gray-500 mb-4">In a real implementation, this would render a template from the CMS.</p>
          </div>
        )
      
      case WizardStepType.PredefinedComponent:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">{currentStep.label}</h3>
            <p className="mb-4">This is a predefined component step with reference: {currentStep.ref}</p>
            <p className="text-sm text-gray-500 mb-4">In a real implementation, this would render a predefined component.</p>
          </div>
        )

      default:
        return <div>Unknown step type: {currentStep.type}</div>
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with journey title and localization */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{journey.label}</h2>
          
          {/* Localization controls */}
          <LocalizationBar className="ml-4" />
        </div>
        
        {/* Modern stepper */}
        <div className="mb-6">
          <div className="relative">
            {/* Progress bar */}
            <div className="w-full bg-gray-100 h-1 absolute top-4 left-0 right-0 -z-10"></div>
            
            {/* Steps */}
            <div className="flex justify-between relative z-10">
              {journey.steps.map((s, idx) => {
                const isActive = idx === state.currentStepIndex;
                const isCompleted = idx < state.currentStepIndex || state.completedSteps[s.id];
                const isPending = idx > state.currentStepIndex && !state.completedSteps[s.id];
                
                return (
                  <div key={s.id} className="flex flex-col items-center">
                    <button
                      onClick={() => isCompleted && goToStep(idx)}
                      disabled={!isCompleted && !isActive}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                        isCompleted ? 'bg-green-500 text-white hover:ring-2 hover:ring-green-100' : 
                        'bg-gray-200 text-gray-400 cursor-default'
                      }`}
                      aria-label={`Go to step ${idx + 1}: ${s.label}`}
                    >
                      {isCompleted ? <CheckIcon className="w-4 h-4" /> : idx + 1}
                    </button>
                    <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Step counter */}
          <div className="flex justify-end mt-2">
            <div className="text-sm font-medium text-gray-500">
              Step {state.currentStepIndex + 1} of {journey.steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="max-w-3xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6 pt-6">
        <button
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          className={`px-5 py-2.5 rounded-md flex items-center transition-colors ${isFirstStep ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'}`}
          aria-disabled={isFirstStep}
        >
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
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            {state.isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : 'Submit'}
          </button>
        ) : (
          <button
            onClick={() => {
              if (currentStep && validateStep(currentStep.id)) {
                markStepAsCompleted(currentStep.id)
                goToNextStep()
              }
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 transition-colors"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Submission confirmation - shown when submitted successfully */}
      {state.isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-green-100">
              <CheckIcon className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Submission Complete</h3>
            <p className="mb-8 text-center text-gray-600">Your journey has been submitted successfully!</p>
            <div className="flex justify-center">
              <Link 
                href="/wizard" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Journeys
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
