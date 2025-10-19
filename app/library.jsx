import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";

const Index = () => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshBook = () => {
    setRefreshKey(prev => prev + 1);
  };

  const addBook = () => {
    if (!book.trim()) return;
    setBooks([...books, { id: Date.now().toString(), title: book }]);
    setBook("");
  };

  const deleteBook = (id) => setBooks(books.filter((item) => item.id !== id));

  const renderSeparator = () => <View style={styles.separator} />;
  const renderHeader = () => <Text style={styles.listHeader}>Your Notes</Text>;
  const renderFooter = () => <Text style={styles.listFooter}>End of the library</Text>;
  const renderEmptyList = () => <Text style={styles.emptyText}>No books yet.</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Header />

      <View style={styles.content}>
        <Text style={styles.title}>Library</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={book}
            onChangeText={setBook}
            placeholder="Add a new book..."
            placeholderTextColor="black"
          />
          <TouchableOpacity onPress={addBook}>
            <View style={styles.addBtn}>
              <Text style={{ color: "black" }}>Add Books</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Link href="/tasks/23">
                <Text>{item.title}</Text>
              </Link>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => console.log("Saved:", item.title)}>
                  <Ionicons name="bookmark-outline" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteBook(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={renderSeparator}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        />
      </View>

      <Footer onBookPress={refreshBook}/>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20, textAlign: "center" },

  row: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#f3e6f9",
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  addBtn: {
    marginLeft: 10,
    backgroundColor: "#eab8dcff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  bookItem: {
    backgroundColor: "#eab8dcff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },

  separator: { height: 8 },
  listHeader: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  listFooter: { fontSize: 16, color: "#000", textAlign: "center", marginTop: 10 },
  emptyText: { fontSize: 16, color: "#999", textAlign: "center", marginTop: 30 },
});
