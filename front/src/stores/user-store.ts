import { create } from "zustand";

type User = string;

type UserStore = {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
};


export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    logout: () => set({ user: null })
}));