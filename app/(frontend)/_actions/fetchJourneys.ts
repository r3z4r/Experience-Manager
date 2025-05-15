'use server';

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { WizardJourney } from '@/lib/types/wizard';

/**
 * Server action to fetch all journeys directly from PayloadCMS
 * @returns Array of WizardJourney objects
 */
export async function fetchJourneysAction(): Promise<WizardJourney[]> {
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await (payload as any).find({
      collection: 'journeys',
      sort: '-createdAt', // Sort by newest first
    });
    
    return result.docs.map((doc: any) => ({
      id: doc.id,
      label: doc.label,
      slug: doc.slug,
      steps: doc.steps,
      description: doc.description,
      localization: doc.localization,
    }));
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return [];
  }
}
