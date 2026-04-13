import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3001'

/**
 * Custom hook for authentication state and operations
 */
export const useAuth = () => {
  const { user, loading, error, setUser, setLoading, setError, logout } = useAuthStore()
  
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        setLoading(true)
        try {
          const response = await fetch(`${API_BASE}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            throw new Error('Unauthorized')
          }

          const data = await response.json()
          setUser(data.user)
        } catch (err: any) {
          setError('Failed to verify authentication')
          localStorage.removeItem('auth_token')
        } finally {
          setLoading(false)
        }
      }
    }
    
    checkAuth()
  }, [])

  // Register function
  const register = async (payload: {
    email: string
    password: string
    fullName: string
    role: 'student' | 'recruiter' | 'university'
    universityName?: string
    degree?: string
    branch?: string
    year?: string
    urn?: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Registration failed')
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.token)
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Login failed')
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.token)
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err: any) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    logout()
  }
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    setUser,
    setLoading,
    setError,
    register,
    login,
    logout: handleLogout,
  }
}
