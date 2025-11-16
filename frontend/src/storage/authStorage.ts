const TOKEN_KEY = "user_jwt";

import * as SecureStore from "expo-secure-store";
import {Platform} from "react-native";

export async function saveJWT(token: string) {
    if (Platform.OS === "web") {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
}

export async function getJWT() {
    if (Platform.OS === "web") {
        return localStorage.getItem(TOKEN_KEY);
    } else {
        return SecureStore.getItemAsync(TOKEN_KEY);
    }
}


export async function removeJWT() {
    if (Platform.OS === "web") {
        return localStorage.removeItem(TOKEN_KEY);
    } else {
        return SecureStore.deleteItemAsync(TOKEN_KEY);
    }
}
