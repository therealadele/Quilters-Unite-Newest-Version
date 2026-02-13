import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "default" | "night" | "bright" | "pastel";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "default",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const ALL_THEME_CLASSES = ["dark", "theme-bright", "theme-pastel"];

export function ThemeProvider({
  children,
  defaultTheme = "default",
  storageKey = "quilthub-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "system") return "default";
    if (stored === "dark") return "night";
    return (stored as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(...ALL_THEME_CLASSES);

    switch (theme) {
      case "night":
        root.classList.add("dark");
        break;
      case "bright":
        root.classList.add("theme-bright");
        break;
      case "pastel":
        root.classList.add("theme-pastel");
        break;
      case "default":
      default:
        break;
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
