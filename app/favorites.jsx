import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const books = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg' },
  { id: '2', title: '1984', author: 'George Orwell', cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg' },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: 'https://covers.openlibrary.org/b/id/8225265-L.jpg' },
  { id: '4', title: 'Moby Dick', author: 'Herman Melville', cover: 'https://covers.openlibrary.org/b/id/5552222-L.jpg' },
  { id: '5', title: 'Pride and Prejudice', author: 'Jane Austen', cover: 'https://covers.openlibrary.org/b/id/8091016-L.jpg' },
  { id: '6', title: 'The Catcher in the Rye', author: 'J.D. Salinger', cover: 'https://covers.openlibrary.org/b/id/8231996-L.jpg' },
  { id: '7', title: 'The Hobbit', author: 'J.R.R. Tolkien', cover: 'https://covers.openlibrary.org/b/id/6979861-L.jpg' },
  { id: '8', title: 'Brave New World', author: 'Aldous Huxley', cover: 'https://covers.openlibrary.org/b/id/7884861-L.jpg' },
  { id: '9', title: 'The Alchemist', author: 'Paulo Coelho', cover: 'https://covers.openlibrary.org/b/id/8235116-L.jpg' },
  { id: '10', title: 'Harry Potter and the Sorcerer’s Stone', author: 'J.K. Rowling', cover: 'https://covers.openlibrary.org/b/id/7984916-L.jpg' },
];

export default function Favorites() {
  const renderBook = ({ item }) => (
    <TouchableOpacity style={styles.bookCard}>
      <Image source={{ uri: item.cover }} style={styles.coverImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorite Books</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        contentContainerStyle={styles.list}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 16,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f0ff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  coverImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  author: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
