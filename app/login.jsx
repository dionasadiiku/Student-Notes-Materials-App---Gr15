import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signInWithEmailAndPassword,signInWithPopup  } from 'firebase/auth';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, googleProvider } from "../firebase";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Both fields are required");
      return false;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError("Email is not valid");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }; 

  const handleGoogleLogin = async () => {
  if (Platform.OS !== "web") {
    setError("Google popup sign-in works only on web. For mobile use expo-auth-session.");
    return;
  }

  setLoading(true);
  try {
    await signInWithPopup(auth, googleProvider);
    router.replace("/");
  } catch (err) {
    console.log("Google sign-in error:", err);
    setError(err?.message ?? "Google sign-in failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Ionicons name="book-outline" size={64} color='#eab8dc' style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account to continue reading</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity> 

          
        <Text style={{ marginTop: 12, color: "#666" }}>or</Text>

      
        <TouchableOpacity
          onPress={handleGoogleLogin}
          style={styles.googleBtn}
          disabled={loading}
        >
          <Text style={styles.googleText}>{loading ? "Please wait..." : "Sign in with Google"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fdfcff" },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#1a1a1a", marginBottom: 5 },
  subtitle: { color: "#777", marginBottom: 25, textAlign: "center" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
  },
  btn: {
    backgroundColor: '#eab8dc',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "600", fontSize: 16 },
  link: { marginTop: 15, color: "#444", textAlign: "center" },
  linkHighlight: { color: '#eab8dc', fontWeight: "600" },
  error: { color: "red", marginTop: 10, textAlign: "center" }, 

   googleBtn: {
    backgroundColor: "#eab8dc",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    width: "100%",
  
  },
  googleText: { color: "white", textAlign: "center", fontWeight: "600", fontSize: 16 },
  link: { marginTop: 15, color: "#444", textAlign: "center" },
  linkHighlight: { color: '#eab8dc', fontWeight: "600" },
  error: { color: "red", marginTop: 10, textAlign: "center" },
});
