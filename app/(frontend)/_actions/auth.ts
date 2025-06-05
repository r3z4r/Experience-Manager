'use server'

import type { User } from '@/payload-types'
import { cookies } from 'next/headers'

// Note: getApiUrl will be dynamically imported within functions to ensure runtime config is loaded.

/**
 * Type definitions for authentication operations
 */
type LoginResult = {
  success: boolean
  user?: Partial<User>
  message?: string
}

type LogoutResult = {
  success: boolean
  message?: string
}

/**
 * Gets the current authenticated user by calling Payload's /api/users/me endpoint.
 */
export async function getCurrentUser(): Promise<User | null> {
  console.log('[getCurrentUser] Attempting to fetch current user via API...')
  const { getApiUrl } = await import('@/app/(frontend)/_config/runtime')
  const apiUrl = getApiUrl('/api/users/me')
  const cookieStore = await cookies() // Await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    console.log('[getCurrentUser] No payload-token found in cookies. User is not authenticated.')
    return null
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Cookie: `payload-token=${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data for auth status
    })

    if (response.ok) {
      const data = await response.json()
      if (data.user) {
        return data.user as User
      }
      return null
    }
    const errorBody = await response.text()
    console.error(
      `[getCurrentUser] Failed to fetch user. Status: ${response.status}. Response: ${errorBody}`,
    )
    return null
  } catch (error) {
    console.error('[getCurrentUser] Exception during fetch user:', error)
    return null
  }
}

/**
 * Server Action for user login (DEPRECATED).
 * Login is now handled client-side by SignInForm.tsx calling /api/users/login directly.
 */
export async function loginUser(formData: FormData): Promise<LoginResult> {
  console.warn(
    '[loginUser Action] This server action is deprecated. Login should be handled by direct API calls from the client to /api/users/login.',
  )
  return {
    success: false,
    message:
      'This login method (server action) is deprecated. Client-side form submission to /api/users/login is used instead.',
  }
}

/**
 * Server Action for user logout.
 * Calls Payload's /api/users/logout endpoint and clears the auth cookie.
 */
export async function logoutUser(): Promise<LogoutResult> {
  console.log('[logoutUser] Attempting to log out user via API...')
  const { getApiUrl } = await import('@/app/(frontend)/_config/runtime')
  const apiUrl = getApiUrl('/api/users/logout')
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include token in cookie header for the API call
        ...(token && { Cookie: `payload-token=${token}` }),
      },
      cache: 'no-store',
    })

    // Always attempt to delete the cookie, regardless of API response for robustness
    cookieStore.delete('payload-token') // Use awaited cookieStore
    console.log('[logoutUser] payload-token cookie deletion attempted.')

    if (response.ok) {
      return { success: true, message: 'Logged out successfully.' }
    }
    const errorBody = await response.text()
    console.error(
      `[logoutUser] API logout failed. Status: ${response.status}. Response: ${errorBody}`,
    )
    return { success: false, message: 'API logout failed, but local cookie clear attempted.' }
  } catch (error) {
    console.error('[logoutUser] Exception during logout:', error)
    cookieStore.delete('payload-token')
    return { success: false, message: 'An error occurred during logout.' }
  }
}

/**
 * Type definition for password reset operation
 */
type PasswordResetResult = {
  success: boolean;
  message: string;
};

/**
 * Server Action for requesting a password reset.
 * Calls Payload's local forgotPassword API.
 */
export async function requestPasswordResetAction(email: string): Promise<PasswordResetResult> {
  if (!email) {
    return { success: false, message: 'Email address is required.' };
  }

  console.log(`[requestPasswordResetAction] Attempting password reset for email: ${email}`);

  try {
    // Dynamically import getPayload and configPromise
    const { getPayload } = await import('payload');
    const configPromise = (await import('@payload-config')).default; 

    const payload = await getPayload({ config: configPromise });

    await payload.forgotPassword({
      collection: 'users', 
      data: { email },
      expiration: 3600, // Token valid for 1 hour
      disableEmail: false, 
    });

    const successMessage = 'If an account with that email exists, a password reset link has been sent.';
    console.log(`[requestPasswordResetAction] ${successMessage}`);
    return { success: true, message: successMessage };

  } catch (error) {
    console.error('[requestPasswordResetAction] Exception during password reset:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
}
