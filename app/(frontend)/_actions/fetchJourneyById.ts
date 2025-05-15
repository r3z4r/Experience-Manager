'use server';

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { WizardJourney } from '@/lib/types/wizard';

/**
 * Server action to fetch a journey by ID
 * Fetches a journey by ID or slug
 * @param journeyIdOrSlug The ID or slug of the journey to fetch
 * @returns The journey object or null if not found
 */
export async function fetchJourneyByIdAction(journeyIdOrSlug: string): Promise<WizardJourney | null> {
  try {
    const payload = await getPayload({ config: configPromise });
    
    let doc;
  
    try {
      // First try to find by ID
      doc = await (payload as any).findByID({
        collection: 'journeys',
        id: journeyIdOrSlug,
      });
    } catch (error) {
      // If not found by ID, try to find by slug
      const result = await (payload as any).find({
        collection: 'journeys',
        where: {
          slug: {
            equals: journeyIdOrSlug,
          },
        },
        limit: 1,
      });
      
      if (result.docs.length > 0) {
        doc = result.docs[0];
      } else {
        return null;
      }
    }
    
    if (!doc) return null;
    
    return {
      id: doc.id,
      label: doc.label,
      slug: doc.slug,
      steps: doc.steps,
      description: doc.description,
      localization: doc.localization,
    };
  } catch (error) {
    console.error(`Error fetching journey with ID/slug ${journeyIdOrSlug}:`, error);
    return null;
  }
}
