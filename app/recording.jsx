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
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function RecordingScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const soundRef = useRef(null);
  const webAudioRef = useRef(null);

  const [recordings, setRecordings] = useState([]);
  const [saving, setSaving] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  
  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const q = query(collection(db, "recordings"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const items = snap.docs.map(d => ({ ...d.data(), docId: d.id }));
        setRecordings(items);
      } catch (err) {
        console.error("loadRecordings error:", err);
      }
    };
    loadRecordings();
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
        if (!granted) return alert("Microphone permission required!");
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        recordingRef.current = recording;
        setIsRecording(true);
      }
    } catch (err) {
      console.error("startRecording error:", err);
      alert("Cannot start recording: " + err.message);
    }
  };

  const stopRecording = async () => {
    setSaving(true);
    try {
      let url;
      let duration = 0;

     
      const snapAll = await getDocs(collection(db, "recordings"));
      const nextIndex = snapAll.size + 1;
      const name = `Recording ${nextIndex}`;

      if (Platform.OS === "web") {
        if (!mediaRecorderRef.current) return;
        const mr = mediaRecorderRef.current;

        await new Promise(resolve => {
          mr.onstop = resolve;
          mr.stop();
        });

        if (!chunksRef.current.length) {
          alert("No audio recorded!");
          setSaving(false);
          setIsRecording(false);
          return;
        }
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        url = URL.createObjectURL(blob);

        const audioEl = new window.Audio(url);
        await new Promise(res => {
          audioEl.onloadedmetadata = () => {
            duration = audioEl.duration;
            res();
          };
        });

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
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
        duration = status.durationMillis / 1000; // ms -> seconds
        recordingRef.current = null;
      }

      const newRecording = {
        name,
        url,
        duration,
        createdAt: Timestamp.now(),
      };

      
      const docRef = await addDoc(collection(db, "recordings"), newRecording);

      
      setRecordings(prev => [{ ...newRecording, docId: docRef.id }, ...prev]);
      setIsRecording(false);
    } catch (err) {
      console.error("stopRecording error:", err);
      alert("Could not save recording: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const playRecording = async (item) => {
    try {
      
      if (playingId === item.docId) {
        if (Platform.OS === "web") {
          if (webAudioRef.current) {
            webAudioRef.current.pause();
            webAudioRef.current = null;
          }
        } else {
          if (soundRef.current) {
            await soundRef.current.pauseAsync();
            await soundRef.current.unloadAsync().catch(()=>{});
            soundRef.current = null;
          }
        }
        setPlayingId(null);
        return;
      }

    
      if (Platform.OS === "web") {
        if (webAudioRef.current) {
          webAudioRef.current.pause();
          webAudioRef.current = null;
        }
        const audio = new window.Audio(item.url);
        webAudioRef.current = audio;
        setPlayingId(item.docId);
        audio.onended = () => setPlayingId(null);
        await audio.play();
      } else {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync({ uri: item.url }, { shouldPlay: true });
        soundRef.current = sound;
        setPlayingId(item.docId);

        sound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish) {
            sound.unloadAsync().catch(() => { });
            soundRef.current = null;
            setPlayingId(null);
          }
        });
      }
    } catch (err) {
      console.error("playRecording error:", err);
      setPlayingId(null);
    }
  };

  const deleteRecording = (item) => {
  
  if (Platform.OS === "web") {
    const ok = window.confirm("Are you sure you want to delete this recording?");
    if (!ok) return;

    return actuallyDelete(item);
  }

  
  Alert.alert(
    "Delete recording",
    "Are you sure you want to delete this recording?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => actuallyDelete(item),
      },
    ]
  );
};

const actuallyDelete = async (item) => {
  try {
    
    if (playingId === item.docId) {
      if (Platform.OS === "web" && webAudioRef.current) {
        webAudioRef.current.pause();
        webAudioRef.current = null;
      }
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
      setPlayingId(null);
    }

    
    await deleteDoc(doc(db, "recordings", item.docId));
    console.log("Deleted from Firestore:", item.docId);

    
    if (
      Platform.OS === "web" &&
      item.url &&
      item.url.startsWith("blob:") &&
      URL.revokeObjectURL
    ) {
      URL.revokeObjectURL(item.url);
    }

    
    setRecordings((prev) => prev.filter((r) => r.docId !== item.docId));
  } catch (err) {
    console.error("deleteRecording error:", err);
    alert("Could not delete recording: " + err.message);
  }
};


  const updateRecordingName = async (item) => {
    const newName = editedName.trim();
    if (!newName) {
      alert("Name cannot be empty");
      return;
    }

    
    setRecordings(prev => prev.map(r => (r.docId === item.docId ? { ...r, name: newName } : r)));
    setEditingId(null);
    setEditedName("");

    
    try {
      await updateDoc(doc(db, "recordings", item.docId), { name: newName });
    } catch (err) {
      console.error("updateRecordingName error:", err);
      alert("Could not update name: " + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <Text style={styles.title}>🎙️ Class Recordings</Text>

      <TouchableOpacity
        style={[styles.recordButton, { backgroundColor: isRecording ? "#fdecec" : "#e6dbfa" }]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={saving}
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
        keyExtractor={item => item.docId}
        ListEmptyComponent={<Text style={styles.emptyText}>No recordings yet.</Text>}
       renderItem={({ item }) => (
  <View style={styles.recordingCard}>
    {editingId === item.docId ? (
      <>
        <TextInput
          style={styles.input}
          value={editedName}
          onChangeText={setEditedName}
          placeholder="Edit name..."
        />
        <TouchableOpacity onPress={() => updateRecordingName(item)}>
          <Ionicons name="checkmark-outline" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditingId(null)}>
          <Ionicons name="close-outline" size={24} color="red" />
        </TouchableOpacity>
      </>
    ) : (
      <>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            {item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleString()
              : ""}
            {" • "} {Math.round(item.duration)}s
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => playRecording(item)}>
            <Ionicons
              name={playingId === item.docId ? "pause-circle" : "play-circle"}
              size={28}
              color="#8a4af3"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setEditingId(item.docId);
              setEditedName(item.name);
            }}
          >
            <Ionicons name="pencil-outline" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteRecording(item)}>
            <Ionicons name="trash-outline" size={22} color="red" />
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
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  emptyText: { textAlign: "center", color: "#999", marginTop: 20 },
  meta: { fontSize: 12, color: "#555", marginTop: 2 }

});
