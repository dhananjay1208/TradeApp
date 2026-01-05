import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, DashboardStats, DailySession } from "@/types";

interface AppState {
  // User Profile
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;

  // Dashboard stats
  stats: DashboardStats | null;
  setStats: (stats: DashboardStats | null) => void;

  // Today's session
  todaySession: DailySession | null;
  setTodaySession: (session: DailySession | null) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Today's ritual completion
  ritualCompleted: boolean;
  setRitualCompleted: (completed: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User Profile
      profile: null,
      setProfile: (profile) => set({ profile }),

      // Dashboard stats
      stats: null,
      setStats: (stats) => set({ stats }),

      // Today's session
      todaySession: null,
      setTodaySession: (todaySession) => set({ todaySession }),

      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      // Loading states
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),

      // Ritual
      ritualCompleted: false,
      setRitualCompleted: (ritualCompleted) => set({ ritualCompleted }),
    }),
    {
      name: "trademind-storage",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
