import { fetchJourneyByIdAction } from '@/app/(frontend)/_actions/fetchJourneyById'
import { notFound } from 'next/navigation'
import { WizardJourney } from '@/lib/types/wizard'
import { WizardRunnerContent } from './WizardRunnerContent'

/**
 * Server component for displaying a journey by ID or slug
 */
export default async function WizardRunnerPage({
  params,
}: {
  params: Promise<{ journeyId: string }>
}) {
  const resolvedParams = await params
  const { journeyId } = resolvedParams
  // Fetch the journey data on the server
  const journey = await fetchJourneyByIdAction(journeyId)

  // If journey not found, show 404
  if (!journey) {
    notFound()
  }

  // Render the client component with the journey data
  return <WizardRunnerContent journey={journey} />
}
