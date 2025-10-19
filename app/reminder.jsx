import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshReminder = () => {
    setRefreshKey(prev => prev + 1);
  };

  const addReminder = () => {
    if (!newReminder.trim()) return;
    setReminders([...reminders, newReminder]);
    setNewReminder("");
  };

  return (
    <View style={styles.container}>
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
            placeholderTextColor={'#000'}
          />
          <TouchableOpacity style={styles.button} onPress={addReminder}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={reminders}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.reminderRow}>
              <Text style={styles.reminderText}>{item}</Text>
              <TouchableOpacity onPress={() => deleteReminder(item)}>
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </KeyboardAvoidingView>

      <Footer onReminderPress={refreshReminder}/>
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#eab8dcff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#000" },

  reminderRow: {
    backgroundColor: "#eab8dcff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  reminderText: { fontSize: 16, fontWeight: "500", color: "#1C1C1E" },
  deleteText: { fontSize: 18, fontWeight: "600", color: "#FF3B30" },


  container: {flex: 1, backgroundColor: '#fff'},
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 20, textAlign: "center" },
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
})