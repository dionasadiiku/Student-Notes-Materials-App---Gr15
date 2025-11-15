import { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import Footer from "./components/footer";
import Header from "./components/header";

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshReminder = () => {
    setRefreshKey(prev => prev + 1);
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const addReminder = () => {
    if (!newReminder.trim()) return;

    setReminders([
      ...reminders,
      { id: Date.now().toString(), type: "text", text: newReminder }
    ]);

    setNewReminder("");
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Duhet leje për kamerë!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: false
    });

    if (!result.canceled) {
      setReminders([
        ...reminders,
        {
          id: Date.now().toString(),
          type: "photo",
          uri: result.assets[0].uri
        }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Reminders</Text>

        {/* Add Text Reminder */}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Write your reminder..."
            style={styles.input}
            value={newReminder}
            onChangeText={setNewReminder}
            placeholderTextColor="#000"
          />
          <TouchableOpacity style={styles.button} onPress={addReminder}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Scan With Camera */}
        <TouchableOpacity style={styles.scanButton} onPress={openCamera}>
          <Text style={styles.scanText}>Scan (kamera)</Text>
        </TouchableOpacity>

        {/* Reminder List */}
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.reminderRow}>
              {item.type === "text" ? (
                <Text style={styles.reminderText}>{item.text}</Text>
              ) : (
                <Image source={{ uri: item.uri }} style={styles.photo} />
              )}

              <TouchableOpacity onPress={() => deleteReminder(item.id)}>
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>

      <Footer onReminderPress={refreshReminder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, textAlign: "center" },

  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#f3e6f9",
    color: "#000",
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#eab8dcff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#000" },

  scanButton: {
    backgroundColor: "#d48de0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center"
  },
  scanText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16
  },

  reminderRow: {
    backgroundColor: "#eab8dcff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  reminderText: { fontSize: 16, fontWeight: "500", color: "#1C1C1E", flex: 1 },

  deleteText: { fontSize: 22, fontWeight: "600", color: "#FF3B30", marginLeft: 10 },

  photo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10
  }
});