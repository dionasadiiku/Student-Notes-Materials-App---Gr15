import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Footer({ onHomePress }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
      <TouchableOpacity onPress={onHomePress ? onHomePress : () => router.push("/")}>
        <Ionicons name="home-outline" size={28} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/library")}>
        <MaterialCommunityIcons name="book-open-outline" size={28} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/reminder")}>
          <Ionicons name="notifications-outline" size={28} color="#000" />
        </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/search")}>
        <Ionicons name="search-outline" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 80,
    paddingTop: 10,
    backgroundColor: '#eab8dcff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});