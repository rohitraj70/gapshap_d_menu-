import { createContext, useContext, useEffect } from "react";

const THEME_KEY = "gapshap_theme";
const ThemeContext = createContext({ darkMode: true });

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      const isDark = savedTheme ? savedTheme === "dark" : true;
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch (error) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
