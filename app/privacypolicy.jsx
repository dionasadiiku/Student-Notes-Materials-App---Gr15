import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.subtitle}>1. Responsible Person and Contact Details</Text>

        <Text style={styles.paragraph}>
          Welcome to <Text style={{fontWeight: 'bold'}}>NotesApp</Text>, your personal note-taking app. 
          We value your privacy and handle your personal data carefully in accordance with applicable data protection laws.
        </Text>

        <Text style={styles.paragraph}>
          This privacy policy applies to all users of the NotesApp mobile application. 
          By using the app, you agree to the collection and use of information in accordance with this policy.
        </Text>

        <Text style={styles.paragraph}>
          The controller of your personal data is <Text style={{fontWeight: 'bold'}}>NotesApp Inc.</Text>, 
          located at 123 Main Street, YourCity, YourCountry. 
          You can contact us via email at <Text style={{fontWeight: 'bold'}}>support@notesapp.com</Text>.
        </Text>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  paragraph: { fontSize: 16, color: '#1C1C1E', marginBottom: 15, lineHeight: 22 },
});
