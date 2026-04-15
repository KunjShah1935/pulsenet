import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    console.log("Theme changed:", dark); // ✅ debug

    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  const toggle = () => {
    setDark((prev) => !prev); // ✅ important
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};