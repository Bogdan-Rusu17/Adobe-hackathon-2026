// Profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import UserIcon from "../src/assets/profile.png";
import Arrow from "../src/assets/arrow.png";

const C = {
  bg: "#FFF8EA",
  navy: "#002150",
  text: "#334155",
  muted: "#64748B",
  blue: "#5884BB",
  white: "#FFFBF3",
  red: "#f1454dff",
};

export default function Profile() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [sleepHours, setSleepHours] = useState({
    start: "22:00",
    end: "06:00",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<"start" | "end" | null>(null);
  const [selectedHour, setSelectedHour] = useState(22);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleTimePress = (field: "start" | "end") => {
    setEditingField(field);
    const currentTime = sleepHours[field];
    const [hour, minute] = currentTime.split(':').map(Number);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setModalVisible(true);
  };

  const handleSaveTime = () => {
    if (editingField) {
      const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      setSleepHours({
        ...sleepHours,
        [editingField]: formattedTime,
      });
      setModalVisible(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              router.replace("/");
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image source={Arrow} style={styles.iconImage} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* PROFILE INFO */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image source={UserIcon} style={styles.avatarImage} />
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      {/* SLEEP HOURS */}
      <View style={styles.workingHoursContainer}>
        
        <View style={styles.timeCard}>
          {/* Gradient Header with Moon */}
          <View style={styles.cardHeader}>
            <View style={styles.moonContainer}>
              <Text style={styles.moonIcon}>🌙</Text>
            </View>
            <Text style={styles.cardHeaderText}>Sleep Schedule</Text>
          </View>

          {/* Time Selection */}
          <View style={styles.timeSelectionContainer}>
            <TouchableOpacity 
              style={styles.timeCard2}
              onPress={() => handleTimePress("start")}
              activeOpacity={0.7}
            >
              <View style={styles.timeIconCircle}>
                <Text style={styles.timeEmoji}>😴</Text>
              </View>
              <Text style={styles.timeLabel2}>Bedtime</Text>
              <View style={styles.timeDisplay}>
                <Text style={styles.timeText2}>{sleepHours.start}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.arrowContainer}>
              <View style={styles.arrowLine} />
              <Text style={styles.arrowText}>→</Text>
            </View>

            <TouchableOpacity 
              style={styles.timeCard2}
              onPress={() => handleTimePress("end")}
              activeOpacity={0.7}
            >
              <View style={styles.timeIconCircle}>
                <Text style={styles.timeEmoji}>☀️</Text>
              </View>
              <Text style={styles.timeLabel2}>Wake Up</Text>
              <View style={styles.timeDisplay}>
                <Text style={styles.timeText2}>{sleepHours.end}</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* VERSION */}
      <Text style={styles.versionText}>Version 1.0.0</Text>

      {/* TIME PICKER MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingField === "start" ? "Bedtime" : "Wake Up Time"}
            </Text>
            
            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        selectedHour === hour && styles.pickerItemSelected
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedHour === hour && styles.pickerItemTextSelected
                      ]}>
                        {String(hour).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minute && styles.pickerItemSelected
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedMinute === minute && styles.pickerItemTextSelected
                      ]}>
                        {String(minute).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveTime}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.navy,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    tintColor: C.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: C.navy,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: C.muted,
  },
  workingHoursContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeader: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: C.navy,
  },
  timeCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: {
    backgroundColor: "#1E293B",
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    position: "relative",
  },
  moonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  moonIcon: {
    fontSize: 32,
  },
  starsIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E2E8F0",
    letterSpacing: 0.5,
  },
  timeSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingHorizontal: 16,
  },
  timeCard2: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  timeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeEmoji: {
    fontSize: 24,
  },
  timeLabel2: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeDisplay: {
    backgroundColor: C.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.blue,
    minWidth: 90,
  },
  timeText2: {
    fontSize: 20,
    fontWeight: "700",
    color: C.navy,
    textAlign: "center",
  },
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
    position: "relative",
  },
  arrowLine: {
    width: 30,
    height: 2,
    backgroundColor: C.blue,
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 24,
    color: C.blue,
    fontWeight: "700",
    position: "absolute",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F9FF",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  durationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  durationText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0369A1",
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 32,
    backgroundColor: C.red,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    shadowColor: C.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
  },
  versionText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 12,
    color: C.muted,
  },
  iconImage: {
    width: 21,
    height: 21,
    resizeMode: "contain",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: C.navy,
    marginBottom: 24,
    textAlign: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    height: 200,
  },
  pickerColumn: {
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.muted,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  pickerScroll: {
    height: 160,
    width: 80,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: C.blue,
  },
  pickerItemText: {
    fontSize: 20,
    fontWeight: "600",
    color: C.text,
  },
  pickerItemTextSelected: {
    color: C.white,
    fontWeight: "700",
  },
  pickerSeparator: {
    fontSize: 32,
    fontWeight: "700",
    color: C.navy,
    marginHorizontal: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: C.bg,
    borderWidth: 2,
    borderColor: C.muted,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  saveButton: {
    backgroundColor: C.blue,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
  },
});