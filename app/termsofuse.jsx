import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function TermsOfUseScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Use – NotesApp</Text>

      <Text style={styles.subtitle}>Welcome to NotesApp</Text>

      <Text style={styles.text}>
        These Terms of Use apply to the use of the NotesApp mobile application.
        Please read these Terms carefully to ensure that you understand your
        rights and responsibilities when using the app. By accessing or using
        NotesApp, you agree to be bound by these Terms of Use.
      </Text>

      <Text style={styles.text}>
        NotesApp is designed to help students and readers manage their study
        materials, notes, and books in one place. The app allows users to store,
        organize, and access educational content efficiently.
      </Text>

      <Text style={styles.subtitle}>In these Terms, you will find information about:</Text>

      <Text style={styles.list}>• How NotesApp can be used to upload and organize your personal study materials.</Text>
      <Text style={styles.list}>• The creation and management of your user profile.</Text>
      <Text style={styles.list}>• How to share or access community notes within the platform.</Text>
      <Text style={styles.list}>• How NotesApp protects your personal data and stored files.</Text>
      <Text style={styles.list}>• The limitations of NotesApp’s responsibility regarding shared content.</Text>

      <Text style={styles.text}>
        NotesApp may update these Terms from time to time to improve user
        experience or comply with legal requirements. You will be notified of
        any major changes through the app.
      </Text>

      <Text style={styles.text}>
        By continuing to use NotesApp, you confirm that you have read,
        understood, and agreed to these Terms of Use.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 24,
  },
  list: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    lineHeight: 24,
  },
});
