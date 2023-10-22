"use client";

import {
  useContext,
  createContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from "react";

type TTheme = "dark" | "light" | undefined;

type TThemeContext = {
  theme: "dark" | "light" | undefined;
  setTheme: (theme: TTheme) => void;
};

const ThemeContext = createContext<TThemeContext | undefined>(undefined);

type TThemeProvider = {
  children: ReactNode;
};
export const ThemeProvider: FC<TThemeProvider> = ({ children }) => {
  const [theme, setTheme] = useState<"dark" | "light" | undefined>(undefined);

  const handleThemeChange = (theme: TTheme) => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("light");
    }
  };

  useEffect(() => {
    handleThemeChange(theme);
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
