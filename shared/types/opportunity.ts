export type OpportunityType = 'job' | 'internship' | 'hackathon' | 'workshop' | 'research' | 'mentorship'
export type OpportunityStatus = 'active' | 'closed' | 'draft'

export interface Opportunity {
  id: string
  posted_by: string
  type: OpportunityType
  title: string
  description: string | null
  skills_required: string[]
  location: string | null
  is_remote: boolean
  stipend_min: number | null
  stipend_max: number | null
  deadline: string | null
  start_date: string | null
  duration: string | null
  seats_available: number | null
  google_calendar_event_id: string | null
  google_meet_link: string | null
  status: OpportunityStatus
  created_at: string
}

export interface OpportunityWithMatchScore extends Opportunity {
  match_score: number
  company_name?: string
  company_logo?: string
}
