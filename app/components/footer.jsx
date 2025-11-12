import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Footer({ onHomePress, onBookPress, onReminderPress, onSearchPress}) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleLibraryPress = () => {
    if(onBookPress) {
        onBookPress();
    } else if (pathname === '/library') {
        router.replace('/library');
    } else {
        router.push('/library');
    }
  };

  const handleReminderPress = () => {
    if(onReminderPress) {
        onReminderPress();
    } else if (pathname === '/reminder') {
        router.replace('/reminder');
    } else {
        router.push('/reminder');
    }
  };

  const handleSearchPress = () => {
    if(onSearchPress) {
        onSearchPress();
    } else if (pathname === '/search') {
        router.replace('/search');
    } else {
        router.push('/search');
    }
  };

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
      <TouchableOpacity onPress={onHomePress ? onHomePress : () => router.push("/")}>
        <Ionicons name="home-outline" size={28} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLibraryPress}>
        <MaterialCommunityIcons name="book-open-outline" size={28} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleReminderPress}>
          <Ionicons name="notifications-outline" size={28} color="#000" />
        </TouchableOpacity>

      <TouchableOpacity onPress={handleSearchPress}>
        <Ionicons name="search-outline" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 80,
    paddingTop: 18,
    backgroundColor: '#eab8dcff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});