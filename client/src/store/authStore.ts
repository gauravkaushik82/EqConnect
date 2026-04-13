// Zustand store for authentication
import { create } from 'zustand'
import { User } from '../../../shared/types/user'

interface AuthStore {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  
  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    })
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    })
  },
}))
