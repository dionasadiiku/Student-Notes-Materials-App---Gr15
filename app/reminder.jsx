import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

import Footer from "./components/footer";
import Header from "./components/header";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "./context/AuthContext";

export default function Reminder() {
  const { user } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());

  // Modal për shikim foto
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState(null);

  // LOAD reminders
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "reminders");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setReminders(list);
    });

    return unsubscribe;
  }, [user]);

  // NOTIFICATIONS — MOBILE ONLY
  useEffect(() => {
    if (Platform.OS !== "web") {
      Notifications.requestPermissionsAsync();
    }
  }, []);

  const scheduleNotification = async (title, date) => {
    if (Platform.OS === "web") return; // ❗ SAFE ON WEB

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: title || "You have a reminder.",
        },
        trigger: date,
      });
    } catch (err) {
      console.log("Notification Error:", err);
    }
  };

  // Add TEXT reminder → Open Modal
  const addReminder = () => {
    if (!newReminder.trim() || !user) return;

    const now = new Date();
    setEditingReminder({
      id: null,
      type: "text",
      text: newReminder,
      uri: null,
      remindAt: new Date(now.getTime() + 5 * 60 * 1000),
    });
    setTempDate(new Date(now.getTime() + 5 * 60 * 1000));
    setShowModal(true);
  };

  // CAMERA → Open modal with photo
  const openCamera = async () => {
    if (!user) return;

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission denied.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const now = new Date();

      setEditingReminder({
        id: null,
        type: "photo",
        text: "",
        uri: result.assets[0].uri,
        remindAt: new Date(now.getTime() + 5 * 60 * 1000),
      });

      setTempDate(new Date(now.getTime() + 5 * 60 * 1000));
      setShowModal(true);
    }
  };

  const deleteReminder = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "reminders", id));
  };

  const startEditReminder = (item) => {
    const remindAt =
      item.remindAt && item.remindAt.toDate
        ? item.remindAt.toDate()
        : new Date();

    setEditingReminder({
      id: item.id,
      type: item.type,
      text: item.text || "",
      uri: item.uri || null,
      remindAt,
    });
    setTempDate(remindAt);
    setShowModal(true);
  };

  const saveReminderFromModal = async () => {
    if (!user || !editingReminder) return;

    const data = {
      type: editingReminder.type,
      text: editingReminder.text,
      uri: editingReminder.uri || null,
      remindAt: tempDate,
    };

    if (!editingReminder.id) {
      await addDoc(collection(db, "users", user.uid, "reminders"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      await scheduleNotification(editingReminder.text, tempDate);
    } else {
      await updateDoc(
        doc(db, "users", user.uid, "reminders", editingReminder.id),
        data
      );
      await scheduleNotification(editingReminder.text, tempDate);
    }

    setNewReminder("");
    setEditingReminder(null);
    setShowModal(false);
  };

  const changePhotoInModal = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (!result.canceled) {
      setEditingReminder((prev) =>
        prev
          ? { ...prev, uri: result.assets[0].uri, type: "photo" }
          : prev
      );
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "";
    return timestamp.toDate().toLocaleString();
  };

  const formatRemindAt = (val) => {
    const date = val?.toDate ? val.toDate() : val;
    return date?.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Header />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Reminders</Text>

        {/* Input row */}
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

        {/* Camera */}
        <TouchableOpacity style={styles.scanButton} onPress={openCamera}>
          <Text style={styles.scanText}>Scan (camera)</Text>
        </TouchableOpacity>

        {/* Empty */}
        {reminders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No Reminders Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start writing a reminder or scan it using your camera.
            </Text>
          </View>
        ) : (
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.type === "photo") {
                    setSelectedPhotoUri(item.uri);
                    setPhotoModalVisible(true);
                  } else {
                    startEditReminder(item);
                  }
                }}
              >
                <View style={styles.reminderRow}>
                  <View style={{ flex: 1 }}>
                    {item.type === "text" ? (
                      <>
                        <Text style={styles.reminderText}>{item.text}</Text>
                        <Text style={styles.dateText}>
                          Created: {formatDate(item.createdAt)}
                        </Text>
                        {item.remindAt && (
                          <Text style={styles.dateText}>
                            Reminder: {formatRemindAt(item.remindAt)}
                          </Text>
                        )}
                      </>
                    ) : (
                      <>
                        <Image
                          source={{ uri: item.uri }}
                          style={styles.photo}
                        />
                        {item.text ? (
                          <Text style={styles.reminderText}>{item.text}</Text>
                        ) : null}

                        <Text style={styles.dateText}>
                          Created: {formatDate(item.createdAt)}
                        </Text>
                        {item.remindAt && (
                          <Text style={styles.dateText}>
                            Reminder: {formatRemindAt(item.remindAt)}
                          </Text>
                        )}
                      </>
                    )}
                  </View>

                  {/* Edit / Delete */}
                  <View style={styles.rowActions}>
                    <TouchableOpacity onPress={() => startEditReminder(item)}>
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteReminder(item.id)}
                    >
                      <Text style={styles.deleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </KeyboardAvoidingView>

      {/* PHOTO VIEW MODAL */}
      <Modal visible={photoModalVisible} transparent>
        <View style={styles.photoModalBg}>
          <Image source={{ uri: selectedPhotoUri }} style={styles.fullPhoto} />
          <TouchableOpacity
            style={styles.closePhotoBtn}
            onPress={() => setPhotoModalVisible(false)}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* CREATE / EDIT MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingReminder?.id ? "Edit Reminder" : "New Reminder"}
            </Text>

            {/* Photo preview if exists */}
            {editingReminder?.type === "photo" && editingReminder?.uri && (
              <>
                <Image
                  source={{ uri: editingReminder.uri }}
                  style={styles.modalImage}
                />
                <TouchableOpacity onPress={changePhotoInModal}>
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Text input */}
            <TextInput
              style={styles.modalInput}
              placeholder="Reminder text..."
              value={editingReminder?.text}
              onChangeText={(txt) =>
                setEditingReminder((prev) =>
                  prev ? { ...prev, text: txt } : prev
                )
              }
            />

            <Text style={styles.modalLabel}>Select date/time</Text>

            {/* Disable DateTimePicker on Web */}
            {Platform.OS !== "web" ? (
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                onChange={(e, d) => d && setTempDate(d)}
              />
            ) : (
              <Text style={{ marginBottom: 10, color: "#888" }}>
                Date/time picker not supported on Web
              </Text>
            )}

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={saveReminderFromModal}
            >
              <Text style={styles.modalBtnText}>
                {editingReminder?.id ? "Save Changes" : "Save Reminder"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={[styles.modalBtnText, { color: "#333" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer />
    </View>
  );
}

/* ---------------------------------------------------- *
 *                        STYLES
 * ---------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6FF",
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 25,
    color: "#2C2C2E",
    letterSpacing: 0.5,
  },

  /* ---------------- INPUT AREA ---------------- */
  inputRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 14,
    fontSize: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2D5F7",
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },

  button: {
    marginLeft: 10,
    backgroundColor: "#A66CFF",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#A66CFF",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    fontWeight: "700",
    color: "white",
    fontSize: 15,
  },

  /* SCAN BUTTON */
  scanButton: {
    backgroundColor: "#C39BFF",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#C39BFF",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
  },
  scanText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
  },

  /* ---------------- EMPTY STATE ---------------- */
  emptyBox: {
    marginTop: 50,
    backgroundColor: "#ffffff",
    padding: 35,
    borderRadius: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C2C2E",
  },
  emptySubtitle: {
    marginTop: 10,
    color: "#6E6E73",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20,
  },

  /* ---------------- REMINDER CARD ---------------- */
  reminderRow: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
  },

  reminderText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  dateText: {
    fontSize: 12,
    marginTop: 6,
    color: "#6E6E73",
  },

  rowActions: {
    marginLeft: 15,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  editText: {
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 14,
  },
  deleteText: {
    color: "#FF453A",
    fontSize: 22,
    fontWeight: "700",
  },

  photo: {
    width: 85,
    height: 85,
    borderRadius: 14,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },

  /* ---------------- FULL PHOTO MODAL ---------------- */
  photoModalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.90)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullPhoto: {
    width: "92%",
    height: "70%",
    borderRadius: 14,
    resizeMode: "contain",
  },
  closePhotoBtn: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 10,
  },

  /* ---------------- EDIT / CREATE MODAL ---------------- */
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: 16,
  },

  modalInput: {
    width: "100%",
    backgroundColor: "#F4F2FA",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E3DDF7",
    marginBottom: 16,
    color: "#000",
  },

  modalLabel: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
  },

  modalBtn: {
    backgroundColor: "#8A4AF3",
    width: "100%",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
    shadowColor: "#8A4AF3",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
  },

  modalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  modalImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 12,
    alignSelf: "center",
  },
  changePhotoText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 12,
    fontSize: 14,
  },
});