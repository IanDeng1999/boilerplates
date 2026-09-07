import { create } from "zustand";

interface AppState {
  appVersion: string;
  fetchAppInfo: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  appVersion: "",
  fetchAppInfo: async () => {
    set({ appVersion: "1.0.0" });
  },
}));
