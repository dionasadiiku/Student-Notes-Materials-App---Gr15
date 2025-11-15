import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function TermsOfUseScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Use – NotesApp</Text>

      {/* INTRO */}
      <Text style={styles.subtitle}>Welcome to NotesApp</Text>

      <Text style={styles.text}>
        These Terms of Use govern your access to and use of the NotesApp mobile application.
        Please read these Terms carefully. By accessing or using NotesApp, you acknowledge
        that you have read, understood, and agree to be bound by these Terms of Use.
      </Text>

      <Text style={styles.text}>
        NotesApp is designed to help students organize notes, study materials, books,
        and academic content in a simple and efficient way.
      </Text>

      {/* SECTION: WHAT IS INCLUDED */}
      <Text style={styles.subtitle}>1. Use of the Application</Text>

      <Text style={styles.text}>
        NotesApp allows you to upload, create, store, and manage personal study materials.
        You may use the app only for lawful purposes and in accordance with these Terms.
      </Text>

      <Text style={styles.list}>• You are responsible for all content you upload or store in the app.</Text>
      <Text style={styles.list}>• You agree not to upload harmful, illegal, or copyrighted materials without permission.</Text>
      <Text style={styles.list}>• You must not use NotesApp to distribute malicious files or spam.</Text>

      {/* SECTION: USER ACCOUNT */}
      <Text style={styles.subtitle}>2. User Account and Security</Text>

      <Text style={styles.text}>
        To use certain features, you may need to create an account. You agree to provide
        accurate and complete information during the registration process.
      </Text>

      <Text style={styles.list}>• You are responsible for maintaining the confidentiality of your account.</Text>
      <Text style={styles.list}>• You must notify us immediately of any unauthorized access.</Text>
      <Text style={styles.list}>• We may suspend or terminate accounts that violate these Terms.</Text>

      {/* SECTION: USER CONTENT */}
      <Text style={styles.subtitle}>3. User Content</Text>

      <Text style={styles.text}>
        As a user, you retain full ownership of your notes, files, and materials. NotesApp
        does not claim ownership over any content you upload.
      </Text>

      <Text style={styles.text}>
        However, by uploading content, you grant us permission to store and display it
        within your account for the sole purpose of providing the app’s functionality.
      </Text>

      <Text style={styles.list}>• We do NOT sell your content.</Text>
      <Text style={styles.list}>• We do NOT share your content publicly without your explicit permission.</Text>
      <Text style={styles.list}>• You are solely responsible for ensuring that your uploaded content complies with laws.</Text>

      {/* SECTION: COMMUNITY / SHARING */}
      <Text style={styles.subtitle}>4. Sharing and Community Features</Text>

      <Text style={styles.text}>
        If NotesApp provides sharing features, such as community notes or shared study
        materials, you acknowledge that any content you choose to make public is visible
        to other users.
      </Text>

      <Text style={styles.list}>• You must not upload offensive or misleading content.</Text>
      <Text style={styles.list}>• NotesApp is not responsible for user-generated public content.</Text>

      {/* SECTION: EXTERNAL API */}
      <Text style={styles.subtitle}>5. Third-Party Services and External APIs</Text>

      <Text style={styles.text}>
        NotesApp may use external APIs, such as Google Books API, to provide additional
        features like recommended books or external educational resources.
      </Text>

      <Text style={styles.text}>
        We are not responsible for content or privacy practices of third-party services.
        Their use is subject to their own Terms of Service.
      </Text>

      {/* SECTION: LIMITATION */}
      <Text style={styles.subtitle}>6. Limitations of Liability</Text>

      <Text style={styles.text}>
        NotesApp is provided “as is” and “as available.” While we work to ensure a reliable
        service, we cannot guarantee that the app will be free from errors, downtime, or lost
        data.
      </Text>

      <Text style={styles.list}>• We are not responsible for data loss caused by device issues, user error, or external failures.</Text>
      <Text style={styles.list}>• We do not guarantee that the service will meet all your expectations.</Text>

      {/* SECTION: TERMINATION */}
      <Text style={styles.subtitle}>7. Account Termination</Text>

      <Text style={styles.text}>
        You may delete your account at any time. Upon deletion, your personal data and
        stored materials will be permanently removed in accordance with our Privacy Policy.
      </Text>

      <Text style={styles.text}>
        We may suspend or terminate your account if you violate these Terms.
      </Text>

      {/* SECTION: CHANGES */}
      <Text style={styles.subtitle}>8. Changes to These Terms</Text>

      <Text style={styles.text}>
        NotesApp may update these Terms of Use from time to time. If major changes occur,
        you will be notified through the app.
      </Text>

      {/* SECTION: CONTACT */}
      <Text style={styles.subtitle}>9. Contact Information</Text>

      <Text style={styles.text}>
        If you have any questions about these Terms, please contact us at:{'\n'}
        <Text style={{fontWeight: 'bold'}}>support@notesapp.com</Text>
      </Text>

      <Text style={styles.text}>
        By using NotesApp, you confirm that you agree to these Terms of Use.
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
    marginTop: 12,
    marginBottom: 8,
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
