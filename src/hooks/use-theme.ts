"use client";

import { useAppContext } from "@/features/app/app-context";

export function useTheme() {
  const { theme, setTheme } = useAppContext();

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
}
