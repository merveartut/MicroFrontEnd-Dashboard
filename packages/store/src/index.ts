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

const createSystemStore = () =>
  create<SystemState>((set) => ({
    status: { finance: "loading", trends: "loading" },
    updateStatus: (module, nextState) => {
      console.log(`[Store Update] Module: ${module}, State: ${nextState}`);
      set((state) => ({
        status: { ...state.status, [module]: nextState },
      }));
    },
  }));

const getSharedStore = () => {
  const globalGui = window as any;
  if (!globalGui.__MFE_SYSTEM_STORE__) {
    globalGui.__MFE_SYSTEM_STORE__ = createSystemStore();
  }
  return globalGui.__MFE_SYSTEM_STORE__;
};

export const useSystemStore = getSharedStore();

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
