import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { AuthAPI } from "../../api/auth";

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await AuthAPI.loginUser({ username, password });
      onLoginSuccess(); // Wywołanie funkcji, która przełączy ekran na `Tabs`
    } catch (error) {
      console.error("Błąd logowania:", error);
      Alert.alert("Błąd", "Logowanie nie powiodło się. Spróbuj ponownie.");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nazwa użytkownika"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Zaloguj się" onPress={handleLogin} />
      <Button
        title="Zarejestruj się"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}
