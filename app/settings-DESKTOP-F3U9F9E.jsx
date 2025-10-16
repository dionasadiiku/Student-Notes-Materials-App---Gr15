import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const settingsItems = [
   { id: '1', title: 'See content for', value: 'University', screen: '/seecontentfor' },
 { id: '2', title: 'Terms of use', screen: '/termsofuse' },
  { id: '3', title: 'Privacy policy', screen: '/privacypolicy' },
  { id: '4', title: 'Contact us' },
  { id: '5', title: 'Give feedback' },
];

export default function SettingsScreen() {
      const router = useRouter();
  const renderItem = ({ item }) => (
       <TouchableOpacity
      style={styles.item}
      onPress={() => item.screen && router.push(item.screen)}
    >
      <Text style={styles.itemText}>{item.title}</Text>
      <View style={styles.rightContainer}>
        {item.value && <Text style={styles.valueText}>{item.value}</Text>}
        <Ionicons name="chevron-forward" size={20} color="#A0A5AA" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
  <Text style={styles.headerTitle}>Settings</Text>
</View>

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
  height: 60,
  backgroundColor: '#eab8dcff', // pink ngjyra e njejtë si te SeeContentFor
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
  color: '#000',
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
