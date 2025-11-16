import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function ChatScreen() {
    const router = useRouter();
    const [message, setMessage] = useState("");

    return (
        <View style={styles.container}>
            {/* ===== HEADER ===== */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.canGoBack() ? router.back() : router.push("/")}
                >
                    <Text style={{ fontSize: 22 }}>←</Text>
                </TouchableOpacity>

                <Text style={styles.headerText}>Chat</Text>

                <TouchableOpacity style={styles.menuButton}>
                    <Text style={{ fontSize: 22 }}>⋮</Text>
                </TouchableOpacity>
            </View>

            {/* ===== AVATAR ===== */}
            <View style={styles.avatarWrap}>
                <Image
                    source={require("../src/assets/TimyChat.png")}
                    style={styles.avatar}
                />
            </View>

            {/* ===== CHAT CONTENT ===== */}
            <ScrollView
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ===== AI MESSAGE ===== */}
                <View style={styles.aiBubble}>
                    <Text style={styles.aiText}>
                        Hi! I'm Timy, your AI assistant. How can I help you today?
                    </Text>
                </View>
            </ScrollView>

            {/* ===== INPUT BAR ===== */}
            <View style={styles.inputBar}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Check schedule for ... "
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                />

                <TouchableOpacity style={styles.sendButton}>
                    <Text style={{ color: "white", fontSize: 20 }}>➤</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


/* ======================================================= */
/* ======================  STYLES  ======================== */
/* ======================================================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8EA",
    },

    /* ===== HEADER ===== */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 10,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#DDE3F0",
        alignItems: "center",
        justifyContent: "center",
    },
    menuButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#DDE3F0",
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "600",
        color: "#2C3355",
    },

    /* ===== AVATAR ===== */
    avatarWrap: {
        alignItems: "center",
        marginTop: 18,
        marginBottom: 12,
    },
    avatar: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        borderRadius: 60,
    },

    /* ===== CHAT AREA ===== */
    chatContent: {
        paddingHorizontal: 18,
        paddingTop: 6,
        paddingBottom: 40,
    },

    /* ===== AI BUBBLE ===== */
    aiBubble: {
        backgroundColor: "white",
        padding: 20,

        // ROUNDED but left-bottom is straight
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        borderBottomLeftRadius: 0,

        maxWidth: "85%",

        // shadow bottom
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,

        marginBottom: 20,
    },
    aiText: {
        fontSize: 16,
        color: "#303B5A",
        lineHeight: 22,
    },

    /* ===== USER BUBBLE ===== */
    userBubbleWrap: {
        alignItems: "flex-end",
    },
    userBubble: {
        backgroundColor: "#6B8BC8",
        padding: 18,

        // ROUNDED but right-bottom is straight
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 0,

        maxWidth: "85%",
        marginBottom: 20,
    },
    userText: {
        color: "white",
        fontSize: 16,
        lineHeight: 22,
    },

    /* ===== INPUT BAR ===== */
    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#FFF8EA",
    },
    input: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: "#6B8BC8",
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
});
