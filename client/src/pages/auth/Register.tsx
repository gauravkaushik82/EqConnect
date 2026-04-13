import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Register() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [retryCountdown, setRetryCountdown] = useState(0)
  const navigate = useNavigate()
  const { register: registerUser, loading, error, user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student fields
    universityName: '',
    degree: '',
    branch: '',
    year: '',
    urn: '',
    // Recruiter fields
    companyName: '',
    designation: '',
    companySize: '',
    industry: '',
    // University fields
    universityDisplayName: ''
  })

  // Password validation state
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  // Password validation function
  const validatePassword = (pwd: string) => {
    const errors: string[] = []
    
    if (pwd.length < 8) {
      errors.push('At least 8 characters')
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('One uppercase letter')
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('One lowercase letter')
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('One number')
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      errors.push('One special character (!@#$%^&*)')
    }

    return errors
  }

  // Update password errors when password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value
    setFormData(prev => ({
      ...prev,
      password: pwd
    }))
    if (pwd) {
      setPasswordErrors(validatePassword(pwd))
    } else {
      setPasswordErrors([])
    }
  }

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
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

  // Handle rate limit detection
  useEffect(() => {
    if (error && error.includes('rate limit')) {
      setIsRateLimited(true)
      setRetryCountdown(60)
    }
  }, [error])

  // Handle rate limit countdown
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => setRetryCountdown(retryCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (retryCountdown === 0 && isRateLimited) {
      setIsRateLimited(false)
    }
  }, [retryCountdown, isRateLimited])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Handle password separately to show validation
    if (e.target.name === 'password') {
      handlePasswordChange(e as React.ChangeEvent<HTMLInputElement>)
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleNextStep = () => {
    if (step === 1 && !role) {
      return
    }
    if (step === 2) {
      if (!formData.fullName || !formData.email || !formData.password) {
        return
      }
      // Check password strength
      const errors = validatePassword(formData.password)
      if (errors.length > 0) {
        return
      }
      if (formData.password !== formData.confirmPassword) {
        return
      }
    }
    setStep(step + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Build payload based on role
      const payload: any = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: role as 'student' | 'recruiter' | 'university'
      }

      // Add role-specific fields
      if (role === 'student') {
        payload.universityName = formData.universityName
        payload.degree = formData.degree
        payload.branch = formData.branch
        payload.year = formData.year
        payload.urn = formData.urn
      } else if (role === 'recruiter') {
        payload.companyName = formData.companyName
        payload.designation = formData.designation
        payload.companySize = formData.companySize
        payload.industry = formData.industry
      } else if (role === 'university') {
        payload.universityName = formData.universityDisplayName
      }

      const result = await registerUser(payload)
      if (!result.success) {
        // Error is handled by useAuth
      }
      // On success, useEffect will handle navigation
    } catch (err: any) {
      // Error handling
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full mx-1 ${
                  s <= step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {step} of 3
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {step === 1 && 'Choose Your Role'}
            {step === 2 && 'Create Your Account'}
            {step === 3 && role === 'student' && 'Academic Information'}
            {step === 3 && role === 'recruiter' && 'Company Information'}
            {step === 3 && role === 'university' && 'University Information'}
          </h1>

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
                    <span>Too Many Registration Attempts</span>
                  </>
                ) : (
                  <>
                    <span>❌</span>
                    <span>Registration Failed</span>
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
                    <li>Or use a different email address</li>
                    <li>Or wait and try again later</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="grid grid-cols-3 gap-4">
              {['Student', 'University', 'Recruiter'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r.toLowerCase())}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    role === r.toLowerCase()
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {r === 'Student' && '👨‍🎓'}
                    {r === 'University' && '🏫'}
                    {r === 'Recruiter' && '💼'}
                  </div>
                  <p className="font-semibold text-gray-900">{r}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.password && passwordErrors.length === 0
                      ? 'border-green-300 focus:ring-green-600'
                      : formData.password && passwordErrors.length > 0
                      ? 'border-red-300 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-indigo-600'
                  }`}
                  placeholder="••••••••"
                />
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                    <ul className="space-y-1">
                      <li className={`text-xs flex items-center gap-2 ${
                        formData.password.length >= 8 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{formData.password.length >= 8 ? '✓' : '✗'}</span>
                        At least 8 characters
                      </li>
                      <li className={`text-xs flex items-center gap-2 ${
                        /[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{/[A-Z]/.test(formData.password) ? '✓' : '✗'}</span>
                        One uppercase letter (A-Z)
                      </li>
                      <li className={`text-xs flex items-center gap-2 ${
                        /[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{/[a-z]/.test(formData.password) ? '✓' : '✗'}</span>
                        One lowercase letter (a-z)
                      </li>
                      <li className={`text-xs flex items-center gap-2 ${
                        /[0-9]/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{/[0-9]/.test(formData.password) ? '✓' : '✗'}</span>
                        One number (0-9)
                      </li>
                      <li className={`text-xs flex items-center gap-2 ${
                        /[!@#$%^&*]/.test(formData.password) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{/[!@#$%^&*]/.test(formData.password) ? '✓' : '✗'}</span>
                        One special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-300 focus:ring-green-600'
                      : formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-indigo-600'
                  }`}
                  placeholder="••••••••"
                />
                
                {/* Confirm Password Feedback */}
                {formData.confirmPassword && (
                  <p className={`text-xs mt-2 ${
                    formData.password === formData.confirmPassword
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {formData.password === formData.confirmPassword
                      ? '✓ Passwords match'
                      : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Role-Specific Info */}
          {step === 3 && role === 'student' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Name
                </label>
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="e.g., IIT Delhi"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree
                  </label>
                  <select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Select degree</option>
                    <option value="btech">B.Tech</option>
                    <option value="mtech">M.Tech</option>
                    <option value="bsc">B.Sc</option>
                    <option value="msc">M.Sc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="e.g., CSE"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Study
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Roll Number (URN)
                </label>
                <input
                  type="text"
                  name="urn"
                  value={formData.urn}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="e.g., 2021CS1001"
                />
              </div>
            </div>
          )}

          {/* Step 3: Recruiter Info */}
          {step === 3 && role === 'recruiter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="e.g., TCS"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="e.g., HR Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Select size</option>
                    <option value="startup">Startup (1-50)</option>
                    <option value="small">Small (51-200)</option>
                    <option value="medium">Medium (201-1000)</option>
                    <option value="large">Large (1000+)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="e.g., Technology"
                />
              </div>
            </div>
          )}

          {/* Step 3: University Info */}
          {step === 3 && role === 'university' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University Name
                </label>
                <input
                  type="text"
                  name="universityDisplayName"
                  value={formData.universityDisplayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="e.g., IIT Delhi"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  As a university admin, you'll be able to verify student credentials and manage enrollment data.
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                disabled={step === 2 && (
                  !formData.fullName || 
                  !formData.email || 
                  !formData.password ||
                  !formData.confirmPassword ||
                  passwordErrors.length > 0 ||
                  formData.password !== formData.confirmPassword
                )}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  step === 2 && (
                    !formData.fullName || 
                    !formData.email || 
                    !formData.password ||
                    !formData.confirmPassword ||
                    passwordErrors.length > 0 ||
                    formData.password !== formData.confirmPassword
                  )
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || isRateLimited}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  isRateLimited
                    ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400'
                }`}
              >
                {loading ? 'Creating Account...' : isRateLimited ? `Retry in ${retryCountdown}s` : 'Create Account'}
              </button>
            )}
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
