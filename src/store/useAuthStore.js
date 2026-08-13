import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
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
