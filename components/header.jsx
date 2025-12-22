import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { usePathname, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { memo, useCallback, useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";

import { auth } from "../firebase";
import AnimatedButton from "./AnimatedButton";

function Header({ onSettingsPress }) {
  const router = useRouter();
  const pathname = usePathname();
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await Asset.loadAsync(require("../assets/images/logotransparente.png"));
        if (mounted) setLogoReady(true);
      } catch (e) {
        console.log("Logo load error:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSettings = useCallback(() => {
    if (onSettingsPress) return onSettingsPress();

    if (pathname === "/settings") router.replace("/settings");
    else router.push("/settings");
  }, [onSettingsPress, pathname, router]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  }, [router]);

  return (
    <View style={styles.header}>
      {logoReady ? (
        <Image
          source={require("../assets/images/logotransparente.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      ) : (
        // placeholder so the layout doesn't jump
        <View style={styles.logoPlaceholder} />
      )}

      <View style={styles.iconContainer}>
        <AnimatedButton onPress={handleLogout} style={styles.iconBtn} testID="logout-btn">
          <Ionicons name="log-out-outline" size={30} color="#000" />
        </AnimatedButton>

        <AnimatedButton onPress={handleSettings} style={styles.iconBtn} testID="settings-btn">
          <Ionicons name="settings-outline" size={28} color="#000" />
        </AnimatedButton>
      </View>
    </View>
  );
}

export default memo(Header);

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#eab8dcff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  logoImage: { width: 160, height: 100, marginLeft: -25 },

  // placeholder so layout doesn't jump while loading
  logoPlaceholder: { width: 160, height: 40, marginLeft: -25 },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 14,
  },
});