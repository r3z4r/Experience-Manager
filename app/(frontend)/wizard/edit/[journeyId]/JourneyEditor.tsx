'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JourneyForm } from '@/app/(frontend)/_components/Wizard/JourneyForm'
import { updateJourneyAction, deleteJourneyAction } from '@/app/(frontend)/_actions/journeys'
import { WizardJourney } from '@/lib/types/wizard'
import { WizardHeader } from '@/app/(frontend)/_components/Wizard/WizardHeader'

interface JourneyEditorProps {
  journeyId: string
  initialJourney: WizardJourney
}

export function JourneyEditor({ journeyId, initialJourney }: JourneyEditorProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  if (isDeleting) {
    return (
      <>
        <WizardHeader title="Edit Journey" />
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
                    await deleteJourneyAction(journeyId)
                    router.push('/wizard')
                  } catch (error) {
                    console.error('Error deleting journey:', error)
                    setIsDeleting(false)
                  }
                }}
                className="button-danger button-md"
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
      <WizardHeader title="Edit Journey" />
      <div className="max-w-4xl mx-auto p-0 lg:p-8">
        <div className="mt-5">
          <JourneyForm
            initialJourney={initialJourney}
            journeyId={journeyId}
            isEdit={true}
            onSubmit={async (journeyData) => {
              try {
                await updateJourneyAction(journeyId, journeyData)
                router.refresh()
              } catch (error) {
                console.error('Error updating journey:', error)
                throw error
              }
            }}
            onDelete={async (id) => {
              setIsDeleting(true)
              return Promise.resolve()
            }}
            onCancel={() => router.push('/wizard')}
          />
        </div>
      </div>
    </>
  )
}
