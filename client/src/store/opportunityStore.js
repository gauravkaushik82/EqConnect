import { create } from 'zustand';
export const useOpportunityStore = create((set) => ({
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
}));
