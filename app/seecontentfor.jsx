import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function SeeContentForScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>See Content For</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.text}>Welcome to the See Content For page!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcff' },
  header: {
    height: 60,
    backgroundColor: '#eab8dcff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, color: '#1C1C1E', textAlign: 'center' },
});
