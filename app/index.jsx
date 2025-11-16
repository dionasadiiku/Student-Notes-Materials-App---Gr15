import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from './components/footer';
import Header from './components/header';

import { onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function App() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        const favRef = collection(db, "users", user.uid, "favorites");
        const unsubFav = onSnapshot(favRef, (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setFavorites(list);
        });

        return () => unsubFav();
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (currentUser === null) {
      setTimeout(() => {
        if (!auth.currentUser) router.replace("/login");
      }, 300);
    }
  }, [currentUser]);

  const refreshHome = () => setRefreshKey((prev) => prev + 1);

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      alert("Photo captured successfully!");
      console.log(result.assets[0].uri);
    }
  };

  const toggleFavorite = async (book) => {
    if (!auth.currentUser) {
      alert("You must log in to save favorites.");
      return;
    }

    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", book.id);
    const isFav = favorites.some(fav => fav.id === book.id);

    try {
      if (isFav) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, book);
      }
    } catch (error) {
      console.log("Error updating favorites:", error);
    }
  };

  const books = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
      link: "https://openlibrary.org/works/OL45883W/The_Great_Gatsby"
    },
    {
      id: "2",
      title: "Brave New World",
      author: "Aldous Huxley",
      cover: "https://covers.openlibrary.org/b/id/7884861-L.jpg",
      link: "https://openlibrary.org/works/OL116799W/Brave_New_World"
    },
    {
      id: "3",
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "https://covers.openlibrary.org/b/id/8235116-L.jpg",
      link: "https://openlibrary.org/works/OL45804W/The_Alchemist"
    }
  ];

  const sortedBooks = [...books].sort((a, b) => {
    const aFav = favorites.some(fav => fav.id === a.id);
    const bFav = favorites.some(fav => fav.id === b.id);
    return aFav === bFav ? 0 : aFav ? -1 : 1;
  });

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Top cards */}
        <View style={styles.topCards}>
           <TouchableOpacity
            style={[styles.card, { backgroundColor: "#e6dbfa" }]}
            onPress={() => router.push("/recording")}
          >
            <MaterialCommunityIcons name="presentation-play" size={32} color="#000" />
            <Text style={styles.cardText}>Class recording</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: '#f4d9f8' }]} onPress={openCamera}>
            <Ionicons name="camera-outline" size={32} color="#000" />
            <Text style={styles.cardText}>Scan Text</Text>
          </TouchableOpacity>
        </View>

        {/* Favorites card */}
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
              <Text style={styles.favoriteSubtitle}>{favorites.length} saved books</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.continueSection}>
          <Text style={styles.sectionTitle}>Continue reading</Text>
          <Text style={styles.subtitle}>
            {currentUser
              ? "Continue where you left off"
              : "Login or Register to continue where you left off"}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
            {sortedBooks.map((book) => {
              const isFavorite = favorites.some(fav => fav.id === book.id);
              return (
                <View
                  key={book.id}
                  style={{
                    width: 130,
                    marginRight: 16,
                    alignItems: 'center',
                    backgroundColor: '#f9f3ff',
                    borderRadius: 14,
                    padding: 12,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => toggleFavorite(book)}
                    style={{ alignSelf: "flex-end", marginBottom: 4 }}
                  >
                    <Ionicons
                      name={isFavorite ? "heart" : "heart-outline"}
                      size={20}
                      color={isFavorite ? "pink" : "black"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => Linking.openURL(book.link)}>
                    <Image
                      source={{ uri: book.cover }}
                      style={{ width: 85, height: 125, borderRadius: 10, marginBottom: 10 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <Text style={{ fontSize: 13, fontWeight: '600', textAlign: 'center', color: '#333', marginBottom: 4 }} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#777', textAlign: 'center' }}>
                    {book.author}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

      </ScrollView>
      <Footer onHomePress={refreshHome} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfcff" },
  scrollContainer: { padding: 20 },
  topCards: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: { flex: 1, borderRadius: 16, padding: 15, alignItems: "center", marginHorizontal: 5 },
  cardText: { marginTop: 10, fontWeight: "600" },
  studylistSection: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#777", marginBottom: 16 },
  favoriteCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#f4f4f4", borderRadius: 16, padding: 16 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#eab8dc", alignItems: "center", justifyContent: "center", marginRight: 10 },
  favoriteTitle: { fontSize: 16, fontWeight: "600" },
  favoriteSubtitle: { fontSize: 13, color: "#555" },
  continueSection: { marginTop: 20 },
});