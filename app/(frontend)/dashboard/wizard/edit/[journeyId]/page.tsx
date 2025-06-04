import React from 'react'
import { fetchJourneyByIdAction } from '@/app/(frontend)/_actions/fetchJourneyById'
import { JourneyFormContainer } from '@/app/(frontend)/dashboard/wizard/_components/JourneyFormContainer'
import { notFound } from 'next/navigation'

interface EditJourneyPageProps {
  params: Promise<{ journeyId: string }>
}

/**
 * Server component that fetches the journey data and passes it to the client component
 * Uses the shared JourneyFormContainer to maintain consistency with the create page
 */
export default async function EditJourneyPage({ params }: EditJourneyPageProps) {
  const resolvedParams = await params
  const { journeyId } = resolvedParams

  // Fetch journey data on the server
  const journey = await fetchJourneyByIdAction(journeyId)
  
  // If journey not found, show 404 page
  if (!journey) {
    notFound()
  }

  // Pass the journey data to the shared component
  return (
    <JourneyFormContainer 
      journeyId={journeyId} 
      initialJourney={journey} 
      isEdit={true}
      description="Edit your journey by modifying its name, slug, steps, or localization settings."
    />
  )
}
