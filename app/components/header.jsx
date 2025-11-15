import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { usePathname, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase";

export default function Header({ onSettingsPress }) {
  const router = useRouter();
  const pathname = usePathname();
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    async function loadLogo() {
      await Asset.loadAsync(require("../../assets/images/logotransparente.png"));
      setLogoReady(true);
    }
    loadLogo();
  }, []);

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else if (pathname === "/settings") {
      router.replace("/settings");
    } else {
      router.push("/settings");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <View style={styles.header}>
      {logoReady && (
        <Image
          source={require("../../assets/images/logotransparente.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      )}

      <View style={styles.iconContainer}>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={30} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    backgroundColor: "#eab8dcff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24, 
  },
  logoImage: { width: 160, height: 100, marginLeft: -25 },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  logoutBtn: {
    marginRight: 5,
  },
});
