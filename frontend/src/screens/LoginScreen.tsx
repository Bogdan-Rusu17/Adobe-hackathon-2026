import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import Timy from "../assets/Timy.png";
import GoogleButton from "../components/GoogleButton";

export default function LoginScreen() {
    const [dimensions, setDimensions] = useState(Dimensions.get("window"));

    useEffect(() => {
        const subscription = Dimensions.addEventListener("change", ({ window }) => {
            setDimensions(window);
        });

        return () => subscription?.remove();
    }, []);

    const { width: W, height: H } = dimensions;

    return (
        <View style={styles.container}>
            {/* Partea de sus - Background bej cu bufnița */}
            <View style={styles.topSection}>
                <Image
                    source={Timy}
                    style={{
                        width: W * 0.43,
                        height: H * 0.32,
                        resizeMode: "contain",
                        marginBottom: -(H * 0.10), // Suprapune bufnița peste cerc
                        zIndex: 10, // Z-index mare ca să fie deasupra cercului
                    }}
                />
            </View>

            <View style={styles.bottomSection}>
                <View style={styles.contentContainer}>
                    <Text
                        style={{
                            fontSize: W * 0.097,
                            lineHeight: W * 0.115,
                            fontWeight: "700",
                            color: "#FFFFFF",
                            textAlign: "center",
                            fontFamily: "HankenGrotesk-Bold",
                        }}
                    >
                        Timy here!{"\n"}
                        Your schedule buddy.
                    </Text>

                    <View style={{ marginTop: H * 0.1, width: "100%", maxWidth: 400}}>
                        <GoogleButton />
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
        zIndex: 10, // Z-index mare pentru top section cu bufnița
    },

    bottomSection: {
        flex: 1.5,
        backgroundColor: "#7AA6D9",
        borderTopLeftRadius: 1000,
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