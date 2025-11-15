import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:4000/health")
        .then((res) => res.json())
        .then((data) => setMessage(JSON.stringify(data)))
        .catch((err) => setMessage("Error: " + err.message));
  }, []);

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Backend response:</Text>
        <Text style={styles.response}>{message}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 20 },
  response: { fontSize: 16, color: "green" },
});
