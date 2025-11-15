import { useState, useEffect } from "react";
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


import { db } from "../firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./context/AuthContext";



export default function Reminder() {
 const { user } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  
 useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "reminders");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setReminders(list);
    });

    return unsubscribe;
  }, [user]);

  // 🔹 Add text reminder
  const addReminder = async () => {
    if (!newReminder.trim() || !user) return;

    await addDoc(collection(db, "users", user.uid, "reminders"), {
      type: "text",
      text: newReminder,
      createdAt: serverTimestamp()
    });

    setNewReminder("");
  };

  // 🔹 Add photo reminder using camera
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Kamera nuk ka leje!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1
    });

    if (!result.canceled) {
      await addDoc(collection(db, "users", user.uid, "reminders"), {
        type: "photo",
        uri: result.assets[0].uri,
        createdAt: serverTimestamp()
      });
    }
  };

  // 🔹 Delete reminder
  const deleteReminder = async (id) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "reminders", id));
    } catch (error) {
      console.log("Gabim:", error.message);
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