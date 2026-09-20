import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  isDarkMode: boolean;
  setDarkMode: (isDarkMode: boolean) => void;
};

/** Shared application state. Add domain-specific slices as the app grows. */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      setDarkMode: (isDarkMode) => {
        document.documentElement.classList.toggle(
          "ion-palette-dark",
          isDarkMode,
        );
        set({ isDarkMode });
      },
    }),
    {
      name: "app-store",
    },
  ),
);
