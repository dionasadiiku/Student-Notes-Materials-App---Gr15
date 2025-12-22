import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
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

import Footer from "../components/footer";
import Header from "../components/header";

import AnimatedButton from "../components/AnimatedButton";
import FadeModal from "../components/FadeModal";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { registerPushNotifications } from "../notifications";

/* ----------------------- Helpers (Date safe) ----------------------- */
const toJSDate = (val) => {
  if (!val) return null;
  if (val?.toDate) return val.toDate(); // Firestore Timestamp
  if (val instanceof Date) return val; // JS Date
  return null;
};

const formatAnyDate = (val) => {
  const d = toJSDate(val);
  return d ? d.toLocaleString() : "";
};

/* ----------------------- Memoized Item ----------------------- */
const ReminderItem = React.memo(function ReminderItem({
  item,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <TouchableOpacity onPress={() => onOpen(item)} activeOpacity={0.85}>
      <View style={styles.reminderRow}>
        <View style={{ flex: 1 }}>
          {item.type === "photo" ? (
            <>
              <Image source={{ uri: item.uri }} style={styles.photo} />
              {!!item.text && <Text style={styles.reminderText}>{item.text}</Text>}
            </>
          ) : (
            <Text style={styles.reminderText}>{item.text}</Text>
          )}

          <Text style={styles.dateText}>Created: {formatAnyDate(item.createdAt)}</Text>

          {!!item.remindAt && (
            <Text style={styles.dateText}>Reminder: {formatAnyDate(item.remindAt)}</Text>
          )}
        </View>

        {/* Secondary actions (no AnimatedButton) */}
        <View style={styles.rowActions}>
          <TouchableOpacity onPress={() => onEdit(item)} activeOpacity={0.7}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(item.id)} activeOpacity={0.7}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function Reminder() {
  const { user } = useAuth();

  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());

  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState(null);

  /* ----------------------- Load reminders ----------------------- */
  useEffect(() => {
    if (!user?.uid) return;

    const ref = collection(db, "users", user.uid, "reminders");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReminders(list);
    });

    return unsubscribe;
  }, [user?.uid]);

  /* ----------------------- Notification permissions ----------------------- */
  useEffect(() => {
    registerPushNotifications();
  }, []);

  /* ----------------------- Schedule notification ----------------------- */
  const scheduleNotification = useCallback(async (title, date) => {
    if (Platform.OS === "web") return null;

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: title || "You have a reminder.",
          sound: true,
        },
        trigger: date,
      });

      return notificationId;
    } catch (err) {
      console.log("Notification Error:", err);
      return null;
    }
  }, []);

  /* ----------------------- Save notification log ----------------------- */
  const saveNotificationToSubcollection = useCallback(
    async (data) => {
      if (!user?.uid) return;

      await setDoc(
        doc(db, "users", user.uid),
        { createdAt: serverTimestamp() },
        { merge: true }
      );

      await addDoc(collection(db, "users", user.uid, "notifications"), {
        ...data,
        createdAt: serverTimestamp(),
        read: false,
      });
    },
    [user?.uid]
  );

  /* ----------------------- Add text reminder -> open modal ----------------------- */
  const addReminder = useCallback(() => {
    if (!newReminder.trim() || !user?.uid) return;

    const now = new Date();
    const defaultTime = new Date(now.getTime() + 5 * 60 * 1000);

    setEditingReminder({
      id: null,
      type: "text",
      text: newReminder.trim(),
      uri: null,
      remindAt: defaultTime,
      notificationId: null,
    });

    setTempDate(defaultTime);
    setShowModal(true);
  }, [newReminder, user?.uid]);

  /* ----------------------- Camera -> open modal with photo ----------------------- */
  const openCamera = useCallback(async () => {
    if (!user?.uid) return;

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "Camera permission denied.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (!result.canceled) {
      const now = new Date();
      const defaultTime = new Date(now.getTime() + 5 * 60 * 1000);

      setEditingReminder({
        id: null,
        type: "photo",
        text: "",
        uri: result.assets[0].uri,
        remindAt: defaultTime,
        notificationId: null,
      });

      setTempDate(defaultTime);
      setShowModal(true);
    }
  }, [user?.uid]);

  /* ----------------------- Delete reminder ----------------------- */
  const deleteReminder = useCallback(
    async (id) => {
      if (!user?.uid) return;

      try {
        const item = reminders.find((r) => r.id === id);

        if (item?.notificationId && Platform.OS !== "web") {
          await Notifications.cancelScheduledNotificationAsync(item.notificationId);
        }

        await deleteDoc(doc(db, "users", user.uid, "reminders", id));

        await saveNotificationToSubcollection({
          type: "reminder",
          title: "Reminder deleted",
          message: item?.text || "Reminder",
          reminderId: id,
          notificationId: item?.notificationId || null,
          scheduledAt: item?.remindAt || new Date(),
        });
      } catch (e) {
        console.log("deleteReminder error:", e);
      }
    },
    [user?.uid, reminders, saveNotificationToSubcollection]
  );

  /* ----------------------- Start edit ----------------------- */
  const startEditReminder = useCallback((item) => {
    const remindAt = toJSDate(item.remindAt) || new Date();

    setEditingReminder({
      id: item.id,
      type: item.type,
      text: item.text || "",
      uri: item.uri || null,
      remindAt,
      notificationId: item.notificationId || null,
    });

    setTempDate(remindAt);
    setShowModal(true);
  }, []);

  /* ----------------------- Save from modal ----------------------- */
  const saveReminderFromModal = useCallback(async () => {
    if (!user?.uid || !editingReminder) return;

    // ✅ validate future time (mobile)
    if (Platform.OS !== "web" && tempDate.getTime() <= Date.now()) {
      Alert.alert("Invalid time", "Please select a future date/time.");
      return;
    }

    try {
      // cancel old scheduled notification (if editing)
      if (editingReminder.notificationId && Platform.OS !== "web") {
        await Notifications.cancelScheduledNotificationAsync(
          editingReminder.notificationId
        );
      }

      const newNotificationId = await scheduleNotification(
        editingReminder.text,
        tempDate
      );

      const data = {
        type: editingReminder.type,
        text: editingReminder.text,
        uri: editingReminder.uri || null,
        remindAt: tempDate,
        notificationId: newNotificationId || null,
      };

      if (!editingReminder.id) {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "reminders"),
          { ...data, createdAt: serverTimestamp() }
        );

        await saveNotificationToSubcollection({
          type: "reminder",
          title: "Reminder scheduled",
          message: editingReminder.text || "Reminder",
          reminderId: docRef.id,
          notificationId: newNotificationId || null,
          scheduledAt: tempDate,
        });
      } else {
        await updateDoc(
          doc(db, "users", user.uid, "reminders", editingReminder.id),
          data
        );

        await saveNotificationToSubcollection({
          type: "reminder",
          title: "Reminder updated",
          message: editingReminder.text || "Reminder",
          reminderId: editingReminder.id,
          notificationId: newNotificationId || null,
          scheduledAt: tempDate,
        });
      }

      setNewReminder("");
      setEditingReminder(null);
      setShowModal(false);
    } catch (e) {
      console.log("saveReminderFromModal error:", e);
    }
  }, [
    user?.uid,
    editingReminder,
    tempDate,
    scheduleNotification,
    saveNotificationToSubcollection,
  ]);

  /* ----------------------- Change photo inside modal ----------------------- */
  const changePhotoInModal = useCallback(async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (!result.canceled) {
      setEditingReminder((prev) =>
        prev ? { ...prev, uri: result.assets[0].uri, type: "photo" } : prev
      );
    }
  }, []);

  /* ----------------------- Open item: photo -> viewer, text -> edit ----------------------- */
  const onOpenItem = useCallback(
    (item) => {
      if (item.type === "photo") {
        setSelectedPhotoUri(item.uri);
        setPhotoModalVisible(true);
      } else {
        startEditReminder(item);
      }
    },
    [startEditReminder]
  );

  /* ----------------------- useMemo sort ----------------------- */
  const sortedReminders = useMemo(() => {
    const copy = [...reminders];
    copy.sort((a, b) => {
      const da = toJSDate(a.remindAt)?.getTime() ?? 0;
      const dbb = toJSDate(b.remindAt)?.getTime() ?? 0;
      return dbb - da;
    });
    return copy;
  }, [reminders]);

  const renderItem = useCallback(
    ({ item }) => (
      <ReminderItem
        item={item}
        onOpen={onOpenItem}
        onEdit={startEditReminder}
        onDelete={deleteReminder}
      />
    ),
    [onOpenItem, startEditReminder, deleteReminder]
  );

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

          {/* ✅ Primary action */}
          <AnimatedButton
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={addReminder}
            disabled={!newReminder.trim()}
          >
            Add
          </AnimatedButton>
        </View>

        {/* ✅ Primary action */}
        <AnimatedButton
          style={styles.scanButton}
          textStyle={styles.scanText}
          onPress={openCamera}
        >
          Scan (camera)
        </AnimatedButton>

        {sortedReminders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No Reminders Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start writing a reminder or scan it using your camera.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedReminders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={renderItem}
          />
        )}
      </KeyboardAvoidingView>

      {/* PHOTO VIEW MODAL (simple) */}
      <Modal visible={photoModalVisible} transparent>
        <View style={styles.photoModalBg}>
          <Image source={{ uri: selectedPhotoUri }} style={styles.fullPhoto} />

          <AnimatedButton
            style={styles.closePhotoBtn}
            textStyle={styles.closePhotoText}
            onPress={() => setPhotoModalVisible(false)}
          >
            Close
          </AnimatedButton>
        </View>
      </Modal>

      {/* ✅ CREATE / EDIT MODAL with FadeModal */}
      <FadeModal visible={showModal}>
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingReminder?.id ? "Edit Reminder" : "New Reminder"}
            </Text>

            {editingReminder?.type === "photo" && editingReminder?.uri && (
              <>
                <Image source={{ uri: editingReminder.uri }} style={styles.modalImage} />
                <TouchableOpacity onPress={changePhotoInModal} activeOpacity={0.7}>
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </>
            )}

            <TextInput
              style={styles.modalInput}
              placeholder="Reminder text..."
              value={editingReminder?.text}
              onChangeText={(txt) =>
                setEditingReminder((prev) => (prev ? { ...prev, text: txt } : prev))
              }
            />

            <Text style={styles.modalLabel}>Select date/time</Text>

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

            <AnimatedButton
              style={styles.modalBtn}
              textStyle={styles.modalBtnText}
              onPress={saveReminderFromModal}
            >
              {editingReminder?.id ? "Save Changes" : "Save Reminder"}
            </AnimatedButton>

            <AnimatedButton
              style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
              textStyle={[styles.modalBtnText, { color: "#333" }]}
              onPress={() => {
                setShowModal(false);
                setEditingReminder(null);
              }}
            >
              Cancel
            </AnimatedButton>
          </View>
        </View>
      </FadeModal>

      <Footer />
    </View>
  );
}

