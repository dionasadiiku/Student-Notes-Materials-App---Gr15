import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FavoriteModal from "../components/FavoriteModal";
import Footer from "../components/footer";
import Header from "../components/header";
import { auth, db } from "../firebase";

/* -------------------------------------------------------
   ✅ FavoriteCard (memoized) + “breaking heart” animation
-------------------------------------------------------- */
const FavoriteCard = memo(function FavoriteCard({ item, onOpen, onRemove }) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [broken, setBroken] = useState(false);

  const shake = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-12deg", "12deg"],
  });

  const playRemoveAnimation = useCallback(() => {
    // reset
    setBroken(false);
    opacity.setValue(1);
    scale.setValue(1);
    rotate.setValue(0);

    // make it "break" during the animation
    const t = setTimeout(() => setBroken(true), 140);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.25,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.0,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(rotate, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      clearTimeout(t);
      onRemove(item.id);
    });
  }, [item.id, onRemove, opacity, rotate, scale]);

  const coverUri = item.cover || item.image || item.uri || null;

  return (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => onOpen(item)}
      activeOpacity={0.85}
    >
      {/* ❤️ Remove with “breaking heart” animation */}
      <TouchableOpacity
        onPress={playRemoveAnimation}
        style={styles.heartWrap}
        activeOpacity={0.9}
      >
        <Animated.View style={{ opacity, transform: [{ scale }, { rotate: shake }] }}>
          {broken ? (
            <MaterialCommunityIcons name="heart-broken" size={20} color="#ff4d6d" />
          ) : (
            <Ionicons name="heart" size={20} color="#ff4d6d" />
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Cover */}
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.bookCover} fadeDuration={180} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Ionicons name="image-outline" size={24} color="#666" />
          <Text style={styles.placeholderText}>No cover</Text>
        </View>
      )}

      <Text style={styles.bookTitle} numberOfLines={2}>
        {item.title || "Untitled"}
      </Text>
      <Text style={styles.bookAuthor} numberOfLines={1}>
        {item.author || "Unknown author"}
      </Text>
    </TouchableOpacity>
  );
});

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  // ✅ Load favorites from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;

    const favRef = collection(db, "users", auth.currentUser.uid, "favorites");
    const unsubscribe = onSnapshot(favRef, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFavorites(list);
    });

    return unsubscribe;
  }, []);

  // ✅ Remove favorite (called AFTER animation finishes)
  const removeFavorite = useCallback(
    async (bookId) => {
      if (!auth.currentUser) return;

      const favRef = doc(db, "users", auth.currentUser.uid, "favorites", bookId);
      try {
        await deleteDoc(favRef);
        if (selectedBook?.id === bookId) setSelectedBook(null);
      } catch (error) {
        console.log("Error removing favorite:", error);
      }
    },
    [selectedBook?.id]
  );

  // ✅ Labels
  const favoritesCountLabel = useMemo(() => {
    const n = favorites.length;
    return n === 1 ? "1 saved book" : `${n} saved books`;
  }, [favorites.length]);

  const openDetails = useCallback((book) => setSelectedBook(book), []);
  const closeDetails = useCallback(() => setSelectedBook(null), []);

  const keyExtractor = useCallback((item) => item.id, []);
  const renderItem = useCallback(
    ({ item }) => <FavoriteCard item={item} onOpen={openDetails} onRemove={removeFavorite} />,
    [openDetails, removeFavorite]
  );

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>My Favorite Books</Text>
        <Text style={styles.subtitle}>{favoritesCountLabel}</Text>

        {favorites.length === 0 ? (
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
                Every book you save helps shape your reading journey. Start exploring and add your favorites!
              </Text>
            </View>
          </View>
        ) : (
          <>
            <FlatList
              data={favorites}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              // perf tweaks
              removeClippedSubviews
              initialNumToRender={6}
              windowSize={7}
              maxToRenderPerBatch={6}
              updateCellsBatchingPeriod={50}
              getItemLayout={(_, index) => ({
                length: 156,
                offset: 156 * index,
                index,
              })}
            />

            <View style={styles.motivationCard}>
              <Ionicons name="sparkles-outline" size={28} color="#7b3eff" />
              <Text style={styles.motivationTitle}>Keep Growing 📚</Text>
              <Text style={styles.motivationText}>
                Every page you read brings you closer to the best version of yourself. Stay curious, stay inspired.
              </Text>
            </View>
          </>
        )}
      </View>

      <FavoriteModal visible={!!selectedBook} book={selectedBook} onClose={closeDetails} />

      <Footer />
    </View>
  );
}

export default memo(Favorites);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfcff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  title: { fontSize: 26, fontWeight: "700", textAlign: "center" },
  subtitle: { marginTop: 6, textAlign: "center", color: "#777", marginBottom: 14 },

  listContent: { paddingVertical: 10, paddingHorizontal: 16 },

  bookCard: {
    width: 140,
    backgroundColor: "#f9f3ff",
    borderRadius: 14,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    height: 220,
  },

  heartWrap: { alignSelf: "flex-end", marginBottom: 6 },

  bookCover: { width: 85, height: 125, borderRadius: 10, marginBottom: 10 },
  coverPlaceholder: {
    width: 85,
    height: 125,
    borderRadius: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 6,
  },
  placeholderText: { fontSize: 10, color: "#666" },

  bookTitle: { fontSize: 13, fontWeight: "600", textAlign: "center", color: "#333" },
  bookAuthor: { fontSize: 11, color: "#777", textAlign: "center" },

  emptyState: { flex: 1, alignItems: "center", marginTop: 40 },
  emptyTitle: { marginTop: 12, fontSize: 22, fontWeight: "700", color: "#333" },
  emptyText: { marginTop: 6, fontSize: 15, color: "#555", textAlign: "center", paddingHorizontal: 20 },

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

  motivationTitle: { fontSize: 20, fontWeight: "700", color: "#4a1ca4", marginTop: 10 },
  motivationText: { marginTop: 8, fontSize: 14, textAlign: "center", color: "#4f4f4f" },
});