import { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, Image, StatusBar } from "react-native";
import { useRouter } from 'expo-router';
import Timy from "../src/assets/Timy.png";
import GoogleButton from "../components/GoogleButton";
import {getJWT} from "../src/storage/authStorage";

export default function Index() {
  const router = useRouter();
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const { width: W, height: H } = dimensions;

  useEffect(() => {
    const checkAuth = async () => {
        const token = await getJWT();
        if (token) {
            router.replace('/home');
        }
    };

    checkAuth();
 }, []);

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => setDimensions(window));
    StatusBar.setBarStyle("dark-content");
    return () => sub?.remove();
  }, []);

  const scale = (size: number, maxSize: number) => Math.min(W * size, maxSize);
  const clampedScale = (size: number, min: number, max: number) => {
    const scaled = W * size;
    return Math.max(min, Math.min(scaled, max));
  };


  const circleSize = useMemo(() => Math.max(W, H) * 1.9, [W, H]);
  const circleBottom = useMemo(() => -circleSize * 0.68, [circleSize]);

  const birdBottom = clampedScale(0.20, 80, 160);

  return (
    <View style={styles.container}>
      <View
        pointerEvents="none"
        style={[
          styles.arcBg,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            bottom: circleBottom,
            left: (W - circleSize) / 2,
          },
        ]}
      />

      <View style={styles.topSection} />

      <View style={styles.bottomWrap}>
        <View
          style={[
            styles.textButtonGroup,
            {
              maxWidth: scale(1, 320),
              bottom: clampedScale(0.35, 150, 300),
            },
          ]}
        >
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

          <View
            style={{
              marginTop: clampedScale(0.1, 40, 80), // spațiu între text și buton
              width: "100%",
              maxWidth: 320,
            }}
          >
            <GoogleButton />
          </View>
        </View>
      </View>

      <View pointerEvents="none" style={styles.birdOverlay}>
        <Image
          source={Timy}
          style={{
            width: clampedScale(0.52, 200, 330),
            height: clampedScale(0.40, 230, 360),
            resizeMode: "contain",
            bottom: birdBottom,
            position: "absolute",
            marginBottom: 354,
            transform: [{ scale: 1.2 }],
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8EA",
  },

  arcBg: {
    position: "absolute",
    backgroundColor: "#7AA6D9",
    zIndex: 0,
  },

  topSection: {
    flex: 0.8,
    backgroundColor: "#FFF8EA",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    zIndex: 2,
  },

  bottomWrap: {
    flex: 1.5,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "10%",
    zIndex: 2,
  },

  textButtonGroup: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
  },

  birdOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 3,
    top: 0,
    bottom: 0,
  },
});
