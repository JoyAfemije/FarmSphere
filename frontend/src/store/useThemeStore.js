import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const newDark = !get().isDark;
        set({ isDark: newDark });
        // Apply to <html> element for Tailwind's `dark:` classes
        document.documentElement.classList.toggle("dark", newDark);
      },

      initTheme: () => {
        // Apply theme on app mount based on stored preference
        document.documentElement.classList.toggle("dark", get().isDark);
      },
    }),
    { name: "agrotech_theme" }
  )
);

export default useThemeStore;
