"use client";

import {
  useContext,
  createContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from "react";

export type TTheme = "dark" | "light" | undefined;

type TThemeContext = {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
};

const ThemeContext = createContext<TThemeContext | undefined>(undefined);

type TThemeProvider = {
  children: ReactNode;
};
export const ThemeProvider: FC<TThemeProvider> = ({ children }) => {
  const [theme, setTheme] = useState<"dark" | "light" | undefined>(undefined);

  const handleThemeChange = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
