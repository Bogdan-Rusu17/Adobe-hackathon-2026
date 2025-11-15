import * as WebBrowser from "expo-web-browser";

export async function connectGoogle() {
    const backend = "http://localhost:4000";
    // Example: http://192.168.1.22:4000
    await WebBrowser.openBrowserAsync(`${backend}/auth/google`);
}