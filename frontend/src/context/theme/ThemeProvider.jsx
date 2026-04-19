import { useState, useEffect, useCallback } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("system");

    const applyTheme = useCallback((themeValue) => {
        const root = document.documentElement;

        const resolved =
            themeValue === "system"
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                : themeValue;

        root.classList.remove("light", "dark");
        root.classList.add(resolved);
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
