import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { saveJWT } from "../storage/authStorage";
import {Platform} from "react-native";

export async function connectGoogle() {
    const backend = "https://timy-calendar-b3e8cdgtapccazbd.polandcentral-01.azurewebsites.net/";
    const redirectUri = Linking.createURL("auth/callback");

    if (Platform.OS === "web") {
        window.location.href =
            `${backend}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
        return;
    }

    // Native → keep popup
    const result = await WebBrowser.openAuthSessionAsync(
        `${backend}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`,
        redirectUri
    );

    if (result.type === "success") {
        const params = new URL(result.url).searchParams;
        const token = params.get("token");
        if (token) await saveJWT(token);
    }
}

