import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from './components/footer';

const settingsItems = [
  { id: '1', title: 'See content for', value: 'University', screen: '/seecontentfor' },
  { id: '2', title: 'Terms of use', screen: '/termsofuse' },
  { id: '3', title: 'Privacy policy', screen: '/privacypolicy' },
  { id: '4', title: 'Contact us' },
  { id: '5', title: 'Give feedback' }, 
];

export default function SettingsScreen() {
  const router = useRouter();

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const handleContactUs = () => {
    const email = 'notesApp@gmail.com';
    const subject = 'Contact NotesApp';
    const body = 'Hi NotesApp team,';

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl).catch(err => console.error('Error opening email app:', err));
  };

  const handleFeedback = (option) => {
    console.log('User selected:', option);

    if (option === 'later') {
      setShowFeedbackModal(false);
    } else if (option === 'like' || option === 'not_happy') {
      setSelectedFeedback(option);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setSelectedFeedback(null);
      }, 1000);
    }
  };

  const renderFeedbackButton = (option, label) => (
    <TouchableOpacity
      style={[
        styles.button,
        selectedFeedback === option && option !== 'later' && { backgroundColor: '#007AFF', borderColor: '#007AFF' },
      ]}
      onPress={() => handleFeedback(option)}
    >
      <Text style={selectedFeedback === option ? styles.primaryButtonText : styles.secondaryButtonText}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        if (item.id === '5') {
          setShowFeedbackModal(true);
        } else if (item.id === '4') {
          handleContactUs();
        } else if (item.screen) {
          router.push(item.screen);
        }
      }}
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

      <FlatList style={{paddingHorizontal: 10}}
        data={settingsItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Text style={styles.version}>Version: 7.9.3.5583</Text>

      <Modal
        visible={showFeedbackModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {selectedFeedback === 'like' || selectedFeedback === 'not_happy' ? (
              <>
                <Text style={styles.star}>🙏</Text>
                <Text style={styles.title}>Thank you for your feedback!</Text>
              </>
            ) : (
              <>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.title}>Enjoying the app?</Text>
                <Text style={styles.subtitle}>
                  Please rate us on the app store{'\n'}
                  Help other students find out about us with a positive rating!
                </Text>

                {renderFeedbackButton('like', "Yes, I like it!")}
                {renderFeedbackButton('not_happy', "No, I'm not happy")}
                {renderFeedbackButton('later', "Not now")}
              </>
            )}
          </View>
        </View>
      </Modal>
      <Footer/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
  },
  star: {
    fontSize: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 25,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    borderRadius: 25,
    paddingVertical: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
