import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError("Email is not valid");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else {
        setError(error.message);
      }
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
        <Ionicons name="person-add-outline" size={64} color='#eab8dc' style={{ marginBottom: 10 }} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to start your reading journey</Text>

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

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Already have an account? <Text style={styles.linkHighlight}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;

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
});
