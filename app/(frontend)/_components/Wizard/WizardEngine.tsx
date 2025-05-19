'use client'

import React from 'react'
import { WizardJourney, WizardStepType } from '@/lib/types/wizard'
import { useWizard } from '@/lib/contexts/WizardContext'
import { TemplatePageStep } from './steps/TemplatePageStep'
import { getPredefinedStepById } from './predefined'

interface WizardEngineProps {
  journey: WizardJourney
}

/**
 * Main WizardEngine component that renders the current step content
 * Note: This component expects to be used within a WizardProvider context
 */
export const WizardEngine: React.FC<WizardEngineProps> = ({ journey }) => {
  return <WizardContent />
}

/**
 * Inner component that uses the wizard context to render the current step content
 */
const WizardContent: React.FC = () => {
  // Use the wizard context
  const {
    journey,
    currentStep,
    state,
    updateFormData,
    getStepData,
    goToNextStep,
    goToPreviousStep,
  } = useWizard()

  // Render the step content based on type
  const renderStepContent = () => {
    if (!currentStep) return null

    // Helper function to render the common step container
    const renderStepContainer = (
      title: string,
      description: string,
      helpText: string,
      children?: React.ReactNode,
    ) => (
      <div className="bg-white rounded-lg p-4">
        <p className="mb-4">{description}</p>
        <p className="text-sm text-gray-500 mb-4">{helpText}</p>
        {children}
      </div>
    )

    // Render the appropriate component based on step type
    switch (currentStep.type) {
      case WizardStepType.Predefined: {
        // Try to get a predefined step based on the reference
        const predefinedStep = getPredefinedStepById(currentStep.ref)

        if (predefinedStep) {
          // Use the component from the predefined step
          const Component = predefinedStep.component
          return (
            <Component
              step={currentStep}
              goNext={goToNextStep}
              goBack={goToPreviousStep}
              formData={getStepData(currentStep.id)}
              updateFormData={(data: Record<string, any>) => updateFormData(currentStep.id, data)}
            />
          )
        }

        // Fallback if predefined step not found
        return (
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">{currentStep.label}</h3>
            <p className="text-amber-600 mb-4">
              Predefined step with reference "{currentStep.ref}" not found.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Sample Field</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    updateFormData(currentStep.id, {
                      ...getStepData(currentStep.id),
                      sampleField: e.target.value,
                    })
                  }
                  value={getStepData(currentStep.id).sampleField || ''}
                />
              </div>
            </div>
          </div>
        )
      }

      case WizardStepType.Template:
        // Use the dedicated TemplatePageStep component for template steps
        return (
          <TemplatePageStep
            step={currentStep}
            goNext={goToNextStep}
            goBack={goToPreviousStep}
            state={getStepData(currentStep.id)}
            setState={(data: Record<string, any>) => updateFormData(currentStep.id, data)}
          />
        )

      case WizardStepType.PredefinedComponent: {
        // Similar to Predefined but with different handling if needed
        const predefinedStep = getPredefinedStepById(currentStep.ref)

        if (predefinedStep) {
          // Use the component from the predefined step
          const Component = predefinedStep.component
          return (
            <Component
              step={currentStep}
              goNext={goToNextStep}
              goBack={goToPreviousStep}
              formData={getStepData(currentStep.id)}
              updateFormData={(data: Record<string, any>) => updateFormData(currentStep.id, data)}
            />
          )
        }

        // Fallback if component not found
        return (
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">{currentStep.label}</h3>
            <p className="text-amber-600 mb-4">
              Predefined component with reference "{currentStep.ref}" not found.
            </p>
          </div>
        )
      }

      default:
        return <div>Unknown step type: {currentStep.type}</div>
    }
  }

  return (
    <div className="py-6">
      {/* Only render the step content */}
      {renderStepContent()}
    </div>
  )
}
