import { createContext, useContext, useEffect } from "react";

const THEME_KEY = "gapshap_theme";
const ThemeContext = createContext({ darkMode: true });

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const applyDarkTheme = () => {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
      document.documentElement.style.backgroundColor = "#120f0d";

      try {
        localStorage.setItem(THEME_KEY, "dark");
      } catch (error) {
        // Ignore storage errors and keep the dark theme applied.
      }
    };

    applyDarkTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
