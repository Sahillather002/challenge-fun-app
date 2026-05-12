import { Platform } from "react-native";

let SecureStore: any;

if (Platform.OS !== "web") {
    SecureStore = require("expo-secure-store");
}

export async function saveItem(key: string, value: string) {
    if (Platform.OS === "web") {
        localStorage.setItem(key, value);
        return;
    }
    return SecureStore.setItemAsync(key, value);
}

export async function getItem(key: string) {
    if (Platform.OS === "web") {
        return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
}

export async function deleteItem(key: string) {
    if (Platform.OS === "web") {
        localStorage.removeItem(key);
        return;
    }
    return SecureStore.deleteItemAsync(key);
}
