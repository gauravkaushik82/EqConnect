export type ApplicationStatus = 'applied' | 'shortlisted' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'

export interface Application {
  id: string
  opportunity_id: string
  student_id: string
  status: ApplicationStatus
  match_score: number | null
  cover_note: string | null
  applied_at: string
  updated_at: string
}
