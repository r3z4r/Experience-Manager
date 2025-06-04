'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { User } from '@/payload-types'

/**
 * Type definitions for authentication operations
 */
type LoginResult = {
  success: boolean
  user?: Partial<User>
  message?: string
}

type SignupResult = {
  success: boolean
  userId?: string
  message?: string
}

type LogoutResult = {
  success: boolean
  message?: string
}

/**
 * Gets the current authenticated user from the request
 * Uses PayloadCMS's built-in authentication
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Use PayloadCMS's built-in 'me' operation to get the current user
    // This automatically uses the cookie from the request
    const result = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 1,
      where: {
        id: {
          equals: 'me',
        },
      },
    })

    // If user is found, return it
    if (result.docs && result.docs.length > 0) {
      return result.docs[0] as User
    }

    return null
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
}

/**
 * Server Action for user login
 * Uses PayloadCMS's built-in login functionality which handles cookies automatically
 */
export async function loginUser(formData: FormData): Promise<LoginResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      success: false,
      message: 'Email and password are required',
    }
  }

  try {
    console.log('Attempting to login user with email:', email)

    const payload = await getPayload({
      config: configPromise,
    })

    // Use PayloadCMS's built-in login functionality
    // This automatically sets the authentication cookie
    const loginResult = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    // Return a safe version of the user (without sensitive data)
    const safeUser = {
      id: loginResult.user.id,
      email: loginResult.user.email,
      username: loginResult.user.username,
      roles: loginResult.user.roles || [],
      createdAt: loginResult.user.createdAt,
    }

    return {
      success: true,
      user: safeUser,
    }
  } catch (error: any) {
    console.error('Login error:', error)

    // Handle specific error cases
    if (error.message?.includes('credentials')) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    return {
      success: false,
      message: 'Authentication failed',
    }
  }
}

/**
 * Server Action for user signup
 * Uses PayloadCMS's built-in user creation functionality
 */
export async function signupUser(formData: FormData): Promise<SignupResult> {
  const email = formData.get('email') as string
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!email || !username || !password) {
    return {
      success: false,
      message: 'All fields are required',
    }
  }

  try {
    console.log('Attempting to create user with email:', email, 'and username:', username)

    const payload = await getPayload({
      config: configPromise,
    })

    // Create the user with default role using PayloadCMS's local API
    const userData = {
      email,
      username,
      password,
      roles: ['user'] as ('user' | 'admin' | 'editor')[], // Set default role to 'user'
    }

    const result = await payload.create({
      collection: 'users',
      data: userData,
    })

    console.log('User created successfully:', result.id)

    return {
      success: true,
      message: 'Account created successfully',
      userId: result.id,
    }
  } catch (error: any) {
    console.error('Signup error:', error)

    // Handle specific error cases for better user feedback
    if (error.errors) {
      // PayloadCMS validation errors
      const fieldErrors = error.errors.reduce((acc: Record<string, string>, err: any) => {
        if (err.field) {
          acc[err.field] = err.message
        }
        return acc
      }, {})

      if (fieldErrors.email) {
        return {
          success: false,
          message: fieldErrors.email,
        }
      }

      if (fieldErrors.username) {
        return {
          success: false,
          message: fieldErrors.username,
        }
      }
    }

    // Handle duplicate key errors
    if (error.message?.includes('duplicate key')) {
      if (error.message.includes('email')) {
        return {
          success: false,
          message: 'Email address is already in use',
        }
      } else if (error.message.includes('username')) {
        return {
          success: false,
          message: 'Username is already taken',
        }
      }
    }

    return {
      success: false,
      message: 'Failed to create account',
    }
  }
}

/**
 * Finds a user by their username
 */
export async function findUserByUsername(username: string): Promise<User | null> {
  if (!username) {
    console.warn('findUserByUsername called with no username')
    return null
  }

  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const usersResult = await payload.find({
      collection: 'users',
      where: {
        username: {
          equals: username,
        },
      },
      limit: 1,
      depth: 0,
    })

    if (usersResult.docs && usersResult.docs.length > 0) {
      return usersResult.docs[0] as User
    }
    return null
  } catch (error) {
    console.error(`Failed to find user by username "${username}":`, error)
    return null
  }
}

/**
 * Server Action for user logout
 * Uses PayloadCMS's built-in logout functionality which handles cookies automatically
 */
export async function logoutUser(): Promise<LogoutResult> {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    // Import the runtime config dynamically to avoid SSR issues
    const { getApiUrl } = await import('@/app/(frontend)/_config/runtime')

    // Use PayloadCMS's REST API for logout since the Local API doesn't have a direct logout method
    // We'll make a POST request to the logout endpoint with the correct basePath
    await fetch(getApiUrl('/api/users/logout'), {
      method: 'POST',
      credentials: 'include',
    })

    console.log('User logged out successfully')

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error) {
    console.error('Logout error:', error)

    return {
      success: false,
      message: 'Failed to log out',
    }
  }
}
