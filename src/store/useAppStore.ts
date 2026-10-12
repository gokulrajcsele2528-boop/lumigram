import { create } from "zustand";

export interface CurrentUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
  bio?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

interface AppState {
  user: CurrentUser;
  unreadMessages: number;
  unreadNotifications: number;
  isCreateOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setUnreadMessages: (count: number) => void;
  setUnreadNotifications: (count: number) => void;
  setUser: (user: CurrentUser) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: "u1",
    username: "alex.traveler",
    fullName: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    bio: "Visual storyteller & alpine traveler 🏔️✨ Living between summits and stories.",
    followersCount: 24800,
    followingCount: 412,
    postsCount: 54,
  },
  unreadMessages: 5,
  unreadNotifications: 3,
  isCreateOpen: false,
  openCreateModal: () => set({ isCreateOpen: true }),
  closeCreateModal: () => set({ isCreateOpen: false }),
  setUnreadMessages: (count: number) => set({ unreadMessages: count }),
  setUnreadNotifications: (count: number) => set({ unreadNotifications: count }),
  setUser: (user: CurrentUser) => set({ user }),
}));
