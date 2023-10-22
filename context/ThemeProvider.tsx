"use client";

import {
  useContext,
  createContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useCallback,
} from "react";

type TTheme = "dark" | "light";

type TThemeContext = {
  theme: "dark" | "light";
  setTheme: (theme: TTheme) => void;
};

const ThemeContext = createContext<TThemeContext | undefined>(undefined);

type TThemeProvider = {
  children: ReactNode;
};
export const ThemeProvider: FC<TThemeProvider> = ({ children }) => {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  const handleThemeChange = useCallback((theme: TTheme) => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.add("light");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    handleThemeChange(theme);
  }, []);

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
