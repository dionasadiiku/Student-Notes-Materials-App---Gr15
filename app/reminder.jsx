import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");

  const addReminder = () => {
    if (!newReminder.trim()) return;
    setReminders([...reminders, newReminder]);
    setNewReminder("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminder</Text>

      <TextInput
        placeholder="Write your reminder..."
        style={styles.input}
        value={newReminder}
        onChangeText={setNewReminder}
      />

      <TouchableOpacity style={styles.button} onPress={addReminder}>
        <Text style={styles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>

      <FlatList
        data={reminders}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => <Text style={styles.reminder}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#eab8dc", padding: 12, borderRadius: 8 },
  buttonText: { textAlign: "center", fontWeight: "600" },
  reminder: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
