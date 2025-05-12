'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { WizardJourney } from '@/lib/types/wizard'

/**
 * Updates an existing journey in PayloadCMS
 * @param journeyId - The ID of the journey to update
 * @param data - The updated journey data
 * @returns The updated journey document
 */
export async function updateJourneyAction(
  journeyId: string,
  data: Partial<Omit<WizardJourney, 'id'>>
) {
  const payload = await getPayload({ config: configPromise })

  // Update document in journeys collection
  // Using `any` to bypass Payload generic type limitations until types are regenerated
  const doc = await (payload as any).update({
    collection: 'journeys',
    id: journeyId,
    data,
  }) as any

  // Revalidate journeys list page and specific journey page
  revalidatePath('/wizard')
  revalidatePath(`/wizard/${journeyId}`)
  revalidatePath(`/wizard/${data.slug}`)

  return doc
}

/**
 * Deletes a journey from PayloadCMS
 * @param journeyId - The ID of the journey to delete
 * @returns The deleted journey document
 */
export async function deleteJourneyAction(journeyId: string) {
  const payload = await getPayload({ config: configPromise })

  // Delete document from journeys collection
  const doc = await (payload as any).delete({
    collection: 'journeys',
    id: journeyId,
  }) as any

  // Revalidate journeys list page
  revalidatePath('/wizard')

  return doc
}
