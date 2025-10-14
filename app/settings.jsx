import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const settingsItems = [
  { id: '1', title: 'See content for', value: 'University' },
  { id: '2', title: 'Terms of use' },
  { id: '3', title: 'Privacy policy' },
  { id: '4', title: 'Contact us' },
  { id: '5', title: 'Give feedback' },
];

export default function SettingsScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>{item.title}</Text>
      <View style={styles.rightContainer}>
        {item.value && <Text style={styles.valueText}>{item.value}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#A0A5AA" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <FlatList
        data={settingsItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Text style={styles.version}>Version: 7.9.3.5583</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  header: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  itemText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  version: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 40,
  },
});
