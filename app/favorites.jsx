import { Ionicons } from '@expo/vector-icons';
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from "../firebase";
import FavoriteModal from "./components/FavoriteModal";

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

  const openBookLink = (link) => {
    if (link) {
      Linking.openURL(link).catch(err => console.log("Failed to open link:", err));
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

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: "#666" }}>No favorites yet. Add some!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorite Books</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 16 }}
      />

      <FavoriteModal
        visible={selectedBook !== null}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfcff", paddingTop: 20 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, marginTop: 30 },
  bookCard: {
    width: 140,
    backgroundColor: "#f9f3ff",
    borderRadius: 14,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 220
  },
  bookCover: { width: 85, height: 125, borderRadius: 10, marginBottom: 10 },
  bookTitle: { fontSize: 13, fontWeight: '600', textAlign: 'center', color: '#333', marginBottom: 4 },
  bookAuthor: { fontSize: 11, color: '#777', textAlign: 'center' },
});
