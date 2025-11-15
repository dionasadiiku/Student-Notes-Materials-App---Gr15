import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { db, auth } from "../firebase"; 
import {
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Footer from "./components/footer";
import Header from "./components/header";

import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const settingsItems = [
  { id: "0", title: "Profile", screen: "/profile" }, 
  { id: "1", title: "See content for", value: "University", screen: "/seecontentfor" },
  { id: "2", title: "Terms of use", screen: "/termsofuse" },
  { id: "3", title: "Privacy policy", screen: "/privacypolicy" },
  { id: "4", title: "Contact us" },
  { id: "5", title: "Give feedback" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refreshSettings = () => setRefreshKey(prev => prev + 1);

  const handleContactUs = () => {
    const email = "notesApp@gmail.com";
    const subject = "Contact NotesApp";
    const body = "Hi NotesApp team,";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl).catch(err => console.error("Error opening email app:", err));
  };

 
  const saveFeedback = async (type) => {
    try {
      await addDoc(collection(db, "feedbacks"), {
        type, 
        userId: auth?.currentUser?.uid ?? null,
        userEmail: auth?.currentUser?.email ?? null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("Error saving feedback:", err);
      setIsLoading(false);
      return false;
    }
  };

  
  const updateFeedbackStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "feedbacks", id), { status: newStatus });
      return true;
    } catch (err) {
      console.error("Error updating feedback:", err);
      return false;
    }
  };


  const removeFeedback = async (id) => {
    try {
      await deleteDoc(doc(db, "feedbacks", id));
      return true;
    } catch (err) {
      console.error("Error deleting feedback:", err);
      return false;
    }
  };


  const handleFeedback = async (option) => {
    if (option === "later") {
      setShowFeedbackModal(false);
      return;
    }

    if (option === "like" || option === "not_happy") {
      
      setShowFeedbackModal(false);

    
      const ok = await saveFeedback(option);
      if (!ok) {
        Alert.alert("Gabim", "Nuk u ruajt feedback. Provoni përsëri.");
        return;
      }

      
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 1200);
    }
  };

  const renderFeedbackButton = (option, label) => (
    <TouchableOpacity style={styles.feedbackButton} onPress={() => handleFeedback(option)}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.id === "5") setShowFeedbackModal(true);
        else if (item.id === "4") handleContactUs();
        else if (item.screen) router.push(item.screen);
      }}
    >
      <View style={styles.itemRow}>
        <Text style={styles.itemText}>{item.title}</Text>
        <View style={styles.rightContainer}>
          {item.value && <Text style={styles.valueText}>{item.value}</Text>}
          <Ionicons name="chevron-forward" size={20} color="#A0A5AA" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header onSettingsPress={refreshSettings} />

      <View style={styles.content}>
        <Text style={styles.screenTitle}>Settings</Text>

        <FlatList
          data={settingsItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <Text style={styles.version}>Version: 7.9.3.5583</Text>
      </View>

    
      <Modal visible={showFeedbackModal} transparent animationType="fade" onRequestClose={() => setShowFeedbackModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.title}>Enjoying the app?</Text>
            <Text style={styles.subtitle}>
              Please rate us on the app store{'\n'}
              Help other students find out about us with a positive rating!
            </Text>

            {isLoading ? (
              <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 10 }} />
            ) : (
              <>
                {renderFeedbackButton("like", "Yes, I like it!")}
                {renderFeedbackButton("not_happy", "No, I'm not happy")}
                {renderFeedbackButton("later", "Not now")}
              </>
            )}
          </View>
        </View>
      </Modal>

      
      <Modal visible={showThankYou} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modal, { width: "70%", padding: 18 }]}>
            <Text style={styles.star}>🙏</Text>
            <Text style={styles.title}>Thank you for your feedback!</Text>
          </View>
        </View>
      </Modal>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  screenTitle: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemText: { fontSize: 16, fontWeight: "500", color: "#1C1C1E" },
  rightContainer: { flexDirection: "row", alignItems: "center" },
  valueText: { fontSize: 15, color: "#8E8E93", marginRight: 8 },
  version: { textAlign: "center", color: "#8E8E93", fontSize: 14, marginTop: 15 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },
  star: { fontSize: 32, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 15, textAlign: "center", color: "#555", marginBottom: 25, lineHeight: 20 },
  feedbackButton: { width: "100%", borderRadius: 25, paddingVertical: 12, marginVertical: 6, borderWidth: 1, borderColor: "#E0E0E0", alignItems: "center" },
  primaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  secondaryButtonText: { color: "#007AFF", fontSize: 16, fontWeight: "500" },
});
