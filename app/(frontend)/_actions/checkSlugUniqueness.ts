'use server';

import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Checks if a slug is unique within a collection
 * @param slug - The slug to check
 * @param collection - The collection to check against
 * @param excludeId - Optional ID to exclude from the check (for updates)
 * @returns True if the slug is unique, false otherwise
 */
export async function checkSlugUniquenessAction(
  slug: string,
  collection: string = 'journeys',
  excludeId?: string
): Promise<boolean> {
  if (!slug) return false;
  
  try {
    const payload = await getPayload({ config: configPromise });
    
    const query: any = {
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    };
    
    // If updating, exclude the current document from the check
    if (excludeId) {
      query.where.id = {
        not_equals: excludeId,
      };
    }
    
    const result = await (payload as any).find({
      collection,
      ...query,
    });
    
    return result.docs.length === 0;
  } catch (error) {
    console.error('Error checking slug uniqueness:', error);
    return false;
  }
}
