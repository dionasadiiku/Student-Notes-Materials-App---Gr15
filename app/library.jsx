import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";

const Index = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshBook = () => {
    setRefreshKey(prev => prev + 1);
  };

  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: task }]);
    setTask("");
  };

  const deleteTask = (id) => setTasks(tasks.filter((item) => item.id !== id));

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
            value={task}
            onChangeText={setTask}
            placeholder="Add a new book..."
            placeholderTextColor="black"
          />
          <TouchableOpacity onPress={addTask}>
            <View style={styles.addBtn}>
              <Text style={{ color: "black" }}>Add Books</Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Link href="/tasks/23">
                <Text>{item.title}</Text>
              </Link>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => console.log("Saved:", item.title)}>
                  <Ionicons name="bookmark-outline" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
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
  content: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  row: { flexDirection: "row", marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, height: 50, backgroundColor: "#f3e6f9", borderColor: "black", paddingHorizontal: 10 },
  addBtn: { borderWidth: 1, backgroundColor: "#eab8dcff", paddingHorizontal: 16, marginLeft: 8, height: 50, justifyContent: "center", borderRadius: 8, borderColor: "black" },
  taskItem: { borderWidth: 1, backgroundColor: "#eab8dcff", borderRadius: 8, padding: 15, borderColor: "black", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  separator: { height: 8 },
  listHeader: { fontSize: 24, fontWeight: "400", marginBottom: 10 },
  listFooter: { marginTop: 10, color: "black", fontSize: 18, textAlign: "center" },
  emptyText: { fontSize: 16, color: "gray", marginTop: 10, textAlign: "center" },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
});