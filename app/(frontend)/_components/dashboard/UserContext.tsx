'use client'
import { createContext, useContext, useEffect, useState } from 'react'

// Define the enhanced user type with all properties
export interface User {
  id: string
  email: string
  username: string
  roles: string[]
  createdAt: string
}

// Define the context value type
export interface UserContextValue {
  user: User | null
  userEmail: string | null
  isLoading: boolean
  hasRole: (role: string) => boolean
  logout: () => Promise<void>
}

// Create context with default values
export const UserContext = createContext<UserContextValue>({
  user: null,
  userEmail: null,
  isLoading: true,
  hasRole: () => false,
  logout: async () => {}
})

// Custom hook to use the user context
export const useUser = () => useContext(UserContext)
