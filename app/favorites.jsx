import { Ionicons } from '@expo/vector-icons';
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from "../firebase";
import FavoriteModal from "./components/FavoriteModal";
import Footer from "./components/footer";
import Header from "./components/header";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const favRef = collection(db, "users", auth.currentUser.uid, "favorites");

    const unsubscribe = onSnapshot(favRef, (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(list);
    });

    return unsubscribe;
  }, []);

  const removeFavorite = async (bookId) => {
    if (!auth.currentUser) return;

    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", bookId);
    try {
      await deleteDoc(favRef);
    } catch (error) {
      console.log("Error removing favorite:", error);
    }
  };

  const renderBook = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => setSelectedBook(item)}
      activeOpacity={0.8}
    >
      <TouchableOpacity
        onPress={() => removeFavorite(item.id)}
        style={{ alignSelf: "flex-end", marginBottom: 4 }}
      >
        <Ionicons name="heart" size={20} color="pink" />
      </TouchableOpacity>

      <Image source={{ uri: item.cover }} style={styles.bookCover} />
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>{item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>My Favorite Books</Text>

        {/* ⭐ CASE 1 — EMPTY STATE */}
        {favorites.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="bookmark-outline" size={60} color="#8a4af3" />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Save books you love and they will appear here.
            </Text>

            <View style={styles.emptyCard}>
              <Ionicons name="bulb-outline" size={28} color="#7b3eff" />
              <Text style={styles.motivationTitle}>Discover New Stories</Text>
              <Text style={styles.motivationText}>
                Every book you save helps shape your reading journey.
                Start exploring and add your favorites!
              </Text>
            </View>
          </View>
        )}

        {/* ⭐ CASE 2 — FAVORITES EXIST */}
        {favorites.length > 0 && (
          <>
            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id}
              renderItem={renderBook}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 16 }}
            />

            {/* Motivation Card under favorites */}
            <View style={styles.motivationCard}>
              <Ionicons name="sparkles-outline" size={28} color="#7b3eff" />
              <Text style={styles.motivationTitle}>Keep Growing 📚</Text>
              <Text style={styles.motivationText}>
                Every page you read brings you closer to the best version of yourself.
                Stay curious, stay inspired.
              </Text>
            </View>
          </>
        )}
      </View>

      <FavoriteModal
        visible={selectedBook !== null}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfcff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  bookCard: {
    width: 140,
    backgroundColor: "#f9f3ff",
    borderRadius: 14,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    height: 220
  },
  bookCover: { width: 85, height: 125, borderRadius: 10, marginBottom: 10 },
  bookTitle: { fontSize: 13, fontWeight: "600", textAlign: "center", color: '#333' },
  bookAuthor: { fontSize: 11, color: '#777', textAlign: "center" },

  emptyState: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  emptyCard: {
    marginTop: 100,
    backgroundColor: "#efe4ff",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },

  motivationCard: {
    marginTop: 20,
    backgroundColor: "#efe4ff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    marginBottom: 100,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4a1ca4",
    marginTop: 10
  },
  motivationText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#4f4f4f"
  }
});