import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const AddMicrocontroller = ({ route }) => {
  const { plantId } = route.params; // Pobieramy ID rośliny przekazane z poprzedniego widoku
  const [microcontrollerId, setMicrocontrollerId] = useState(""); // Pole tekstowe dla nowego mikrokontrolera
  const [userMicrocontrollers, setUserMicrocontrollers] = useState([]); // Lista mikrokontrolerów użytkownika
  const navigation = useNavigation();

  // Pobierz mikrokontrolery użytkownika z backendu
  const fetchUserMicrocontrollers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd autoryzacji", "Zaloguj się ponownie.");
        return;
      }

      const response = await axios.get(
        "http://192.168.1.32:8000/micro_assistant/user-microcontrollers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserMicrocontrollers(response.data);
    } catch (error) {
      console.error("Error fetching user microcontrollers:", error);
      Alert.alert("Błąd", "Nie udało się pobrać mikrokontrolerów.");
    }
  };

  useEffect(() => {
    fetchUserMicrocontrollers();
  }, []);

  // Dodaj nowy mikrokontroler po ID z pola tekstowego
  const handleAddNewMicrocontroller = async () => {
    try {
      if (!microcontrollerId.trim()) {
        Alert.alert("Błąd", "Proszę wprowadzić ID mikrokontrolera.");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd autoryzacji", "Zaloguj się ponownie.");
        return;
      }

      const response = await axios.post(
        "http://192.168.1.32:8000/micro_assistant/add-or-assign",
        {
          controller_id: microcontrollerId,
          user_plant_id: plantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Sukces", response.data.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"), // Przekierowanie na stronę główną
        },
      ]);
    } catch (error) {
      console.error("Error adding new microcontroller:", error);
      Alert.alert("Błąd", "Nie udało się dodać nowego mikrokontrolera.");
    }
  };

  // Dodaj mikrokontroler z listy
  const handleAddMicrocontrollerFromList = async (controllerId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd autoryzacji", "Zaloguj się ponownie.");
        return;
      }

      const response = await axios.post(
        "http://192.168.1.32:8000/micro_assistant/add-or-assign",
        {
          controller_id: controllerId,
          user_plant_id: plantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Sukces", response.data.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"), // Przekierowanie na stronę główną
        },
      ]);
    } catch (error) {
      console.error("Error assigning microcontroller:", error);
      Alert.alert("Błąd", "Nie udało się przypisać mikrokontrolera.");
    }
  };

  // Odepnij mikrokontroler od rośliny
  const handleUnassignMicrocontroller = async (controllerId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd autoryzacji", "Zaloguj się ponownie.");
        return;
      }

      const response = await axios.post(
        "http://192.168.1.32:8000/micro_assistant/unassign-plant",
        {
          controller_id: controllerId, // Dane w formacie JSON
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ustaw nagłówek
          },
        }
      );

      Alert.alert("Sukces", "Mikrokontroler został odpięty od rośliny.");
      fetchUserMicrocontrollers(); // Odśwież listę mikrokontrolerów
    } catch (error) {
      console.error("Error unassigning microcontroller:", error);
      Alert.alert("Błąd", "Nie udało się odpiąć mikrokontrolera.");
    }
  };

  // Wyświetlenie strzałki "Cofnij"
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* Strzałka "Cofnij" */}
      <TouchableOpacity onPress={handleGoBack} style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, color: "#007BFF" }}>← Wróć</Text>
      </TouchableOpacity>

      {/* Pole tekstowe dla nowego mikrokontrolera */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Dodaj nowy mikrokontroler
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
          fontSize: 16,
        }}
        placeholder="ID mikrokontrolera"
        value={microcontrollerId}
        onChangeText={setMicrocontrollerId}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          alignItems: "center",
          borderRadius: 5,
          marginBottom: 20,
        }}
        onPress={handleAddNewMicrocontroller}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>
          Dodaj nowy mikrokontroler
        </Text>
      </TouchableOpacity>

      {/* Lista mikrokontrolerów */}
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Twoje mikrokontrolery:
      </Text>
      <FlatList
        data={userMicrocontrollers}
        keyExtractor={(item) => item.controller_id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text>ID: {item.controller_id}</Text>
              <Text>
                Przypisana roślina:{" "}
                {item.assigned_plant ? item.assigned_plant.custom_name : "Brak"}
              </Text>
            </View>
            {item.assigned_plant ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "#f44336",
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() =>
                  handleUnassignMicrocontroller(item.controller_id)
                }
              >
                <Text style={{ color: "#fff" }}>Odepnij</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#4CAF50",
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() =>
                  handleAddMicrocontrollerFromList(item.controller_id)
                }
              >
                <Text style={{ color: "#fff" }}>Dodaj</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default AddMicrocontroller;
