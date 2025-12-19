import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

/* ----------------------------------------------------
   🔔 GLOBAL NOTIFICATION HANDLER
---------------------------------------------------- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/* ----------------------------------------------------
   1️⃣ REGISTER PERMISSIONS (thirret 1 her)
---------------------------------------------------- */
export async function registerForNotifications() {
  if (Platform.OS === "web") return true;

  const { status } = await Notifications.getPermissionsAsync();
  let finalStatus = status;

  if (status !== "granted") {
    const request = await Notifications.requestPermissionsAsync();
    finalStatus = request.status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Notifications permission not granted");
    return false;
  }

  // ANDROID CHANNEL (e domosdoshme)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return true;
}

/* ----------------------------------------------------
   🧱 ENSURE USER DOCUMENT EXISTS (SHUMË E RËNDËSISHME)
---------------------------------------------------- */
async function ensureUserDocument() {
  if (!auth.currentUser) return;

  const userRef = doc(db, "users", auth.currentUser.uid);

  // merge:true → nuk fshin asgjë ekzistuese
  await setDoc(
    userRef,
    {
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/* ----------------------------------------------------
   2️⃣ LOCAL NOTIFICATION (instant)
---------------------------------------------------- */
export async function sendLocalNotification(title, body) {
  if (Platform.OS === "web") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, // immediate
  });
}

/* ----------------------------------------------------
   3️⃣ SAVE NOTIFICATION TO FIRESTORE
---------------------------------------------------- */
export async function saveNotificationToFirestore(data) {
  if (!auth.currentUser) return;

  // ⚠️ KJO E ZGJIDH PROBLEMIN QË KISHE
  await ensureUserDocument();

  await addDoc(
    collection(db, "users", auth.currentUser.uid, "notifications"),
    {
      ...data,
      createdAt: serverTimestamp(),
      read: false,
    }
  );
}
