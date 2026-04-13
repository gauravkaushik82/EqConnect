import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [retryCountdown, setRetryCountdown] = useState(0)
  const navigate = useNavigate()
  const { login, loading, error, user } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Route based on role
      if (user.role === 'student') {
        navigate('/student/dashboard')
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard')
      } else if (user.role === 'university') {
        navigate('/university/dashboard')
      } else if (user.role === 'admin') {
        navigate('/admin')
      }
    }
  }, [user, navigate])

  // Handle rate limit timer
  useEffect(() => {
    if (error && error.includes('rate limit')) {
      setIsRateLimited(true)
      setRetryCountdown(60)
    }
  }, [error])

  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (retryCountdown === 0 && isRateLimited) {
      setIsRateLimited(false)
    }
  }, [retryCountdown, isRateLimited])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!email || !password) {
      return
    }

    const result = await login(email, password)
    if (!result.success) {
      // Error is already set by useAuth hook
    }
    // On success, useEffect will handle navigation
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your EqConnect account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          {error && (
            <div className={`p-4 rounded-lg text-sm border ${
              isRateLimited
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="font-semibold mb-2 flex items-center gap-2">
                {isRateLimited ? (
                  <>
                    <span>⏱️</span>
                    <span>Too Many Login Attempts</span>
                  </>
                ) : (
                  <>
                    <span>❌</span>
                    <span>Sign In Failed</span>
                  </>
                )}
              </div>
              <p className="mb-3">{error}</p>
              {isRateLimited && (
                <div className="space-y-2">
                  <p className="text-xs opacity-90">
                    💡 <strong>What happened:</strong> Supabase Auth blocked your request to prevent abuse. This is temporary.
                  </p>
                  <p className="text-xs opacity-90">
                    🔄 <strong>How to fix:</strong>
                  </p>
                  <ul className="text-xs opacity-90 list-disc list-inside space-y-1">
                    <li>Try again in <strong>{retryCountdown}</strong> second{retryCountdown !== 1 ? 's' : ''}</li>
                    <li>Or use a different email address to register a new account</li>
                    <li>Or wait and try again later</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || isRateLimited}
            className={`w-full py-2 rounded-lg font-semibold transition-colors ${
              isRateLimited
                ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400'
            }`}
          >
            {loading ? 'Signing in...' : isRateLimited ? `Retry in ${retryCountdown}s` : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <text x="12" y="18">G</text>
            </svg>
            Sign in with Google
          </button>

          {/* DigiLocker OAuth */}
          <button
            type="button"
            className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Purple File/Document */}
              <rect x="20" y="10" width="50" height="60" rx="4" fill="#5B4FD6" />
              {/* White corner fold */}
              <polygon points="70,10 70,30 90,30" fill="white" />
              {/* Cloud shape - outer */}
              <path d="M 32 42 Q 20 42 20 54 Q 20 66 32 66 L 48 66 Q 60 66 60 54 Q 60 42 48 42" fill="white" stroke="#5B4FD6" strokeWidth="3" strokeLinejoin="round"/>
              {/* Keyhole inside cloud */}
              <circle cx="40" cy="52" r="3" fill="#5B4FD6"/>
              <rect x="39" y="55" width="2" height="5" fill="#5B4FD6"/>
            </svg>
            Sign in with DigiLocker
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
