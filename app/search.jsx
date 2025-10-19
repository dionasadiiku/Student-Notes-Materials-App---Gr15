import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";

const mockData = [
  { id: "1", title: "Math Notes" },
  { id: "2", title: "Physics Lecture" },
  { id: "3", title: "Chemistry Summary" },
  { id: "4", title: "Programming Basics" },
];

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshSearch = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim() === "") {
      setFiltered([]);
    } else {
      const results = mockData.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(results);
    }
  };

  const onSearchPress = () => {
    handleSearch(query);
  };

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
              onChangeText={setQuery}
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {query !== "" && filtered.length === 0 ? (
          <Text style={styles.noResults}>No results found</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem}>
                <Text style={styles.resultText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      <Footer onSearchPress={refreshSearch}/>
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
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchButtonText: { fontSize: 16, fontWeight: "600", color: "#000" },

  resultItem: {
    backgroundColor: "#eab8dcff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  resultText: { fontSize: 16, fontWeight: "500", color: "#1C1C1E" },

  noResults: { textAlign: "center", marginTop: 30, fontSize: 16, color: "#999" },
});