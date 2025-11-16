import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Header from "./components/header";
import Footer from "./components/footer";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function RecordingScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null); // expo audio Recording
  const mediaRecorderRef = useRef(null); // web MediaRecorder
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const soundRef = useRef(null);
  const webAudioRef = useRef(null);

  const [recordings, setRecordings] = useState([]);
  const [saving, setSaving] = useState(false);
  const [playingId, setPlayingId] = useState(null);

  
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [updateLoadingId, setUpdateLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

 
  useEffect(() => {
    const q = query(collection(db, "recordings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setRecordings(recs);
    });

    
    return () => {
      unsubscribe();
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      if (webAudioRef.current) {
        try { webAudioRef.current.pause(); } catch(e) {}
        webAudioRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

 
  const startRecording = async () => {
    try {
      if (Platform.OS === "web") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        chunksRef.current = [];
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;
        mr.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
        };
        mr.start();
        setIsRecording(true);
      } else {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          Alert.alert("Permission", "Microphone permission is required.");
          return;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        recordingRef.current = recording;
        setIsRecording(true);
      }
    } catch (err) {
      console.error("startRecording error:", err);
      Alert.alert("Error", "Cannot start recording: " + (err?.message ?? err));
    }
  };

  
  const stopRecording = async () => {
    setSaving(true);
    try {
      let url;
      
      const name = `Recording ${new Date().toLocaleString()}`;
      let duration = 0;

      if (Platform.OS === "web") {
        if (!mediaRecorderRef.current) return;
        const mr = mediaRecorderRef.current;
        await new Promise((resolve) => {
          mr.onstop = resolve;
          mr.stop();
        });

        if (!chunksRef.current.length) {
          Alert.alert("Error", "No audio recorded.");
          return;
        }

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        url = URL.createObjectURL(blob);

        
        const audioEl = new window.Audio(url);
        await new Promise((res) => {
          audioEl.onloadedmetadata = () => {
            duration = audioEl.duration || 0;
            res();
          };
        });

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        mediaRecorderRef.current = null;
        chunksRef.current = [];
      } else {
        if (!recordingRef.current) return;
        const rec = recordingRef.current;
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        url = uri;
        const status = await rec.getStatusAsync();
        duration = (status?.durationMillis ?? 0) / 1000;
        recordingRef.current = null;
      }

      
      const payload = {
        name,
        url,
        duration,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "recordings"), payload);

    } catch (err) {
      console.error("stopRecording error:", err);
      Alert.alert("Error", "Could not save recording: " + (err?.message ?? err));
    } finally {
      setIsRecording(false);
      setSaving(false);
    }
  };

  
  const playRecording = async (item) => {
    try {
     
      if (Platform.OS === "web") {
        if (webAudioRef.current) {
          try { webAudioRef.current.pause(); } catch (e) {}
          webAudioRef.current = null;
        }
        const audio = new window.Audio(item.url);
        webAudioRef.current = audio;
        setPlayingId(item.id);
        audio.onended = () => setPlayingId(null);
        await audio.play();
      } else {
        if (soundRef.current) {
          await soundRef.current.unloadAsync().catch(()=>{});
          soundRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync({ uri: item.url }, { shouldPlay: true });
        soundRef.current = sound;
        setPlayingId(item.id);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status?.didJustFinish) {
            sound.unloadAsync().catch(()=>{});
            soundRef.current = null;
            setPlayingId(null);
          }
        });
      }
    } catch (err) {
      console.error("playRecording error:", err);
      setPlayingId(null);
      Alert.alert("Playback error", err?.message ?? String(err));
    }
  };

  
  const updateRecordingName = async (id) => {
    if (!editedName?.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }
    setUpdateLoadingId(id);
    try {
      const docRef = doc(db, "recordings", id);
      await updateDoc(docRef, { name: editedName.trim() });
     
      setEditingId(null);
      setEditedName("");
    } catch (err) {
      console.error("updateRecordingName error:", err);
      Alert.alert("Error", "Could not update recording name: " + (err?.message ?? err));
    } finally {
      setUpdateLoadingId(null);
    }
  };

 
  const deleteRecording = (item) => {
    Alert.alert(
      "Delete",
      `Delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleteLoadingId(item.id);
            try {
              const docRef = doc(db, "recordings", item.id);
              await deleteDoc(docRef);
              
            } catch (err) {
              console.error("deleteRecording error:", err);
              Alert.alert("Error", "Could not delete recording: " + (err?.message ?? err));
            } finally {
              setDeleteLoadingId(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>🎙️ Class Recordings</Text>

      <TouchableOpacity
        style={[styles.recordButton, { backgroundColor: isRecording ? "#fdecec" : "#e6dbfa" }]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={saving || updateLoadingId || deleteLoadingId}
      >
        <Ionicons name={isRecording ? "stop-circle" : "mic-circle"} size={80} color={isRecording ? "#ff4d6d" : "#8a4af3"} />
        <Text style={styles.buttonText}>{isRecording ? "Stop Recording" : "Start Recording"}</Text>
      </TouchableOpacity>

      {saving && (
        <View style={styles.savingBox}>
          <ActivityIndicator size="small" color="#8a4af3" />
          <Text style={{ color: "#555" }}>Processing recording...</Text>
        </View>
      )}

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No recordings yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.recordingCard}>
            {editingId === item.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Edit name..."
                />
                <TouchableOpacity
                  onPress={() => updateRecordingName(item.id)}
                  disabled={updateLoadingId === item.id}
                  style={{ marginLeft: 8 }}
                >
                  {updateLoadingId === item.id ? (
                    <ActivityIndicator />
                  ) : (
                    <Ionicons name="checkmark-outline" size={24} color="green" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setEditingId(null); setEditedName(""); }} style={{ marginLeft: 8 }}>
                  <Ionicons name="close-outline" size={24} color="red" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  {/* optional: small meta */}
                  <Text style={{ color: "#666", fontSize: 12 }}>{item.duration ? `${Math.round(item.duration)} s` : ""}</Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => playRecording(item)} style={{ marginRight: 8 }}>
                    <Ionicons name={playingId === item.id ? "pause-circle" : "play-circle"} size={28} color="#8a4af3" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => { setEditingId(item.id); setEditedName(item.name || ""); }}
                    style={{ marginRight: 8 }}
                    disabled={updateLoadingId || deleteLoadingId}
                  >
                    <Ionicons name="pencil-outline" size={22} color="#000" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteRecording(item)} disabled={deleteLoadingId === item.id}>
                    {deleteLoadingId === item.id ? (
                      <ActivityIndicator />
                    ) : (
                      <Ionicons name="trash-outline" size={22} color="red" />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
      />

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fdfcff" },
  title: { fontSize: 26, fontWeight: "700", color: "#3b0068", textAlign: "center", marginBottom: 20 },
  recordButton: { alignItems: "center", justifyContent: "center", borderRadius: 20, paddingVertical: 20, marginBottom: 25 },
  buttonText: { marginTop: 10, fontSize: 16, fontWeight: "600", color: "#333" },
  savingBox: { alignItems: "center", marginBottom: 12 },
  recordingCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#f4d9f8", borderRadius: 16, padding: 14, marginBottom: 10 },
  input: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 8, borderWidth: 1, borderColor: "#ddd", marginRight: 10 },
  name: { fontSize: 15, fontWeight: "600", color: "#333" },
  actions: { flexDirection: "row", alignItems: "center" },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
});
