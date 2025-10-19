import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/logotransparente.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topCards}>
          <TouchableOpacity style={[styles.card, { backgroundColor: '#e6dbfa' }]}>
            <MaterialCommunityIcons name="presentation-play" size={32} color="#000" />
            <Text style={styles.cardText}>Class recording</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: '#f4d9f8' }]}>
            <Ionicons name="camera-outline" size={32} color="#000" />
            <Text style={styles.cardText}>Scan Text</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.studylistSection}>
          <Text style={styles.sectionTitle}>My Studylists</Text>
          <Text style={styles.subtitle}>Tap to learn more</Text>

          <TouchableOpacity 
            style={styles.favoriteCard}
            onPress={() => router.push("/favorites")}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="bookmark-outline" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.favoriteTitle}>My favorites</Text>
              <Text style={styles.favoriteSubtitle}>Tap to learn more</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.continueSection}>
          <Text style={styles.sectionTitle}>Continue reading</Text>
          <Text style={styles.subtitle}>Login or Register to continue where you left off</Text>

          <View style={styles.placeholderRow}>
            {[1, 2, 3].map((_, i) => (
              <View key={i} style={styles.placeholderCard} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity >
          <Ionicons name="home-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/library")}>
          <MaterialCommunityIcons name="book-open-outline" size={28} color="#000"/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert('Search clicked!')}>
          <Ionicons name="search-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcff' },
  header: {
    height: 60,
    backgroundColor: '#eab8dcff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  logoImage: { width: 140, height: 80 , marginLeft:-25},
  scrollContainer: { padding: 20 },
  topCards: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cardText: { marginTop: 10, fontWeight: '600' },
  studylistSection: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#777', marginBottom: 16 },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 16,
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eab8dc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  favoriteTitle: { fontSize: 16, fontWeight: '600' },
  favoriteSubtitle: { fontSize: 13, color: '#555' },
  continueSection: { marginTop: 20 },
  placeholderRow: { flexDirection: 'row', justifyContent: 'space-between' },
  placeholderCard: {
    width: '30%',
    height: 100,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  footer: {
    height: 70,
    backgroundColor: '#eab8dcff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});
