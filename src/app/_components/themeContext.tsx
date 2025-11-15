"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "dark" | "noxus" | "none"; // added "none"

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  // Only apply a class if theme is not "none"
  const themeClass = theme === "none" ? "" : `${theme}`;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={themeClass}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
