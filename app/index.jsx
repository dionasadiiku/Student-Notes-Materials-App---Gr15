import { Ionicons } from '@expo/vector-icons'; // për ikonat (expo install @expo/vector-icons)
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

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


      



    

      {/* Përmbajtja e app */}
      <View style={styles.content}>
        {/* Këtu vendos përmbajtjen e app */}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfc1d7ff',
  },
  header: {
    height: 60,
    backgroundColor: '#dfc1d7ff',
    flexDirection: 'row', // logo dhe ikonë në një rresht
    alignItems: 'center', // qendër horizontalisht
    justifyContent: 'space-between', // logo në të majtë, settings në të djathtë
    paddingHorizontal: 15,
    shadowColor: "#000", // hije për iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5, // hije për Android
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
   logoContainer: { flexDirection: 'row', alignItems: 'center' },
   logoImage: { width: 150, height: 100, borderRadius: 15, marginRight: 8 },
 


});
