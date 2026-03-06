import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SystemStatus {
  finance: "loading" | "online" | "offline";
  trends: "loading" | "online" | "offline";
}

interface SystemState {
  status: SystemStatus;
  updateStatus: (
    module: keyof SystemStatus,
    state: "online" | "offline",
  ) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  status: {
    finance: "loading",
    trends: "loading",
  },
  updateStatus: (module, nextState) => {
    console.log(`[Store Update] Module: ${module}, State: ${nextState}`); // BU LOG KRİTİK
    set((state) => ({
      status: {
        ...state.status,
        [module]: nextState,
      },
    }));
  },
}));

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "mfe-theme-storage",
    },
  ),
);
