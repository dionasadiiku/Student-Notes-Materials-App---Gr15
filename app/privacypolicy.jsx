import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Privacy Policy</Text>

        {/* SECTION 1 */}
        <Text style={styles.subtitle}>1. Responsible Person and Contact Details</Text>

        <Text style={styles.paragraph}>
          Welcome to <Text style={{fontWeight: 'bold'}}>NotesApp</Text>, a mobile application designed to help students 
          organize notes, study materials, books, and academic resources. Your privacy is very important to us. 
          This Privacy Policy explains how we collect, use, store, and protect your personal information.
        </Text>

        <Text style={styles.paragraph}>
          By using NotesApp, you agree to the terms outlined in this Privacy Policy.
        </Text>

        <Text style={styles.paragraph}>
          The controller responsible for your personal data is <Text style={{fontWeight: 'bold'}}>NotesApp Inc.</Text>, 
          located at 123 Main Street, YourCity, YourCountry. 
          For any questions regarding privacy, feel free to contact us at 
          <Text style={{fontWeight: 'bold'}}> support@notesapp.com</Text>.
        </Text>

        {/* SECTION 2 */}
        <Text style={styles.subtitle}>2. Information We Collect</Text>

        <Text style={styles.paragraph}>
          NotesApp collects only the necessary information required for the proper functioning of the app. 
          The data we may collect includes:
        </Text>

        <Text style={styles.paragraph}>
          • <Text style={{fontWeight: 'bold'}}>Account Information:</Text> email address, username, and password (encrypted).{'\n'}
          • <Text style={{fontWeight: 'bold'}}>User Content:</Text> notes, saved books, uploaded materials, study documents, favorite items.{'\n'}
          • <Text style={{fontWeight: 'bold'}}>Device Information:</Text> device type, operating system, app version, crash logs (for performance improvement).{'\n'}
          • <Text style={{fontWeight: 'bold'}}>Optional External API Data:</Text> such as book data from Google Books API.
        </Text>

        {/* SECTION 3 */}
        <Text style={styles.subtitle}>3. How We Use Your Information</Text>

        <Text style={styles.paragraph}>
          We use your data only for purposes related to the app’s functionality, including:
        </Text>

        <Text style={styles.paragraph}>
          • Allowing you to create, edit, and store notes and materials.{'\n'}
          • Syncing your data across devices (if cloud sync is enabled).{'\n'}
          • Providing personalized content, such as recommended books or study materials.{'\n'}
          • Improving app performance and fixing errors.{'\n'}
          • Ensuring account security and preventing unauthorized access.
        </Text>

        {/* SECTION 4 */}
        <Text style={styles.subtitle}>4. Data Storage and Security</Text>

        <Text style={styles.paragraph}>
          Your privacy and security are our priority. NotesApp uses industry-standard measures to protect your 
          personal data, including:
        </Text>

        <Text style={styles.paragraph}>
          • Encrypted passwords{'\n'}
          • Secure database storage{'\n'}
          • Protected API communication (HTTPS){'\n'}
          • Regular security updates and monitoring
        </Text>

        <Text style={styles.paragraph}>
          We do not store your notes or materials on public servers without your permission. 
          Local-only storage may be used depending on your device settings.
        </Text>

        {/* SECTION 5 */}
        <Text style={styles.subtitle}>5. External Services and APIs</Text>

        <Text style={styles.paragraph}>
          NotesApp may use external APIs, such as Google Books API, to display educational book recommendations 
          or additional study resources.
        </Text>

        <Text style={styles.paragraph}>
          These services may collect limited technical information (such as device IP) according to their own 
          privacy policies. NotesApp does not share your personal notes or private account information 
          with third-party services.
        </Text>

        {/* SECTION 6 */}
        <Text style={styles.subtitle}>6. Your Rights</Text>

        <Text style={styles.paragraph}>
          You have the right to:
        </Text>

        <Text style={styles.paragraph}>
          • Access your personal data{'\n'}
          • Request correction of incorrect or incomplete information{'\n'}
          • Delete your account and all stored data{'\n'}
          • Request a copy of your stored data{'\n'}
          • Withdraw consent at any time
        </Text>

        {/* SECTION 7 */}
        <Text style={styles.subtitle}>7. Data Deletion</Text>

        <Text style={styles.paragraph}>
          If you delete your account, all your notes, materials, and personal data will be permanently removed 
          from our systems within 30 days. This process cannot be reversed.
        </Text>

        {/* SECTION 8 */}
        <Text style={styles.subtitle}>8. Children’s Privacy</Text>

        <Text style={styles.paragraph}>
          NotesApp is not intended for children under the age of 13. 
          We do not knowingly collect personal information from minors.
        </Text>

        {/* SECTION 9 */}
        <Text style={styles.subtitle}>9. Changes to This Privacy Policy</Text>

        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will be notified inside the app, 
          and your continued use of the service will constitute acceptance of the updated policy.
        </Text>

        {/* SECTION 10 */}
        <Text style={styles.subtitle}>10. Contact Information</Text>

        <Text style={styles.paragraph}>
          For any questions or concerns about this Privacy Policy, please contact us at:{'\n'}
          <Text style={{fontWeight: 'bold'}}>support@notesapp.com</Text>
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
