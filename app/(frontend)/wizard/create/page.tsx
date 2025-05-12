'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createJourneyAction } from '@/app/(frontend)/_actions/journeys'
import { JourneyForm } from '@/app/(frontend)/_components/Wizard/JourneyForm'
import { WizardJourney } from '@/lib/types/wizard'
import { WizardHeader } from '@/app/(frontend)/_components/Wizard/WizardHeader'

export default function WizardCreatePage() {
  const [journeyCreated, setJourneyCreated] = useState<{ id: string; slug: string } | null>(null)
  const router = useRouter()

  // Show success message after journey creation
  if (journeyCreated) {
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
                onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'}/wizard/edit/${journeyCreated.id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Journey
              </button>
              <button
                type="button"
                onClick={() => router.push(`${process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'}/wizard`)}
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

  // Render the journey creation form
  return (
    <>
      <WizardHeader title="Create Journey" />
      <div className="max-w-4xl mx-auto p-0 lg:p-8">
        <div className="mt-5">
          <JourneyForm
            onSubmit={async (journeyData) => {
              try {
                const journey = await createJourneyAction(journeyData as Omit<WizardJourney, 'id'>)
                setJourneyCreated({ id: journey.id, slug: journey.slug })
              } catch (error) {
                console.error('Error creating journey:', error)
                throw error
              }
            }}
            onCancel={() => router.push('/wizard')}
          />
        </div>
      </div>
    </>
  )
}
