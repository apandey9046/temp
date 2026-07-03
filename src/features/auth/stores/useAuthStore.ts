import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setSession: (session: any | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      signOut: () => set({ user: null, session: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
