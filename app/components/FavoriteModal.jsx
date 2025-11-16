import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebase";

export default function FavoriteModal({ visible, onClose, book }) {
  const [progress, setProgress] = useState(book?.progress || 0);
  const [notes, setNotes] = useState(book?.notes || "");
  const [tags, setTags] = useState(book?.tags || "");

  const handleSave = async () => {
    if (!auth.currentUser || !book?.id) return;

    const ref = doc(db, "users", auth.currentUser.uid, "favorites", book.id);
    await updateDoc(ref, { progress, notes, tags });
    onClose();
  };

  if (!book) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>{book?.title}</Text>

          <Text style={styles.label}>Reading Progress {Math.round(progress * 100)}%</Text>
          <Slider 
            style={{ width: "100%" }}
            minimumValue={0}
            maximumValue={1}
            value={progress}
            onValueChange={setProgress}
          />

          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            placeholder="ex: Exam, Homework..."
            value={tags}
            onChangeText={setTags}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { height: 70 }]}
            multiline
            placeholder="Write something..."
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.45)" },
  modal: { width: "85%", backgroundColor: "#fff", borderRadius: 16, padding: 20 },
  closeBtn: { alignSelf: "flex-end" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  label: { fontWeight: "600", marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, marginTop: 5, padding: 8 },
  saveBtn: { backgroundColor: "#7d57f0", paddingVertical: 10, borderRadius: 10, marginTop: 18, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
