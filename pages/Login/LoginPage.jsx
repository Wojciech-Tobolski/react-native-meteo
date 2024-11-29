import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { AuthAPI } from "../../api/auth";

export default function LoginPage({ onLoginSuccess, navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await AuthAPI.loginUser({ username, password });
      onLoginSuccess(); // Wywołanie funkcji, która przełączy ekran na Tabs
    } catch (error) {
      console.error("Błąd logowania:", error);
      Alert.alert("Błąd", "Logowanie nie powiodło się. Spróbuj ponownie.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Growing Plant
        <Text style={styles.subtitle}> Assistant</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nazwa użytkownika"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Zaloguj się</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    fontFamily: "serif",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "serif",
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