/* ----------------------- Styles (same as yours) ----------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F6FF" },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 20 },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 25,
    color: "#2C2C2E",
    letterSpacing: 0.5,
  },

  inputRow: { flexDirection: "row", marginBottom: 18 },

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
  buttonText: { fontWeight: "700", color: "white", fontSize: 15 },

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
  scanText: { fontWeight: "700", color: "#fff", fontSize: 16 },

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
  emptyTitle: { fontSize: 22, fontWeight: "700", color: "#2C2C2E" },
  emptySubtitle: {
    marginTop: 10,
    color: "#6E6E73",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20,
  },

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

  reminderText: { fontSize: 17, fontWeight: "600", color: "#1C1C1E" },
  dateText: { fontSize: 12, marginTop: 6, color: "#6E6E73" },

  rowActions: {
    marginLeft: 15,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  editText: { color: "#007AFF", fontWeight: "600", marginBottom: 10, fontSize: 14 },
  deleteText: { color: "#FF453A", fontSize: 22, fontWeight: "700" },

  photo: {
    width: 85,
    height: 85,
    borderRadius: 14,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },

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
  closePhotoBtn: { marginTop: 20, padding: 12, backgroundColor: "#333", borderRadius: 10 },
  closePhotoText: { color: "#fff", fontSize: 18, fontWeight: "700" },

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
  modalTitle: { fontSize: 22, fontWeight: "700", alignSelf: "center", marginBottom: 16 },

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

  modalLabel: { fontWeight: "600", fontSize: 14, marginBottom: 8, color: "#444" },

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
  modalBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  modalImage: { width: 140, height: 140, borderRadius: 16, marginBottom: 12, alignSelf: "center" },
  changePhotoText: { textAlign: "center", fontWeight: "600", color: "#007AFF", marginBottom: 12, fontSize: 14 },
});