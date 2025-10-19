import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const mockData = [
  { id: '1', title: 'Math Notes' },
  { id: '2', title: 'Physics Lecture' },
  { id: '3', title: 'Chemistry Summary' },
  { id: '4', title: 'Programming Basics' },
];

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim() === '') {
      setFiltered([]);
    } else {
      const results = mockData.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(results);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Search</Text>
      </View>

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

      {filtered.length === 0 && query !== '' ? (
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e6f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  resultItem: {
    backgroundColor: '#f9f2ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#222',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
});
