"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeMode = "dark" | "light";

type AppContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  compareIds: string[];
  toggleCompare: (collegeId: string) => void;
  clearCompare: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const THEME_STORAGE_KEY = "collegecompass-theme";
const COMPARE_STORAGE_KEY = "collegecompass-compare";

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "dark" || storedTheme === "light" ? storedTheme : "dark";
}

function getStoredCompareIds(): string[] {
  if (typeof window === "undefined") return [];

  const storedCompare = window.localStorage.getItem(COMPARE_STORAGE_KEY);
  if (!storedCompare) return [];

  try {
    const parsed = JSON.parse(storedCompare);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string").slice(0, 3)
      : [];
  } catch {
    window.localStorage.removeItem(COMPARE_STORAGE_KEY);
    return [];
  }
}

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getStoredTheme);
  const [compareIds, setCompareIds] = useState<string[]>(getStoredCompareIds);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }, []);

  const toggleCompare = useCallback((collegeId: string) => {
    setCompareIds((current) => {
      const next = current.includes(collegeId)
        ? current.filter((id) => id !== collegeId)
        : [...current, collegeId].slice(0, 3);

      window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    window.localStorage.removeItem(COMPARE_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, compareIds, toggleCompare, clearCompare }),
    [theme, setTheme, compareIds, toggleCompare, clearCompare]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider");
  }

  return context;
}
