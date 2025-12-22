import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AnimatedButton from "./AnimatedButton";

function Footer({ onHomePress, onBookPress, onReminderPress, onSearchPress }) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const go = useCallback(
    (path) => {
      if (pathname === path) router.replace(path);
      else router.push(path);
    },
    [pathname, router]
  );

  const handleHomePress = useCallback(() => {
    if (onHomePress) return onHomePress();
    go("/");
  }, [onHomePress, go]);

  const handleLibraryPress = useCallback(() => {
    if (onBookPress) return onBookPress();
    go("/library");
  }, [onBookPress, go]);

  const handleReminderPress = useCallback(() => {
    if (onReminderPress) return onReminderPress();
    go("/reminder");
  }, [onReminderPress, go]);

  const handleSearchPress = useCallback(() => {
    if (onSearchPress) return onSearchPress();
    go("/search");
  }, [onSearchPress, go]);

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
      <AnimatedButton onPress={handleHomePress} style={styles.iconBtn}>
        <Ionicons name="home-outline" size={28} color="#000" />
      </AnimatedButton>

      <AnimatedButton onPress={handleLibraryPress} style={styles.iconBtn}>
        <MaterialCommunityIcons name="book-open-outline" size={28} color="#000" />
      </AnimatedButton>

      <AnimatedButton onPress={handleReminderPress} style={styles.iconBtn}>
        <Ionicons name="notifications-outline" size={28} color="#000" />
      </AnimatedButton>

      <AnimatedButton onPress={handleSearchPress} style={styles.iconBtn}>
        <Ionicons name="search-outline" size={28} color="#000" />
      </AnimatedButton>
    </View>
  );
}

export default memo(Footer);

const styles = StyleSheet.create({
  footer: {
    minHeight: 80,
    paddingTop: 12,
    backgroundColor: "#eab8dcff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  iconBtn: {
    padding: 8,
    borderRadius: 14,
  },
});