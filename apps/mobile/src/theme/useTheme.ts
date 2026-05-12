import { useThemeStore } from "./themeStore";
import { lightTheme, darkTheme } from "./colors";

export function useTheme() {
    const mode = useThemeStore((s) => s.mode);

    return mode === "dark" ? darkTheme : lightTheme;
}
