import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { useRouter } from 'expo-router';
import Timy from "../src/assets/Timy.png";
import GoogleButton from "../components/GoogleButton";

export default function Index() {
    const router = useRouter();
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    useEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setDimensions(window);
        });

        return () => subscription?.remove();
    }, []);

    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch("https://timy-calendar-b3e8cdgtapccazbd.polandcentral-01.azurewebsites.net/health")
            .then((res) => res.json())
            .then((data) => setMessage(JSON.stringify(data)))
            .catch((err) => setMessage("Error: " + err.message));
    }, []);

    const { width: W, height: H } = dimensions;

    const scale = (size: number, maxSize: number) => Math.min(W * size, maxSize);

    const clampedScale = (size: number, min: number, max: number) => {
        const scaled = W * size;
        return Math.max(min, Math.min(scaled, max));
    };

    const handleLoginSuccess = () => {
        router.replace('/home');
    };

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <Text>{message}</Text>
                <Image
                    source={Timy}
                    style={{
                        width: clampedScale(0.43, 150, 250),
                        height: clampedScale(0.32, 200, 300),
                        resizeMode: "contain",
                        marginBottom: clampedScale(-0.10, -120, -60),
                        zIndex: 10,
                    }}
                />
            </View>

            <View style={[
                styles.bottomSection,
                { borderTopLeftRadius: scale(1000, 600) }
            ]}>
                <View style={[
                    styles.contentContainer,
                    { maxWidth: scale(1, 600) }
                ]}>
                    <Text
                        style={{
                            fontSize: clampedScale(0.097, 32, 52),
                            lineHeight: clampedScale(0.115, 38, 62),
                            fontWeight: "700",
                            color: "#FFFFFF",
                            textAlign: "center",
                            fontFamily: "HankenGrotesk-Bold",
                        }}
                    >
                        Timy here!{"\n"}
                        Your schedule buddy.
                    </Text>

                    <View style={{
                        marginTop: clampedScale(0.1, 40, 80),
                        width: "100%",
                        maxWidth: 400
                    }}>
                        <GoogleButton onSuccess={handleLoginSuccess} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8EA",
    },

    topSection: {
        flex: 1,
        backgroundColor: "#FFF8EA",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 0,
        zIndex: 10,
    },

    bottomSection: {
        flex: 1.5,
        backgroundColor: "#7AA6D9",
        borderTopRightRadius: 1000,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "15%",
        paddingHorizontal: "10%",
        zIndex: 1,
    },

    contentContainer: {
        width: "100%",
        alignItems: "center",
    },
});