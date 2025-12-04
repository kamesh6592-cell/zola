// app/providers/user-provider.tsx
"use client"

import {
  fetchUserProfile,
  signOutUser,
  subscribeToUserUpdates,
  updateUserProfile,
} from "@/lib/user-store/api"
import type { UserProfile } from "@/lib/user/types"
import { createContext, useContext, useEffect, useState } from "react"

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: UserProfile | null
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  const refreshUser = async () => {
    setIsLoading(true)
    try {
      // Try to fetch user profile from the server
      const response = await fetch('/api/user-profile')
      if (response.ok) {
        const userData = await response.json()
        if (userData && userData.id) {
          setUser(userData)
          return
        }
      }
      
      // Fallback: if user exists but no profile, keep current user or clear
      if (!user?.id) {
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const success = await updateUserProfile(user.id, updates)
      if (success) {
        setUser((prev) => (prev ? { ...prev, ...updates } : null))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const success = await signOutUser()
      if (success) setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Check for authentication state changes on mount and URL changes
  useEffect(() => {
    // Check if we're coming back from auth callback
    const urlParams = new URLSearchParams(window.location.search)
    const authSuccess = urlParams.get('auth')
    
    if (authSuccess === 'success') {
      // Clear the URL parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('auth')
      window.history.replaceState({}, '', newUrl.toString())
      
      // Force refresh user data
      setTimeout(() => {
        refreshUser()
      }, 100)
      return
    }
    
    // If no initial user, try to refresh to check for authenticated session
    if (!initialUser) {
      refreshUser()
    }

    // Listen for focus events (when user returns from OAuth)
    const handleFocus = () => {
      // Small delay to ensure cookies are set
      setTimeout(() => {
        refreshUser()
      }, 100)
    }

    // Listen for auth state changes (when user logs in/out)
    const handleAuthChange = () => {
      setTimeout(() => {
        refreshUser()
      }, 500)
    }

    // Listen for storage events (when auth state changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' || e.key?.includes('supabase.auth')) {
        handleAuthChange()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('pageshow', handleAuthChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('pageshow', handleAuthChange)
    }
  }, []) // Run only on mount

  // Set up realtime subscription for user data changes
  useEffect(() => {
    if (!user?.id) return

    const unsubscribe = subscribeToUserUpdates(user.id, (newData) => {
      setUser((prev) => (prev ? { ...prev, ...newData } : null))
    })

    return () => {
      unsubscribe()
    }
  }, [user?.id])

  return (
    <UserContext.Provider
      value={{ user, isLoading, updateUser, refreshUser, signOut }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
