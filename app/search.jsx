import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useRouter } from "expo-router";
import { useState, useEffect, useCallback, useMemo } from "react"; // NEW
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Linking,
  ActivityIndicator,
  Animated, // NEW
} from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";

const mockData = [
  { id: "1", title: "Math Notes" },
  { id: "2", title: "Physics Lecture" },
  { id: "3", title: "Chemistry Summary" },
  { id: "4", title: "Programming Basics" },
];

// NEW – Memoized item for FlatList
const ResultItem = React.memo(({ item }) => {
  return (
    <Animated.View 
      style={{ opacity: 1 }}
    >
      <TouchableOpacity style={styles.resultItem} activeOpacity={0.6}>
        <Text style={styles.resultText}>{item.title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [booksError, setBooksError] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const refreshSearch = () => setRefreshKey((p) => p + 1);

  // NEW — useCallback për performancë
  const handleSearch = useCallback((text) => {
    setQuery(text);
    if (text.trim() === "") {
      setFiltered([]);
    } else {
      const results = mockData.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(results);
    }
  }, []);

  const onSearchPress = () => {
    handleSearch(query);
  };

  // Fetch Recommended Books
  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      setLoadingBooks(true);
      setBooksError(null);
      try {
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=subject:education&maxResults=8"
        );
        const data = await response.json();
        setRecommendedBooks(data.items || []);
      } catch (error) {
        setBooksError("Could not load recommended books");
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchRecommendedBooks();
  }, []);

  const openBookLink = async (url) => {
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch {}
  };

  // NEW — Memoize recommended items
  const renderRecommendedItem = useCallback(({ item }) => {
    const thumbnail = item.volumeInfo.imageLinks?.thumbnail
      ? item.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, "https://")
      : null;

    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => openBookLink(item.volumeInfo.infoLink)}
        activeOpacity={0.7} // fade effect
      >
        <View style={styles.bookImageWrap}>
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={styles.bookImage}
              loading="lazy"      // NEW lazy loading
            />
          ) : (
            <View style={styles.bookImagePlaceholder}>
              <Text style={{ color: "#666", fontSize: 12 }}>No cover</Text>
            </View>
          )}
        </View>

        <Text numberOfLines={2} style={styles.bookTitle}>
          {item.volumeInfo.title}
        </Text>

        <Text numberOfLines={1} style={styles.bookAuthors}>
          {item.volumeInfo.authors?.join(", ") ?? "Unknown"}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  // NEW — useMemo për filtered results (jo prej mockData)
  const filteredResults = useMemo(() => filtered, [filtered]);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.6} // fade
          >
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Search</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={22} color="#555" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Search notes, materials..."
              placeholderTextColor="#999"
              value={query}
              onChangeText={handleSearch}
            />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={onSearchPress}
            activeOpacity={0.6} // fade
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {query !== "" && filteredResults.length === 0 ? (
          <Text style={styles.noResults}>No results found</Text>
        ) : (
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ResultItem item={item} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* Recommended Books */}
        <View style={{ marginTop: 10 }}>
          <View style={styles.booksHeader}>
            <Text style={styles.booksTitle}>Recommended Books</Text>
            {loadingBooks && <ActivityIndicator size="small" />}
          </View>

          {booksError ? (
            <Text style={{ color: "red", marginBottom: 8 }}>{booksError}</Text>
          ) : (
            <FlatList
              data={recommendedBooks}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderRecommendedItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>

      <Footer onSearchPress={refreshSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backButton: { marginRight: 12, padding: 6 },
  screenTitle: { fontSize: 24, fontWeight: "700" },

  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },

  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3e6f9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  input: { flex: 1, fontSize: 16, color: "#000" },

  searchButton: {
    marginLeft: 10,
    backgroundColor: "#eab8dcff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  searchButtonText: { fontSize: 16, fontWeight: "600", color: "#000" },

  resultItem: {
    backgroundColor: "#eab8dcff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  resultText: { fontSize: 16, fontWeight: "500", color: "#1C1C1E" },

  noResults: { textAlign: "center", marginTop: 30, fontSize: 16, color: "#999" },

  booksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  booksTitle: { fontSize: 18, fontWeight: "700" },

  bookCard: { marginRight: 12, width: 140 },
  bookImageWrap: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0eef6",
  },
  bookImage: { width: "100%", height: "100%" },
  bookImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bookTitle: { marginTop: 8, fontWeight: "500", fontSize: 14 },
  bookAuthors: { fontSize: 12, color: "#555" },
});
