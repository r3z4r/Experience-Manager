// WizardEngine: manages steps, navigation, and state
'use client'
import React, { useState } from 'react'
import { WizardJourney, WizardStep, WizardStepProps, WizardStepType } from '@/lib/types/wizard'
import { CustomerLoginStep } from './steps/CustomerLoginStep'
import { ProductSelectionStep } from './steps/ProductSelectionStep'
import { ReviewSubmitStep } from './steps/ReviewSubmitStep'
import { TemplatePageStep } from './steps/TemplatePageStep'
import Link from 'next/link'

interface WizardEngineProps {
  journey: WizardJourney
}

export const WizardEngine: React.FC<WizardEngineProps> = ({ journey }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const step = journey.steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === journey.steps.length - 1

  const goNext = () => {
    if (!isLastStep) setCurrentStep(currentStep + 1)
  }

  const goBack = () => {
    if (!isFirstStep) setCurrentStep(currentStep - 1)
  }

  const goToStep = (index: number) => {
    if (index >= 0 && index < journey.steps.length) {
      setCurrentStep(index)
    }
  }

  const handleComplete = async () => {
    if (isLastStep) {
      try {
        setIsSubmitting(true)
        // Here you would typically submit the collected data
        // For now, we'll just simulate a submission with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert('Journey completed successfully!')
      } catch (error) {
        console.error('Error completing journey:', error)
        alert('Failed to complete journey. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  let StepComponent: React.FC<WizardStepProps>
  switch (step.type) {
    case WizardStepType.Predefined:
      if (step.ref === 'CustomerLoginStep') StepComponent = CustomerLoginStep
      else if (step.ref === 'ProductSelectionStep') StepComponent = ProductSelectionStep
      else if (step.ref === 'ReviewSubmitStep') StepComponent = ReviewSubmitStep
      else StepComponent = () => <div>Unknown step</div>
      break
    case WizardStepType.Template:
      StepComponent = TemplatePageStep
      break
    default:
      StepComponent = () => <div>Unknown step</div>
  }

  // SVG checkmark component with display name for ESLint
  const CheckmarkIcon: React.FC = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-3 h-3"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
  CheckmarkIcon.displayName = 'CheckmarkIcon'

  // Step indicator component with display name for ESLint
  const StepIndicator: React.FC = () => {
    return (
      <>
        {/* <div className="w-full px-6 py-4 border-b border-border bg-card"> */}
        {/* <div className="max-w-6xl mx-auto"> */}
        <div className="flex items-center justify-between">
          {journey.steps.map((s, idx) => {
            const isActive = idx === currentStep
            const isPast = idx < currentStep
            const isFuture = idx > currentStep

            return (
              <div key={s.id} className="flex flex-col items-center relative flex-1">
                {/* Connector line */}
                {idx < journey.steps.length - 1 && (
                  <div
                    className={`absolute h-0.5 top-3 left-1/2 w-full ${isPast ? 'bg-primary' : 'bg-muted'}`}
                  />
                )}

                {/* Step circle */}
                <button
                  onClick={() => goToStep(idx)}
                  disabled={isFuture}
                  className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                      : isPast
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isPast ? <CheckmarkIcon /> : idx + 1}
                </button>

                {/* Step label */}
                <span
                  className={`mt-2 text-xs ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                >
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
        {/* </div> */}
        {/* </div> */}
      </>
    )
  }
  StepIndicator.displayName = 'StepIndicator'

  return (
    <div className="flex flex-col h-full w-full">
      <StepIndicator />

      {/* Main content - takes remaining space */}
      {/* <div className="flex-1 overflow-auto p-6"> */}
      {/* <div className="max-w-6xl mx-auto bg-card border border-border rounded-lg p-6 min-h-[400px]"> */}
      <StepComponent
        step={step}
        state={state}
        setState={setState}
        goNext={goNext}
        goBack={goBack}
      />
      {/* </div> */}
      {/* </div> */}

      {/* Footer navigation - full width and sticky */}
      <div className="w-full border-t border-border py-4 px-6 flex justify-between items-center sticky bottom-0 bg-background z-10 shadow-sm">
        <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
          <div>
            <button
              onClick={goBack}
              disabled={isFirstStep}
              className={`button-secondary button-md ${isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-disabled={isFirstStep}
            >
              Back
            </button>
          </div>

          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {journey.steps.length}
          </div>

          <div>
            {isLastStep ? (
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="button-primary button-md"
              >
                {isSubmitting ? 'Completing...' : 'Complete'}
              </button>
            ) : (
              <button onClick={goNext} className="button-primary button-md">
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
