import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Footer from '../components/footer';
import Header from '../components/header';

import { onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function App() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

    /* ✅ SCREEN ENTER ANIMATION (fade + slide) */
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(screenY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* 🔔 Toast animation */
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastScale = useRef(new Animated.Value(0.9)).current;
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    toastOpacity.setValue(0);
    toastScale.setValue(0.9);

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(toastScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setShowToast(false));
    }, 1800);
  };


    /* ✅ PRESS ANIMATIONS (scale për secilin card) */
  const scaleCard1 = useRef(new Animated.Value(1)).current; // Class recording
  const scaleCard2 = useRef(new Animated.Value(1)).current; // Scan Text
  const scaleCard3 = useRef(new Animated.Value(1)).current; // My Location
  const scaleCard4 = useRef(new Animated.Value(1)).current; // My favorites

  const pressIn = (scaleRef) =>
  Animated.spring(scaleRef, { toValue: 0.97, useNativeDriver: true }).start();
  const pressOut = (scaleRef) =>
  Animated.spring(scaleRef, { toValue: 1, useNativeDriver: true }).start();

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

    await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
    });
  };

  const toggleFavorite = async (book) => {
    if (!auth.currentUser) return;

    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", book.id);
    const isFav = favorites.some(fav => fav.id === book.id);

    try {
      if (isFav) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, book);
        triggerToast(); // ✅ animation here
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

      {/* ❤️ FAVORITE TOAST */}
      {showToast && (
        <Animated.View
          style={[
            styles.toast,
            { opacity: toastOpacity, transform: [{ scale: toastScale }] },
          ]}
        >
          <Ionicons name="heart" size={18} color="#f4d9f8" />
          <Text style={styles.toastText}> Added to favorites</Text>
        </Animated.View>
      )}

      {/* ✅ Screen animation wrapper */}
      <Animated.View
        style={{
          flex: 1,
          opacity: screenOpacity,
          transform: [{ translateY: screenY }],
        }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topCards}>
            {/* ✅ Card 1 */}
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleCard1 }] }}>
              <TouchableOpacity
                style={[styles.card, { backgroundColor: "#e6dbfa" }]}
                onPress={() => router.push("/recording")}
                onPressIn={() => pressIn(scaleCard1)}
                onPressOut={() => pressOut(scaleCard1)}
                activeOpacity={0.9}
              >
                <MaterialCommunityIcons name="presentation-play" size={32} />
                <Text style={styles.cardText}>Class recording</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* ✅ Card 2 */}
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleCard2 }] }}>
              <TouchableOpacity
                style={[styles.card, { backgroundColor: "#f4d9f8" }]}
                onPress={openCamera}
                onPressIn={() => pressIn(scaleCard2)}
                onPressOut={() => pressOut(scaleCard2)}
                activeOpacity={0.9}
              >
                <Ionicons name="camera-outline" size={32} />
                <Text style={styles.cardText}>Scan Text</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* ✅ Card 3 */}
          <Animated.View style={{ transform: [{ scale: scaleCard3 }] }}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#d9f4ec", padding: 10 }]}
              onPress={() => router.push("/MapScreen")}
              onPressIn={() => pressIn(scaleCard3)}
              onPressOut={() => pressOut(scaleCard3)}
              activeOpacity={0.9}
            >
              <Ionicons name="location-outline" size={32} />
              <Text style={styles.cardText}>My Location</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.studylistSection}>
            <Text style={styles.sectionTitle}>{"\n"}My Studylists</Text>
            <Text style={styles.subtitle}>Tap to learn more</Text>

            {/* ✅ Card 4 */}
            <Animated.View style={{ transform: [{ scale: scaleCard4 }] }}>
              <TouchableOpacity
                style={styles.favoriteCard}
                onPress={() => router.push("/favorites")}
                onPressIn={() => pressIn(scaleCard4)}
                onPressOut={() => pressOut(scaleCard4)}
                activeOpacity={0.9}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="bookmark-outline"
                    size={22}
                    color="#fff"
                  />
                </View>
                <View>
                  <Text style={styles.favoriteTitle}>My favorites</Text>
                  <Text style={styles.favoriteSubtitle}>
                    {favorites.length} saved books
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
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
                const isFavorite = favorites.some((fav) => fav.id === book.id);
                return (
                  <View key={book.id} style={styles.bookCard}>
                    <TouchableOpacity
                      testID="favorite-heart"
                      onPress={() => toggleFavorite(book)}
                      style={{ alignSelf: "flex-end", marginBottom: 4 }}
                    >
                      <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={isFavorite ? "#f4d9f8" : "black"}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Linking.openURL(book.link)}>
                      <Image source={{ uri: book.cover }} style={styles.cover} />
                    </TouchableOpacity>

                    <Text style={styles.bookTitle} numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </Animated.View>

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

  favoriteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 16,
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eab8dc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  favoriteTitle: { fontSize: 16, fontWeight: "600" },
  favoriteSubtitle: { fontSize: 13, color: "#555" },

  continueSection: { marginTop: 20 },
  bookCard: {
    width: 130,
    marginRight: 16,
    alignItems: 'center',
    backgroundColor: '#f9f3ff',
    borderRadius: 14,
    padding: 12,
  },
  cover: { width: 85, height: 125, borderRadius: 10, marginBottom: 10 },
  bookTitle: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  bookAuthor: { fontSize: 11, color: '#777', textAlign: 'center' },

  toast: {
    position: "absolute",
    top: 70,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 999,
  },
  toastText: { color: "#fff", fontWeight: "600" },
});
