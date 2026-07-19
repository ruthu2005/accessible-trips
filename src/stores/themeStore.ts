import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark;
          applyTheme(newIsDark);
          return { isDark: newIsDark };
        });
      },
      setTheme: (isDark: boolean) => {
        applyTheme(isDark);
        set({ isDark });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.isDark);
        }
      },
    }
  )
);

function applyTheme(isDark: boolean) {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
