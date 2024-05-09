import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type User = {
  email: string;
  accessToken: string;
  refreshToken: string;
};

type UserStore = {
  user?: User;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user: User) => set({ user }),
      logout: () => set({ user: undefined }),
    }),
    { name: "user-storage", storage: createJSONStorage(() => localStorage) }
  )
);
