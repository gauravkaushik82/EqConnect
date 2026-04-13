import { z } from 'zod'

// Auth validation schemas
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).optional(),
  full_name: z.string().min(2).optional(),
  role: z.enum(['student', 'university', 'recruiter', 'super_admin']),
}).refine(
  (data) => data.fullName || data.full_name,
  { message: "Either 'fullName' or 'full_name' is required" }
)

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Opportunity validation
export const CreateOpportunitySchema = z.object({
  type: z.enum(['job', 'internship', 'hackathon', 'workshop', 'research', 'mentorship']),
  title: z.string().min(5),
  description: z.string().optional(),
  skills_required: z.array(z.string()).optional(),
  location: z.string().optional(),
  is_remote: z.boolean().optional(),
  stipend_min: z.number().optional(),
  stipend_max: z.number().optional(),
  deadline: z.string().optional(),
  start_date: z.string().optional(),
  duration: z.string().optional(),
  seats_available: z.number().optional(),
})

// Application validation
export const CreateApplicationSchema = z.object({
  opportunity_id: z.string().uuid(),
  cover_note: z.string().optional(),
})
