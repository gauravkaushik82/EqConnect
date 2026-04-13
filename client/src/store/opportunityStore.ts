import { create } from 'zustand'
import { OpportunityWithMatchScore } from '../../../shared/types/opportunity'

interface OpportunityFilters {
  type?: string
  location?: string
  skills?: string[]
  salaryMin?: number
  salaryMax?: number
}

interface OpportunityStore {
  opportunities: OpportunityWithMatchScore[]
  filters: OpportunityFilters
  loading: boolean
  error: string | null
  
  // Actions
  setOpportunities: (opps: OpportunityWithMatchScore[]) => void
  setFilters: (filters: OpportunityFilters) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearFilters: () => void
}

export const useOpportunityStore = create<OpportunityStore>((set) => ({
  opportunities: [],
  filters: {},
  loading: false,
  error: null,
  
  setOpportunities: (opportunities) => set({ opportunities, error: null }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearFilters: () => set({ filters: {} }),
}))
