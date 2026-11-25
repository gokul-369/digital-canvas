import React, { createContext, useContext, useEffect, useState } from "react";
import type { ThemeClassSet } from "../types";
import { themeFactory } from "../utils/styleFactory";

type Theme = "light" | "dark";

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
  themeClassSet: ThemeClassSet;

  isCollaborateOpen: boolean;
  openCollaborate: () => void;
  closeCollaborate: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "dark";
  });
  const [isCollaborateOpen, setIsCollaborateOpen] = useState(false);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.backgroundColor = isDark ? "#030407" : "#f8fafc";
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        themeClassSet: themeFactory(theme),
        isCollaborateOpen,
        openCollaborate: () => setIsCollaborateOpen(true),
        closeCollaborate: () => setIsCollaborateOpen(false),
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
}
