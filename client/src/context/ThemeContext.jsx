import { createContext, useContext, useEffect } from "react";

const THEME_KEY = "gapshap_theme";
const ThemeContext = createContext({ darkMode: true });

const getPreferredTheme = () => {
  if (typeof window === "undefined") return true;

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme === "dark";
    }
  } catch (error) {
    // Ignore localStorage access issues and fall back to system preference.
  }

  return window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : true;
};

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const applyTheme = (isDark) => {
      const root = document.documentElement;
      root.classList.toggle("dark", isDark);
      root.classList.toggle("light", !isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
      root.style.backgroundColor = isDark ? "#120f0d" : "#fffaf7";

      try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (!savedTheme || savedTheme === "dark" || savedTheme === "light") {
          localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
        }
      } catch (error) {
        // Ignore storage errors; the browser theme is still applied.
      }
    };

    applyTheme(getPreferredTheme());

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (event) => {
        try {
          const savedTheme = localStorage.getItem(THEME_KEY);
          if (!savedTheme) {
            applyTheme(event.matches);
          }
        } catch (error) {
          applyTheme(event.matches);
        }
      };

      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }

      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
