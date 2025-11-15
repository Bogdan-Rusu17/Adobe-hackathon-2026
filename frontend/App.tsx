import { useEffect, useState } from "react";
import {View, Text, StyleSheet, Button} from "react-native";
import {connectGoogle} from "./src/clients/googleAuthClient";

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
        <Button title="Connect Google Calendar" onPress={connectGoogle} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 20 },
  response: { fontSize: 16, color: "green" },
});
