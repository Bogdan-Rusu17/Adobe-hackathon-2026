import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import Timy from "../assets/Timy";
import GoogleButton from "../components/GoogleButton";

const { width: W, height: H } = Dimensions.get("window");

// much larger so the arc looks soft & wide, just like in the screenshot
const CIRCLE_SIZE = W * 4.2;

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.container}>

            {/* cream top */}
            <View style={styles.topSection}>
                <Timy width={180} height={180} />
            </View>

            {/* blue bottom */}
            <View style={styles.bottomSection}>
                <View style={styles.circle} />

                <View style={styles.textContainer}>
                    <Text style={styles.title}>Timy here!</Text>
                    <Text style={styles.subtitle}>Your schedule{"\n"}buddy.</Text>
                </View>

                <GoogleButton style={styles.button} />
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8EA",
    },

    topSection: {
        height: H * 0.38,      // matches the “big cream top area”
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "#FFF8EA",
        paddingBottom: 10,
    },

    bottomSection: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#7AA6D9",  // closer to screenshot blue
        overflow: "hidden",
    },

    circle: {
        position: "absolute",
        top: -CIRCLE_SIZE * 0.62,  // lower the arc to match screenshot
        left: (W - CIRCLE_SIZE) / 2,
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        backgroundColor: "#7AA6D9",
        borderRadius: CIRCLE_SIZE / 2,
    },

    textContainer: {
        marginTop: H * 0.11, // positions text exactly like screenshot
        alignItems: "center",
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
    },

    subtitle: {
        fontSize: 28,
        fontWeight: "500",
        color: "#FFFFFF",
        marginTop: 5,
        textAlign: "center",
        lineHeight: 35,
    },

    button: {
        marginTop: H * 0.15,
    },
});
