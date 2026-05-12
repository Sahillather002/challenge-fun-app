import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark";

interface ThemeState {
    mode: ThemeMode;
    toggleTheme: () => Promise<void>;
    loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    mode: "dark",

    toggleTheme: async () => {
        const newMode = get().mode === "dark" ? "light" : "dark";

        set({ mode: newMode });
        await AsyncStorage.setItem("theme", newMode);
    },

    loadTheme: async () => {
        const saved = await AsyncStorage.getItem("theme");

        if (saved === "light" || saved === "dark") {
            set({ mode: saved });
        }
    },
}));
