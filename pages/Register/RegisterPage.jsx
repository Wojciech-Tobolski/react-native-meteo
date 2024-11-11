// RegisterPage.js
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { AuthAPI } from "../../api/auth";

export default function RegisterPage({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await AuthAPI.registerUser({
        username,
        email,
        first_name: "Imię", // Można dostosować
        last_name: "Nazwisko", // Można dostosować
        password,
        role: "user",
        phone_number: "123456789",
      });
      Alert.alert("Sukces", "Rejestracja zakończona powodzeniem!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Błąd", "Rejestracja nie powiodła się. Spróbuj ponownie.");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nazwa użytkownika"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Zarejestruj się" onPress={handleRegister} />
    </View>
  );
}
