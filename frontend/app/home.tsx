import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Timy from "../src/assets/Timy.png";

import MenuIcon from "../src/assets/burger.png";
import BellIcon from "../src/assets/bell.png";
import UserIcon from "../src/assets/profile.png";
import { useRouter } from "expo-router";

const C = {
  bg: "#FFF8EA",
  navy: "#0E2A56",
  text: "#334155",
  muted: "#64748B",
  pill: "#EDEBE4",
  blue: "#7AA6D9",
  cardGrey: "#BFC9D8",
  cardBlue: "#6E8FBE",
  white: "#FFFFFF",
};

export default function Home() {
  const router = useRouter();
  const { width: W, height: H } = Dimensions.get("window");
  const radius = useMemo(() => Math.max(W, H) * 0.72, [W, H]);

  const [selected, setSelected] = useState(1);

  const days = ["m", "t", "w", "t", "f", "s", "s"];
  const dates = ["01", "02", "03", "04", "05", "06", "07"];

  return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* ======= HEADER ======= */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconCircle}>
            <Image source={MenuIcon} style={styles.iconImageWhite} />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconCircle}>
              <Image source={BellIcon} style={styles.iconImageWhite} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconCircle, { marginLeft: 12 }]}>
              <Image source={UserIcon} style={styles.iconImageWhite} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
            contentContainerStyle={{ paddingBottom: H * 0.22 }}
            showsVerticalScrollIndicator={false}
        >
          {/* ======= TITLE & DATE ======= */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            <Text style={styles.title}>Let’s See Your Day!</Text>
            <Text style={styles.subtitle}>Monday, March 25th 2025</Text>
          </View>

          {/* ======= DAY SELECTOR ======= */}
          <View style={styles.pillWrap}>
            <View style={styles.pillInner}>
              {days.map((d, i) => {
                const isSel = i === selected;
                return (
                    <TouchableOpacity
                        key={i}
                        style={styles.dayCol}
                        onPress={() => setSelected(i)}
                        activeOpacity={0.7}
                    >
                      <Text style={[styles.dayLabel, isSel && { color: C.navy }]}>
                        {d}
                      </Text>
                      <View
                          style={[
                            styles.dateDotWrap,
                            isSel && { backgroundColor: C.blue },
                          ]}
                      >
                        <Text
                            style={[
                              styles.dateText,
                              isSel && { color: C.white, fontWeight: "700" },
                            ]}
                        >
                          {dates[i]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ======= CARDS ======= */}
          <EventCard
              color={C.cardGrey}
              title="Title"
              time="12:00pm to 1:20pm - 1.4 hours"
              location="Bucharest"
              person="Mihaela"
          />

          <EventCard
              color={C.cardBlue}
              title="Title"
              time="12:00pm to 1:20pm - 1.4 hours"
              location="Bucharest"
              person="Mihaela"
          />

          <EventCard color={C.cardGrey} title="" time="" location="" person="" empty />
        </ScrollView>

        {/* ======= CERCUL colț dreapta-jos ======= */}
        <View
            pointerEvents="none"
            style={[
              styles.bigCircle,
              {
                width: radius,
                height: radius,
                borderRadius: radius / 2,
                right: -radius * 0.35,
                bottom: -radius * 0.25,
                backgroundColor: C.white,
              },
            ]}
        />

        {/* ======= TIMY CLICKABLE → CHAT ======= */}
        <TouchableOpacity
            onPress={() => router.push("/chat")}
            style={{ position: "absolute", right: 18, bottom: 18 }}
            activeOpacity={0.7}
        >
          <Image
              source={Timy}
              style={{
                width: 110,
                height: 110,
                resizeMode: "contain",
              }}
          />
        </TouchableOpacity>
      </View>
  );
}

function EventCard({
                     color,
                     title,
                     time,
                     location,
                     person,
                     empty = false,
                   }: {
  color: string;
  title: string;
  time: string;
  location: string;
  person: string;
  empty?: boolean;
}) {
  return (
      <View style={[styles.card, { backgroundColor: color }]}>
        {!empty ? (
            <>
              <Text style={styles.cardTitle}>{title}</Text>

              <Row>
                <Text style={styles.cardLine}>{time}</Text>
              </Row>

              <Row>
                <Text style={styles.cardLine}>{location}</Text>
              </Row>

              <Row>
                <Text style={styles.cardLine}>{person}</Text>
              </Row>

              <View style={{ flexDirection: "row", marginTop: 18 }}>
                <View style={[styles.avatar, { backgroundColor: "#DADADA" }]} />
                <View
                    style={[
                      styles.avatar,
                      { backgroundColor: "#B3B3B3", marginLeft: -10 },
                    ]}
                />
                <View
                    style={[
                      styles.avatar,
                      { backgroundColor: "#7A7A7A", marginLeft: -10 },
                    ]}
                />
              </View>
            </>
        ) : (
            <View style={{ height: 100 }} />
        )}
      </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
      <View style={styles.row}>
        <View style={styles.bullet} />
        <View style={{ width: 8 }} />
        <View style={{ flex: 1 }}>{children}</View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },

  header: {
    paddingTop: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: C.navy,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: C.text,
  },

  pillWrap: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  pillInner: {
    backgroundColor: C.pill,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCol: { alignItems: "center", width: 36 },
  dayLabel: {
    fontSize: 12,
    color: C.muted,
    textTransform: "lowercase",
    marginBottom: 8,
  },
  dateDotWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: { fontSize: 12, color: C.text },

  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 18,
  },
  cardTitle: {
    fontSize: 22,
    color: C.white,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  bullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.white,
    opacity: 0.9,
  },
  cardLine: {
    fontSize: 15,
    color: C.white,
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },

  bigCircle: {
    position: "absolute",
  },

  iconImageWhite: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
});
