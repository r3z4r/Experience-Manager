'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

export interface User {
  id: string
  email: string
  username: string
  roles: string[]
  createdAt: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  hasRole: (role: string) => boolean
  logout: () => void
  userEmail?: string | null
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  hasRole: () => false,
  logout: () => {},
})

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'
        const clientBaseUrl = `${window.location.protocol}//${window.location.host}`
        const apiUrl = `${clientBaseUrl}${basePath}/api/users/me`

        const response = await fetch(apiUrl, {
          credentials: 'include', // Important: include cookies in the request
        })

        if (response.ok) {
          const data = await response.json()
          console.log('User data:', data)

          if (data.user) {
            const userData = {
              id: data.user.id,
              email: data.user.email,
              username: data.user.username,
              roles: data.user.roles || [],
              createdAt: data.user.createdAt,
            }

            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))

            if (userData.username) {
              localStorage.setItem('username', userData.username)
            }

            if (userData.roles && Array.isArray(userData.roles)) {
              localStorage.setItem('userRoles', JSON.stringify(userData.roles))
            }
          } else {
            const storedUser = localStorage.getItem('user')
            if (storedUser) {
              setUser(JSON.parse(storedUser))
            }
          }
        } else {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)

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

    const refreshInterval = setInterval(checkAuth, 30 * 60 * 1000)

    return () => clearInterval(refreshInterval)
  }, [])

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false
    return user.roles.includes(role)
  }

  const logout = async () => {
    const toastId = toast.loading('Logging out...')
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/xpm'
    try {
      const apiUrl = `${basePath}/api/users/logout`

      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        localStorage.removeItem('user')
        localStorage.removeItem('username')
        localStorage.removeItem('userRoles')
        setUser(null)

        toast.success('Logged out successfully', {
          id: toastId,
        })

        setTimeout(() => {
          window.location.href = `${basePath}/login`;
        }, 1000);
      } else {
        localStorage.removeItem('user')
        localStorage.removeItem('username')
        localStorage.removeItem('userRoles')
        setUser(null)

        toast.success('Logged out successfully', {
          id: toastId,
        })

        setTimeout(() => {
          window.location.href = `${basePath}/login`;
        }, 1000);
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

      setTimeout(() => {
        window.location.href = `${basePath}/login`;
      }, 1000);
    }
  }

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, hasRole, logout }}>
      {children}
    </UserContext.Provider>
  )
}
