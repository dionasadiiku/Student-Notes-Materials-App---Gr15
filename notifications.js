import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

// (opsionale) handler global – nëse e don si e ke pas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerPushNotifications() {
  if (Platform.OS === "web") return true;

  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permission required",
      "Push notifications permission is required to receive updates."
    );
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default notifications go here",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;
}
