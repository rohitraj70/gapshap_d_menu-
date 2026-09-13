import { createContext, useContext, useEffect } from "react";

const THEME_KEY = "gapshap_theme";
const ThemeContext = createContext({ darkMode: true });

const getPreferredTheme = () => true;

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const applyTheme = (isDark) => {
      const root = document.documentElement;
      root.classList.toggle("dark", isDark);
      root.classList.toggle("light", !isDark);
      root.style.colorScheme = isDark ? "dark" : "light";
      root.style.backgroundColor = isDark ? "#120f0d" : "#fffaf7";

      try {
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
      } catch (error) {
        // Ignore storage errors; the browser theme is still applied.
      }
    };

    applyTheme(getPreferredTheme());
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
