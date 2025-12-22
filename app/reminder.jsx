import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

import AnimatedButton from "../components/AnimatedButton";
import FadeModal from "../components/FadeModal";
import Footer from "../components/footer";
import Header from "../components/header";

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
  if (val?.toDate) return val.toDate();
  if (val instanceof Date) return val;
  return null;
};

const formatAnyDate = (val) => {
  const d = toJSDate(val);
  return d ? d.toLocaleString() : "";
};

/* ----------------------- Memoized Item ----------------------- */
const ReminderCard = React.memo(function ReminderCard({ item, onOpen, onEdit, onDelete }) {
  const isPhoto = item.type === "photo";

  return (
    <TouchableOpacity onPress={() => onOpen(item)} activeOpacity={0.7} style={styles.card}>
      <View style={styles.cardRow}>
        {/* Left content */}
        <View style={{ flex: 1 }}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.typePill}>
              <Text style={styles.typePillText}>{isPhoto ? "PHOTO" : "TEXT"}</Text>
            </View>

            {!!item.remindAt && (
              <View style={styles.timePill}>
                <Ionicons name="time-outline" size={14} color="#000" />
                <Text style={styles.timePillText}>{formatAnyDate(item.remindAt)}</Text>
              </View>
            )}
          </View>

          {isPhoto ? (
            <View style={{ marginTop: 10 }}>
              <Image source={{ uri: item.uri }} style={styles.cardPhoto} />
              {!!item.text && <Text style={styles.cardTitle}>{item.text}</Text>}
            </View>
          ) : (
            <Text style={[styles.cardTitle, { marginTop: 10 }]} numberOfLines={3}>
              {item.text}
            </Text>
          )}

          <Text style={styles.cardMeta}>Created: {formatAnyDate(item.createdAt)}</Text>
        </View>

        {/* Right actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => onEdit(item)} activeOpacity={0.7} style={styles.actionBtn}>
            <Ionicons name="create-outline" size={18} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(item.id)} activeOpacity={0.7} style={[styles.actionBtn, styles.deleteBtn]}>
            <Ionicons name="trash-outline" size={18} color="#000" />
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

  const [loading, setLoading] = useState(true);

  /* ----------------------- Load reminders ----------------------- */
  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const ref = collection(db, "users", user.uid, "reminders");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setReminders(list);
      setLoading(false);
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

      await setDoc(doc(db, "users", user.uid), { createdAt: serverTimestamp() }, { merge: true });

      await addDoc(collection(db, "users", user.uid, "notifications"), {
        ...data,
        createdAt: serverTimestamp(),
        read: false,
      });
    },
    [user?.uid]
  );

  /* ----------------------- Open create modal from text ----------------------- */
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

    if (Platform.OS !== "web" && tempDate.getTime() <= Date.now()) {
      Alert.alert("Invalid time", "Please select a future date/time.");
      return;
    }

    try {
      if (editingReminder.notificationId && Platform.OS !== "web") {
        await Notifications.cancelScheduledNotificationAsync(editingReminder.notificationId);
      }

      const newNotificationId = await scheduleNotification(editingReminder.text, tempDate);

      const data = {
        type: editingReminder.type,
        text: editingReminder.text,
        uri: editingReminder.uri || null,
        remindAt: tempDate,
        notificationId: newNotificationId || null,
      };

      if (!editingReminder.id) {
        const docRef = await addDoc(collection(db, "users", user.uid, "reminders"), {
          ...data,
          createdAt: serverTimestamp(),
        });

        await saveNotificationToSubcollection({
          type: "reminder",
          title: "Reminder scheduled",
          message: editingReminder.text || "Reminder",
          reminderId: docRef.id,
          notificationId: newNotificationId || null,
          scheduledAt: tempDate,
        });
      } else {
        await updateDoc(doc(db, "users", user.uid, "reminders", editingReminder.id), data);

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
  }, [user?.uid, editingReminder, tempDate, scheduleNotification, saveNotificationToSubcollection]);

  /* ----------------------- Change photo inside modal ----------------------- */
  const changePhotoInModal = useCallback(async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (!result.canceled) {
      setEditingReminder((prev) => (prev ? { ...prev, uri: result.assets[0].uri, type: "photo" } : prev));
    }
  }, []);

  /* ----------------------- Open item ----------------------- */
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
      <ReminderCard item={item} onOpen={onOpenItem} onEdit={startEditReminder} onDelete={deleteReminder} />
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
        {/* Top bar like Search */}
        <View style={styles.topBar}>
          {/* //<Ionicons name="notifications-outline" size={24} color="#000" /> */}
          <Text style={styles.screenTitle}>Reminders</Text>
        </View>

        {/* Search-style input row */}
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <Ionicons name="create-outline" size={20} color="#555" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Write your reminder..."
              placeholderTextColor="#999"
              style={styles.input}
              value={newReminder}
              onChangeText={setNewReminder}
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, !newReminder.trim() && { opacity: 0.55 }]}
            onPress={addReminder}
            activeOpacity={0.7}
            disabled={!newReminder.trim()}
          >
            <Text style={styles.primaryBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Scan button like Search style */}
        <TouchableOpacity style={styles.secondaryBtn} onPress={openCamera} activeOpacity={0.7}>
          <Ionicons name="camera-outline" size={20} color="#000" />
          <Text style={styles.secondaryBtnText}>Scan (camera)</Text>
        </TouchableOpacity>

        {/* List */}
        {loading ? (
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: "#777" }}>Loading reminders...</Text>
          </View>
        ) : sortedReminders.length === 0 ? (
          <Text style={styles.noResults}>No reminders yet</Text>
        ) : (
          <FlatList
            data={sortedReminders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>

      {/* PHOTO VIEW MODAL */}
      <Modal visible={photoModalVisible} transparent>
        <View style={styles.photoModalBg}>
          <Image source={{ uri: selectedPhotoUri }} style={styles.fullPhoto} />
          <TouchableOpacity style={styles.closePhotoBtn} onPress={() => setPhotoModalVisible(false)} activeOpacity={0.7}>
            <Text style={styles.closePhotoText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* CREATE / EDIT MODAL */}
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
                  <Text style={styles.linkText}>Change Photo</Text>
                </TouchableOpacity>
              </>
            )}

            <TextInput
              style={styles.modalInput}
              placeholder="Reminder text..."
              placeholderTextColor="#999"
              value={editingReminder?.text}
              onChangeText={(txt) =>
                setEditingReminder((prev) => (prev ? { ...prev, text: txt } : prev))
              }
            />

            <Text style={styles.modalLabel}>Select date/time</Text>

            {Platform.OS !== "web" ? (
              <DateTimePicker value={tempDate} mode="datetime" onChange={(e, d) => d && setTempDate(d)} />
            ) : (
              <Text style={{ marginBottom: 10, color: "#888" }}>
                Date/time picker not supported on Web
              </Text>
            )}

            <AnimatedButton style={styles.modalBtn} textStyle={styles.modalBtnText} onPress={saveReminderFromModal}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  // Like Search
  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 },
  screenTitle: {
  fontSize: 24,
  fontWeight: "700",
  color: "#000",
  textAlign: "center",
  flex: 1,
},

  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },

  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e6f9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  input: { flex: 1, fontSize: 16, color: "#000" },

  primaryBtn: {
    marginLeft: 10,
    backgroundColor: "#eab8dcff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "600", color: "#000" },

  secondaryBtn: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#eab8dcff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
    elevation: 2,
    marginBottom: 12,
  },
  secondaryBtnText: { fontSize: 16, fontWeight: "600", color: "#000" },

  noResults: { textAlign: "center", marginTop: 30, fontSize: 16, color: "#999" },

  // Card like Search result item
  card: {
    backgroundColor: "#eab8dcff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "stretch", gap: 12 },

  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },

  typePill: {
    backgroundColor: "rgba(255,255,255,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  typePillText: { fontSize: 12, fontWeight: "700", color: "#000" },

  timePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  timePillText: { fontSize: 12, fontWeight: "600", color: "#000" },

  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1C1C1E" },
  cardMeta: { marginTop: 10, fontSize: 12, color: "#333" },

  cardPhoto: { width: "100%", height: 170, borderRadius: 12, marginBottom: 10 },

  cardActions: { justifyContent: "space-between" },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: { marginTop: 10 },

  // Photo modal
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#eab8dcff",
    borderRadius: 16,
  },
  closePhotoText: { color: "#000", fontSize: 16, fontWeight: "700" },

  // Modal
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
    backgroundColor: "#f3e6f9",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    color: "#000",
  },

  linkText: { textAlign: "center", fontWeight: "600", color: "#007AFF", marginBottom: 12, fontSize: 14 },

  modalLabel: { fontWeight: "600", fontSize: 14, marginBottom: 8, color: "#444" },

  modalBtn: {
    backgroundColor: "#eab8dcff",
    width: "100%",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
    elevation: 2,
  },
  modalBtnText: { color: "#000", fontSize: 16, fontWeight: "700" },

  modalImage: { width: 160, height: 160, borderRadius: 16, marginBottom: 12, alignSelf: "center" },
});