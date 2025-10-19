import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "./components/footer";
import Header from "./components/header";

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");

  const addReminder = () => {
    if (!newReminder.trim()) return;
    setReminders([...reminders, newReminder]);
    setNewReminder("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Reminders</Text>

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Write your reminder..."
            style={styles.input}
            value={newReminder}
            onChangeText={setNewReminder}
          />
          <TouchableOpacity style={styles.button} onPress={addReminder}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={reminders}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => <Text style={styles.reminder}>{item}</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </KeyboardAvoidingView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  inputRow: { flexDirection: "row", marginBottom: 15 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f3e6f9",
  },
  button: {
    backgroundColor: "#eab8dcff",
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 16,
    marginLeft: 10,
    borderRadius: 8,
    justifyContent: "center",
    height: 50,
  },
  buttonText: { color: "#000", fontWeight: "600", textAlign: "center" },
  reminder: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#eab8dcff",
    borderRadius: 8,
    marginBottom: 8,
  },
});