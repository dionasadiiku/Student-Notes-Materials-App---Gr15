import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Përmbajtja */}
      <View style={styles.content}>
        <Text>Hello</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => alert('Home clicked!')}>
          <Ionicons name="home-outline" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert('Library clicked!')}>
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
    backgroundColor: '#e5d0dfff',
    justifyContent: 'space-between', // kjo bën që footer-i të shkojë në fund
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
});
