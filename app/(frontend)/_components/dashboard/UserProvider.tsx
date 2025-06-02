// UserProvider.tsx
'use client'
import { createContext, useContext, useState, useEffect, useTransition, type ReactNode } from 'react'
import { toast } from 'sonner'
import { logoutUser } from '@/app/(frontend)/_actions/auth'
import { UserContext, User } from './UserContext'

interface UserProviderProps {
  initialUserEmail?: string | null
  children: ReactNode
}

export default function UserProvider({ initialUserEmail = null, children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(initialUserEmail)

  useEffect(() => {
    // Try to load user data from client-side storage
    const loadUserData = () => {
      try {
        // Check localStorage first
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setUserEmail(parsedUser.email)
          setIsLoading(false)
          return
        }

        // If not in localStorage, check cookies
        const userDataCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user-data='))
        
        if (userDataCookie) {
          try {
            const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]))
            setUser(userData)
            setUserEmail(userData.email)
          } catch (error) {
            console.error('Error parsing user data from cookie:', error)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only run on client-side
    if (typeof window !== 'undefined') {
      loadUserData()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false
    return user.roles.includes(role)
  }

  // Logout function
  const [isPendingLogout, startLogoutTransition] = useTransition()

  const logout = async () => {
    try {
      // Show loading toast
      const toastId = toast.loading('Logging out...')

      startLogoutTransition(async () => {
        try {
          // Call the server action to handle logout
          const result = await logoutUser()

          if (result.success) {
            // Clear local storage
            localStorage.removeItem('user')

            // Update state
            setUser(null)

            // Show success toast
            toast.success('Logged out successfully', {
              id: toastId,
            })

            // Redirect to login page
            window.location.href = '/login'
          } else {
            throw new Error(result.message || 'Failed to log out')
          }
        } catch (error) {
          console.error('Logout error:', error)
          toast.error('Failed to log out', {
            id: toastId,
          })
        }
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        userEmail,
        isLoading,
        hasRole,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
