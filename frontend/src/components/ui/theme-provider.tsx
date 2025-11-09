import { type ReactNode, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: "class" | "data-theme"; // How to apply theme, default "class"
  defaultTheme?: string; // e.g., "system" | "light" | "dark"
}

const themes = ["light", "dark"];

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return defaultTheme;

    const stored = localStorage.getItem("theme");
    if (stored && themes.includes(stored)) return stored;

    if (defaultTheme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes or attributes
    themes.forEach((t) => {
      if (attribute === "class") {
        root.classList.remove(t);
      } else {
        root.removeAttribute(attribute);
      }
    });

    // Apply current theme
    if (attribute === "class") {
      root.classList.add(theme);
    } else {
      root.setAttribute(attribute, theme);
    }

    localStorage.setItem("theme", theme);
  }, [theme, attribute]);

  // Theme toggle function
  function setNextTheme() {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme: setNextTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

import { createContext, useContext } from "react";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
