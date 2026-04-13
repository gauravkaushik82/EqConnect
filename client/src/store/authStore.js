// Zustand store for authentication
import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    setUser: (user) => {
        set({
            user,
            isAuthenticated: !!user,
            error: null,
        });
    },
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    logout: () => {
        set({
            user: null,
            isAuthenticated: false,
            error: null,
        });
    },
}));
