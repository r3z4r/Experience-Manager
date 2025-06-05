'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

// Define the user type
export interface User {
  id: string
  email: string
  username: string
  roles: string[]
  createdAt: string
}

// Define the context type
interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  hasRole: (role: string) => boolean
  logout: () => void
  userEmail?: string | null
}

// Create the context with default values
export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  hasRole: () => false,
  logout: () => {},
})

// Custom hook to use the user context
export const useUser = () => useContext(UserContext)

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated by calling the PayloadCMS /me endpoint
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm';
        const clientBaseUrl = `${window.location.protocol}//${window.location.host}`;
        const apiUrl = `${clientBaseUrl}${basePath}/api/users/me`;

        // Call the /me endpoint to check authentication status with the correct basePath
        const response = await fetch(apiUrl, {
          credentials: 'include', // Important: include cookies in the request
        })

        if (response.ok) {
          const data = await response.json()

          if (data.user) {
            // Store user data in state and localStorage
            const userData = {
              id: data.user.id,
              email: data.user.email,
              username: data.user.username,
              roles: data.user.roles || [],
              createdAt: data.user.createdAt,
            }

            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))

            // Store individual user properties for easier access
            if (userData.username) {
              localStorage.setItem('username', userData.username)
            }

            if (userData.roles && Array.isArray(userData.roles)) {
              localStorage.setItem('userRoles', JSON.stringify(userData.roles))
            }
          } else {
            // No user found, check localStorage as fallback
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
              setUser(JSON.parse(storedUser))
            }
          }
        } else {
          // If API call fails, try to use localStorage as fallback
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)

        // On error, try to use localStorage as fallback
        try {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        } catch (localStorageError) {
          console.error('Error loading user from localStorage:', localStorageError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up an interval to refresh authentication status periodically
    const refreshInterval = setInterval(checkAuth, 30 * 60 * 1000) // Check every 30 minutes

    return () => clearInterval(refreshInterval)
  }, [])

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false
    return user.roles.includes(role)
  }

  // Logout function
  const logout = async () => {
    // Show a toast indicating logout is in progress
    const toastId = toast.loading('Logging out...')

    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm';
      const clientBaseUrl = `${window.location.protocol}//${window.location.host}`;
      const apiUrl = `${clientBaseUrl}${basePath}/api/users/logout`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        // Clear client-side storage
        localStorage.removeItem('user')
        localStorage.removeItem('username')
        localStorage.removeItem('userRoles')

        // Clear user state
        setUser(null)

        // Update the toast to success
        toast.success('Logged out successfully', {
          id: toastId,
        })

        setTimeout(async () => {
          window.location.href = `${basePath}/login`
        }, 1000)
      } else {
        localStorage.removeItem('user')
        localStorage.removeItem('username')
        localStorage.removeItem('userRoles')
        setUser(null)

        toast.success('Logged out successfully', {
          id: toastId,
        })

        setTimeout(async () => {
          window.location.href = `${basePath}/login`
        }, 1000)
      }
    } catch (error) {
      console.error('Error during logout:', error)

      localStorage.removeItem('user')
      localStorage.removeItem('username')
      localStorage.removeItem('userRoles')
      setUser(null)
      toast.success('Logged out successfully', {
        id: toastId,
      })

      setTimeout(async () => {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm';
        window.location.href = `${basePath}/login`
      }, 1000)
    }
  }

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, hasRole, logout }}>
      {children}
    </UserContext.Provider>
  )
}
