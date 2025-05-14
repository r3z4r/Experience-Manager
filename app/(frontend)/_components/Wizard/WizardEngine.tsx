'use client'

import React from 'react'
import { WizardJourney, WizardStepType } from '@/lib/types/wizard'
import { WizardProvider, useWizard } from '@/lib/contexts/WizardContext'
import { LocalizationBar } from '@/app/(frontend)/_components/Localization/LocalizationBar'
import Link from 'next/link'

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
        // Handle form submission here
        console.log('Submitting wizard data:', formData)
        // You can make API calls here to save the data
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      }}
    >
      <WizardContent />
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
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1 flex space-x-2">
            {journey.steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => goToStep(idx)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${idx <= state.currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          {/* Localization controls */}
          {localizationConfig && (
            <LocalizationBar className="ml-4" />
          )}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((state.currentStepIndex + 1) / journey.steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">{currentStep?.label}</h2>
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6 pt-4 border-t">
        <button
          onClick={goToPreviousStep}
          disabled={isFirstStep}
          className={`px-4 py-2 rounded ${isFirstStep ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {state.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        ) : (
          <button
            onClick={() => {
              // Validate current step before proceeding
              if (currentStep && validateStep(currentStep.id)) {
                markStepAsCompleted(currentStep.id)
                goToNextStep()
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>

      {/* Submission confirmation - shown when submitted successfully */}
      {state.isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Submission Complete</h3>
            <p className="mb-6">Your journey has been submitted successfully!</p>
            <div className="flex justify-end">
              <Link href="/wizard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Back to Journeys
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
