import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SeeContentForScreen() {
  const [selected, setSelected] = useState('University');

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>See Content For</Text>
      </View>
      <View style={styles.content}>
       
        <TouchableOpacity
          style={styles.option}
          onPress={() => setSelected('University')}
        >
          <Text style={styles.optionText}>University</Text>
          {selected === 'University' ? (
            <Ionicons name="checkmark-circle" size={22} color="#007AFF" />
          ) : (
            <Ionicons name="ellipse-outline" size={22} color="#C7C7CC" />
          )}
        </TouchableOpacity>

      
        <TouchableOpacity
          style={styles.option}
          onPress={() => setSelected('High School')}
        >
          <Text style={styles.optionText}>High School</Text>
          {selected === 'High School' ? (
            <Ionicons name="checkmark-circle" size={22} color="#007AFF" />
          ) : (
            <Ionicons name="ellipse-outline" size={22} color="#C7C7CC" />
          )}
        </TouchableOpacity>
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
  content: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  optionText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
});
