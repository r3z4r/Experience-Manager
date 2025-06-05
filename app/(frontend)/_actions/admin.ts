'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { User } from '@/payload-types'

/**
 * Type definitions for admin operations
 */
type UserCountResult = {
  success: boolean
  count?: number
  message?: string
}

/**
 * Gets the total count of users in the system
 * Uses PayloadCMS's Local API for direct access
 */
export async function getUserCount(): Promise<UserCountResult> {
  try {
    console.log('Admin Action: Fetching user count')
    
    const payload = await getPayload({
      config: configPromise,
    })
    
    // First check if current user has admin role
    const meResult = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 1,
      where: {
        id: {
          equals: 'me',
        },
      },
    })
    
    if (!meResult.docs || meResult.docs.length === 0) {
      return { 
        success: false, 
        message: 'Authentication required' 
      }
    }
    
    const currentUser = meResult.docs[0] as User
    
    if (!currentUser.roles || !currentUser.roles.includes('admin')) {
      return { 
        success: false, 
        message: 'Unauthorized access' 
      }
    }
    
    // Query for total users count
    const usersResult = await payload.find({
      collection: 'users',
      limit: 0, // We only need the count, not the actual documents
    })
    
    console.log(`Total users count: ${usersResult.totalDocs}`)
    
    return {
      success: true,
      count: usersResult.totalDocs
    }
  } catch (error) {
    console.error('Error fetching user count:', error)
    return { 
      success: false, 
      message: 'Failed to retrieve user count' 
    }
  }
}
