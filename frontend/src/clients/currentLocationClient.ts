import * as Location from "expo-location";

async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        alert("Permission denied");
        return null;
    }

    let location = await Location.getCurrentPositionAsync({});
    return location.coords;
}

export async function getNamedLocation(jwtToken: string | null) {
    if (!jwtToken) return;
    const coords = await getCurrentLocation();
    if (!coords) return;

    const response = await fetch("http://localhost:4000/maps/location", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude
        })
    });

    return response.json();
}