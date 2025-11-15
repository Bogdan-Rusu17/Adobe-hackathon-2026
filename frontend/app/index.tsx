import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { connectGoogle } from "../src/clients/googleAuthClient";
import { getNamedLocation } from "../src/clients/currentLocationClient";
import { getJWT } from "../src/storage/authStorage";

export default function Home() {
    const [message, setMessage] = useState("Loading...");
    const [location, setLocation] = useState("");

    useEffect(() => {
        fetch("http://192.168.100.26:4000/health")
            .then((res) => res.json())
            .then((data) => setMessage(JSON.stringify(data)))
            .catch((err) => setMessage("Error: " + err.message));
    }, []);

    async function handleFindLocation() {
        try {
            const token = await getJWT();
            if (!token) {
                setLocation("You are not logged in!");
                return;
            }

            const namedLocation = await getNamedLocation(token);
            setLocation(JSON.stringify(namedLocation));
        } catch (err: any) {
            setLocation("Error: " + err.message);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Backend response:</Text>
            <Text style={styles.response}>{message}</Text>

            <Button title="Connect Google Calendar" onPress={() => connectGoogle()} />

            <View style={{ height: 20 }} />

            <Button title="Find my location" onPress={() => handleFindLocation} />

            <Text style={{ marginTop: 20 }}>{location}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
    title: { fontSize: 20, marginBottom: 20 },
    response: { fontSize: 16, color: "green" },
});
