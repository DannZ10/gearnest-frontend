import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,
      setAuth: (user, token, role) =>
        set({
          user,
          token,
          role,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          role: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'gearnest-auth-store',
    }
  )
);
