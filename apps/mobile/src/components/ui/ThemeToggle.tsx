import React from "react";
import { Switch } from "react-native";
import { useThemeStore } from "@/theme/themeStore";

export function ThemeToggle() {
    const mode = useThemeStore((s) => s.mode);
    const toggle = useThemeStore((s) => s.toggleTheme);

    return <Switch value={mode === "dark"} onValueChange={toggle} />;
}
