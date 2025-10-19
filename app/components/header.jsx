import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Header() {
  const router = useRouter();
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    async function loadLogo() {
      await Asset.loadAsync(require("../../assets/images/logotransparente.png"));
      setLogoReady(true);
    }
    loadLogo();
  }, []);

  return (
    <View style={styles.header}>
      {logoReady && (
        <Image
          source={require("../../assets/images/logotransparente.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      )}
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <Ionicons name="settings-outline" size={26} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#eab8dcff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  logoImage: { width: 140, height: 80, marginLeft: -25 },
});