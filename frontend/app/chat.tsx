import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av"; // 🔊 doar Android use-case

import TimyChat from "../src/assets/chat.png";
import Arrow from "../src/assets/arrow.png";
import Dots from "../src/assets/dots.png";
import Send from "../src/assets/send.png";

// 🔊 schimbă fișierul cum vrei tu în assets
const AI_SEND_SOUND = require("../src/assets/ai-send.mp3");

const C = {
  bg: "#FFF8EA",
  navy: "#212121",
  text: "#212121",
  muted: "#64748B",
  blue: "#5884BB",
  white: "#FFFBF3",
  aiMessageBg: "#FFFBF3",
  userMessageBg: "#5884BB",
};

// ✅ Tip corect pentru mesaje (rezolvă eroarea TS 2345)
type ChatMsg = { id: string; text: string; type: "ai" | "user" };

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "1",
      type: "ai",
      text: "Hi! I'm Timy, your AI assistant. How can I help you today?",
    },
  ]);

  const scrollViewRef = useRef<ScrollView | null>(null);

  // 🔊 doar un sound pentru AI
  const aiSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    // Android: preîncărcăm sunetul ca să fie instant
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(AI_SEND_SOUND, {
          shouldPlay: false,
        });
        aiSoundRef.current = sound;
      } catch (e) {
        console.warn("Eroare încărcare sunet AI:", e);
      }
    })();

    const listener = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 80);
    });

    return () => {
      listener.remove();
      aiSoundRef.current?.unloadAsync();
    };
  }, []);

  // 🔊 helper: sunet la răspunsul AI
  const playAiSend = async () => {
    try {
      const s = aiSoundRef.current;
      if (s) {
        await s.setPositionAsync(0);
        await s.playAsync();
      }
    } catch (e) {
      console.warn("Eroare redare sunet AI:", e);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      type: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");

    // Scroll la capăt după ce s-a adăugat mesajul user
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);

    // Simulare răspuns AI (doar aici redăm sunetul)
    setTimeout(() => {
      const aiMsg: ChatMsg = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: "I'm processing your request...",
      };
      setMessages((prev) => [...prev, aiMsg]);

      // 🔊 play doar la mesaj AI
      playAiSend();

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() =>
            router.canGoBack() ? router.back() : router.push("/")
          }
        >
          <Image source={Arrow} style={styles.iconImage} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Chat with Timy</Text>

        <TouchableOpacity style={styles.iconCircle2}>
          <Image source={Dots} style={styles.iconImage} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-20}
      >
        {/* ===== CHAT CONTENT ===== */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() =>
            scrollViewRef.current?.scrollToEnd({ animated: false })
          }
        >
          {/* AVATAR */}
          <View style={styles.avatarWrap}>
            <Image source={TimyChat} style={styles.avatar} />
          </View>

          {messages.map((msg) =>
            msg.type === "ai" ? (
              <View key={msg.id} style={styles.aiBubbleWrap}>
                <View style={styles.aiBubble}>
                  <Text style={styles.aiText}>{msg.text}</Text>
                </View>
              </View>
            ) : (
              <View key={msg.id} style={styles.userBubbleWrap}>
                <View style={styles.userBubble}>
                  <Text style={styles.userText}>{msg.text}</Text>
                </View>
              </View>
            )
          )}
        </ScrollView>

        {/* ===== INPUT BAR ===== */}
        <View style={styles.inputBar}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Ask me anything..."
            placeholderTextColor={C.muted}
            style={styles.input}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Image source={Send} style={styles.iconImage} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ======================  STYLES  ======================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: 21,
    height: 21,
    resizeMode: "contain",
  },
  iconCircle2: {
    width: 40,
    height: 40,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: C.navy,
  },
  avatarWrap: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 118,
    height: 118,
    resizeMode: "contain",
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  aiBubbleWrap: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  aiBubble: {
    backgroundColor: C.aiMessageBg,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  aiText: {
    fontSize: 15,
    color: C.text,
    lineHeight: 22,
  },
  userBubbleWrap: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  userBubble: {
    backgroundColor: C.userMessageBg,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userText: {
    color: C.white,
    fontSize: 15,
    lineHeight: 22,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40,
    backgroundColor: C.bg,
  },
  input: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    color: C.text,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: C.blue,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
