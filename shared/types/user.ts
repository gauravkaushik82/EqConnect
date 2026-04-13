// User Types
export type UserRole = 'student' | 'university' | 'recruiter' | 'admin'
export type VerificationStatus = 'verified' | 'partial' | 'unverified'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  avatar_url: string | null
  verification_status: VerificationStatus
  verification_score: number
  google_id: string | null
  github_id: string | null
  github_username: string | null
  github_avatar_url: string | null
  github_connected_at: string | null
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  user_id: string
  university: string | null
  university_id: string | null
  degree: string | null
  branch: string | null
  year_of_study: number | null
  cgpa: number | null
  urn: string | null
  bio: string | null
  github_url: string | null
  linkedin_url: string | null
  leetcode_url: string | null
  portfolio_url: string | null
  skills: string[]
  certifications: Certification[]
  show_college: boolean
  location: string | null
  resume_url: string | null
}

export interface Certification {
  name: string
  issuer: string
  url: string | null
  verified_at: string | null
}

export interface UniversityProfile {
  id: string
  user_id: string
  institution_name: string
  city: string | null
  state: string | null
  naac_grade: string | null
  total_students: number | null
  placement_officer_name: string | null
  website_url: string | null
  logo_url: string | null
  verified: boolean
}

export interface RecruiterProfile {
  id: string
  user_id: string
  company_name: string
  cin: string | null
  gst_number: string | null
  company_size: string | null
  industry: string | null
  website_url: string | null
  logo_url: string | null
  location: string | null
  verified: boolean
  trust_score: number
}
