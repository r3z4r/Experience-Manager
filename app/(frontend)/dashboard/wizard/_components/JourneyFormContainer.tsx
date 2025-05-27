'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JourneyForm } from '@/app/(frontend)/_components/Wizard/JourneyForm'
import { WizardJourney } from '@/lib/types/wizard'
import { WizardHeader } from '@/app/(frontend)/_components/Wizard/WizardHeader'
import {
  createJourneyAction,
  updateJourneyAction,
  deleteJourneyAction,
} from '@/app/(frontend)/_actions/journeys'

interface JourneyFormContainerProps {
  initialJourney: WizardJourney
  journeyId?: string
  isEdit?: boolean
  description?: string
}

/**
 * A shared component for both creating and editing journeys
 * This centralizes the journey form logic to ensure consistency between create and edit pages
 */
export function JourneyFormContainer({
  initialJourney,
  journeyId,
  isEdit = false,
  description,
}: JourneyFormContainerProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [journeyCreated, setJourneyCreated] = useState<{ id: string; slug: string } | null>(null)

  const title = isEdit ? 'Edit Journey' : 'Create Journey'

  // Show success message after journey creation (only for create flow)
  if (!isEdit && journeyCreated) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Journey Created Successfully
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Your journey has been created and is ready to use.</p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => router.push(`/wizard/edit/${journeyCreated.id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Journey
              </button>
              <button
                type="button"
                onClick={() => router.push('/wizard')}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Journeys
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show delete confirmation dialog
  if (isEdit && isDeleting) {
    return (
      <>
        <WizardHeader title={title} />
        <div className="max-w-4xl mx-auto p-0 lg:p-8">
          <div className="template-card p-6 lg:p-8 space-y-8 border">
            <h1 className="text-2xl font-semibold mb-2">Confirm Deletion</h1>
            <div className="mt-2 text-gray-500">
              <p>Are you sure you want to delete this journey? This action cannot be undone.</p>
            </div>
            <div className="mt-5 flex space-x-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    if (journeyId) {
                      await deleteJourneyAction(journeyId)
                      router.push('/wizard')
                    }
                  } catch (error) {
                    console.error('Error deleting journey:', error)
                    setIsDeleting(false)
                  }
                }}
                className="button-destructive button-md"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="button-secondary button-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <WizardHeader title={title} description={description} />
      <div className="max-w-4xl mx-auto p-0 lg:p-8">
        <div className="mt-5">
          <JourneyForm
            initialJourney={initialJourney}
            journeyId={journeyId}
            isEdit={isEdit}
            onSubmit={async (journeyData) => {
              try {
                if (isEdit && journeyId) {
                  // Update existing journey
                  await updateJourneyAction(journeyId, journeyData)
                  router.push('/wizard')
                } else {
                  // Create new journey
                  const journey = await createJourneyAction(
                    journeyData as Omit<WizardJourney, 'id'>,
                  )
                  setJourneyCreated({ id: journey.id, slug: journey.slug })
                }
              } catch (error) {
                console.error(`Error ${isEdit ? 'updating' : 'creating'} journey:`, error)
                throw error
              }
            }}
            onDelete={
              isEdit
                ? async () => {
                    setIsDeleting(true)
                    return Promise.resolve()
                  }
                : undefined
            }
            onCancel={() => router.push('/wizard')}
          />
        </div>
      </div>
    </>
  )
}
