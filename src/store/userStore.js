import { create } from 'zustand';
import { apiClient } from '@/lib/api/apiClient';

export const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  // Hydrate store from the backend using HttpOnly cookie (which is sent automatically via apiClient)
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient('/auth/me'); 
      set({ user: response.data || response, isLoading: false });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  clearUser: () => set({ user: null })
}));
