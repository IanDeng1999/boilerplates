import { create } from "zustand";
import { persist } from "zustand/middleware";
import { appStoreKey } from "./const";
import type { AppState } from "./types";

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
      name: appStoreKey,
    },
  ),
);
