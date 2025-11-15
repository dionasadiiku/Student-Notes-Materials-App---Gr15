import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import Header from "./components/header";
import Footer from "./components/footer";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const user = auth.currentUser;

  // edit modal states
  const [editVisible, setEditVisible] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName ?? "");
  const [photoInput, setPhotoInput] = useState(user?.photoURL ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const openEdit = () => {
    setNameInput(user?.displayName ?? "");
    setPhotoInput(user?.photoURL ?? "");
    setError("");
    setSuccess("");
    setEditVisible(true);
  };

  const handleSave = async () => {
    if (!user) {
      setError("User not available.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(user, {
        displayName: nameInput?.trim() ? nameInput.trim() : null,
        photoURL: photoInput?.trim() ? photoInput.trim() : null,
      });

      setSuccess("Profile updated successfully.");
      setTimeout(() => {
        setEditVisible(false);
        setSuccess("");
      }, 900);
    } catch (err) {
      setError(err?.message ?? "Error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const joinedText = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString()
    : "—";

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header />

      <ScrollView contentContainerStyle={styles.wrapper}>
        
        <View style={styles.top}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user?.photoURL ??
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png",
              }}
              style={styles.avatar}
            />
          </View>

          <TouchableOpacity style={styles.editAvatarBtn} onPress={openEdit}>
            <Ionicons name="pencil" size={18} color="#fff" />
            <Text style={styles.editAvatarText}>Edit</Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.card}>
          <Row label="Display name" value={user?.displayName ?? "—"} />
          <Row label="Email" value={user?.email ?? "—"} />
          <Row label="Joined on" value={joinedText} />
        </View>

       
        <TouchableOpacity style={styles.mainBtn} onPress={openEdit}>
          <Text style={styles.mainBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />

      
      <Modal
        visible={editVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.inputLabel}>Display name</Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter name"
              style={styles.input}
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Photo URL</Text>
            <TextInput
              value={photoInput}
              onChangeText={setPhotoInput}
              placeholder="https://example.com/me.jpg"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="url"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ddd" }]}
                onPress={() => setEditVisible(false)}
                disabled={isSaving}
              >
                <Text style={{ color: "#222" }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#eab8dc" }]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={{ color: "#fff" }}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: { color: "#666", fontSize: 15 },
  value: { color: "#111", fontSize: 15, maxWidth: "70%", textAlign: "right" },
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 60,
    alignItems: "center",
  },
  top: { alignItems: "center", marginBottom: 18 },
  avatarContainer: {
    width: 130,
    height: 130,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: { width: "100%", height: "100%" },

  editAvatarBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eab8dc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editAvatarText: { color: "#fff", marginLeft: 8, fontWeight: "600" },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 1,
    marginBottom: 18,
  },

  mainBtn: {
    backgroundColor: "#eab8dc",
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  mainBtnText: { color: "#fff", fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  inputLabel: { color: "#666", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fafafa",
  },

  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },

  error: { color: "red", marginTop: 8, textAlign: "center" },
  success: { color: "green", marginTop: 8, textAlign: "center" },
});


