'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { WizardJourney } from '@/lib/types/wizard'

export async function createJourneyAction(data: Omit<WizardJourney, 'id'>) {
  const payload = await getPayload({ config: configPromise })

  // Create document in journeys collection
  // Using `any` to bypass Payload generic type limitations until types are regenerated
  const doc = await (payload as any).create({
    collection: 'journeys',
    data,
  }) as any

  // Revalidate journeys list page
  revalidatePath('/wizard')

  return doc
}

export async function updateJourneyAction(journeyId: string, data: Partial<Omit<WizardJourney, 'id'>>) {
  const payload = await getPayload({ config: configPromise })

  // Update document in journeys collection
  const doc = await (payload as any).update({
    collection: 'journeys',
    id: journeyId,
    data,
  }) as any

  // Revalidate journeys list page
  revalidatePath('/wizard')

  return doc
}

export async function deleteJourneyAction(journeyId: string) {
  const payload = await getPayload({ config: configPromise })

  // Delete document from journeys collection
  await (payload as any).delete({
    collection: 'journeys',
    id: journeyId,
  })

  // Revalidate journeys list page
  revalidatePath('/wizard')
}
