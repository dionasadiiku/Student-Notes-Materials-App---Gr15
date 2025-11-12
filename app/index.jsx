import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";

export default function App() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshHome = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const books = [
    { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
    { id: "8", title: "Brave New World", author: "Aldous Huxley", cover: "https://covers.openlibrary.org/b/id/7884861-L.jpg" },
    { id: "3", title: "The Alchemist", author: "Paulo Coelho", cover: "https://covers.openlibrary.org/b/id/8235116-L.jpg" },
  ];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topCards}>
          <TouchableOpacity style={[styles.card, { backgroundColor: "#e6dbfa" }]}>
            <MaterialCommunityIcons name="presentation-play" size={32} color="#000" />
            <Text style={styles.cardText}>Class recording</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: "#f4d9f8" }]}>
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

          <View style={styles.bookRow}>
            {books.map((book) => (
              <TouchableOpacity key={book.id} style={styles.bookCard}>
                <Image source={{ uri: book.cover }} style={styles.bookCover} />
                <Text style={styles.bookTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.bookAuthor} numberOfLines={1}>
                  {book.author}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
  },
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
  bookRow: { flexDirection: "row", justifyContent: "space-between" },
  bookCard: {
    width: "30%",
    backgroundColor: "#f9f0ff",
    borderRadius: 12,
    alignItems: "center",
    padding: 8,
  },
  bookCover: { width: 70, height: 100, borderRadius: 8, marginBottom: 6 },
  bookTitle: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  bookAuthor: { fontSize: 11, color: "#555", textAlign: "center" },
});
