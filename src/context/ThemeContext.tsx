import React, { createContext, useContext, useState } from "react";
import type { ThemeClassSet } from "../types";
import { themeFactory } from "../utils/styleFactory";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  themeClassSet: ThemeClassSet;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("dark");

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      const root = document.documentElement;
      if (next === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      return next;
    });
  };

  const themeClassSet = themeFactory(theme);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeClassSet }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return ctx;
}

//todo remove theme and themeFactory and use ctx or hook
