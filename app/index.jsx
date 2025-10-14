import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function App() {

   const router = useRouter();



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logotransparente.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity onPress={() => alert('Settings clicked!')}>
          <Ionicons name="settings-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* <Text style={styles.sectionTitle}>My Studylist</Text>
        <Text style={styles.subtitle}>Tap to learn more</Text> */}

        <TouchableOpacity 
          style={styles.favoriteCard}
          onPress={() => alert('My Favorites clicked!')}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="bookmark-outline" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.favoriteTitle}>My favorites</Text>
            <Text style={styles.favoriteSubtitle}>Tap to learn more</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => alert('Home clicked!')}>
          <Ionicons name="home-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/library")}>
          <MaterialCommunityIcons name="book-open-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert('Search clicked!')}>
          <Ionicons name="search-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcff',
    justifyContent: 'space-between',
  },
  header: {
    height: 60,
    backgroundColor: '#e5d0dfff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  footer: {
    height: 60,
    backgroundColor: '#e5d0dfff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 150, height: 100, borderRadius: 15, marginRight: 8 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fde4cf',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ff8fab',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteSubtitle: {
    fontSize: 13,
    color: '#555',
  },
});
