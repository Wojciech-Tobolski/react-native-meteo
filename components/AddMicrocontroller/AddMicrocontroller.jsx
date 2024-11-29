import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddMicrocontroller = ({ route, navigation }) => {
  const { plantId } = route.params; // Odbierz ID rośliny
  const [controllerId, setControllerId] = useState("");
  const [wifiSSID, setWifiSSID] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [plantConfig, setPlantConfig] = useState(""); // Nowe dane np. do konfiguracji rośliny

  // Funkcja dodawania mikrokontrolera
  const handleAddMicrocontroller = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd", "Brak autoryzacji. Zaloguj się ponownie.");
        return;
      }

      await axios.post(
        "http://192.168.1.32:8000/micro_assistant/add_microcontroller",
        {
          controller_id: controllerId,
          user_plant_id: plantId,
          wifi_ssid: wifiSSID,
          wifi_password: wifiPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Sukces", "Mikrokontroler został dodany.");
      navigation.goBack();
    } catch (error) {
      console.error("Błąd dodawania mikrokontrolera:", error);
      Alert.alert("Błąd", "Nie udało się dodać mikrokontrolera.");
    }
  };

  // Funkcja wysyłania danych do mikrokontrolera
  const handleSendDataToMicrocontroller = async () => {
    try {
      const data = {
        ssid: wifiSSID,
        password: wifiPassword,
      };
      const response = await fetch("http://192.168.4.1:80/wifi-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert("Sukces", "Dane zostały wysłane do ESP32.");
      } else {
        Alert.alert("Błąd", "Nie udało się wysłać danych.");
      }
    } catch (error) {
      console.error("Błąd podczas wysyłania danych:", error);
      Alert.alert("Błąd", "Nie udało się połączyć z ESP32.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Microcontroller</Text>
      <TextInput
        style={styles.input}
        placeholder="Microcontroller ID"
        value={controllerId}
        onChangeText={setControllerId}
      />
      <TextInput
        style={styles.input}
        placeholder="WiFi SSID"
        value={wifiSSID}
        onChangeText={setWifiSSID}
      />
      <TextInput
        style={styles.input}
        placeholder="WiFi Password"
        secureTextEntry
        value={wifiPassword}
        onChangeText={setWifiPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Plant Configuration (JSON)"
        value={plantConfig}
        onChangeText={setPlantConfig}
      />
      <Button title="Add Microcontroller" onPress={handleAddMicrocontroller} />
      <Button
        title="Send Data to Microcontroller"
        onPress={handleSendDataToMicrocontroller}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default AddMicrocontroller;
