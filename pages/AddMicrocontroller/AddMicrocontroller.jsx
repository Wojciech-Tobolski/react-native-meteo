import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../confiq";

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
        `${API_URL}micro_assistant/user-microcontrollers`,
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
        `${API_URL}micro_assistant/add-or-assign`,
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
      fetchUserMicrocontrollers(); // Odśwież listę mikrokontrolerów
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
        `${API_URL}micro_assistant/add-or-assign`,
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
      fetchUserMicrocontrollers(); // Odśwież listę mikrokontrolerów
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

      await axios.post(
        `${API_URL}micro_assistant/unassign-plant`,
        {
          controller_id: controllerId, // Dane w formacie JSON
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  return (
    <View style={styles.container}>
      {/* Strzałka "Cofnij" */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Wróć</Text>
      </TouchableOpacity>

      {/* Pole tekstowe dla nowego mikrokontrolera */}
      <Text style={styles.title}>Dodaj nowy mikrokontroler</Text>
      <TextInput
        style={styles.input}
        placeholder="ID mikrokontrolera"
        value={microcontrollerId}
        onChangeText={setMicrocontrollerId}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddNewMicrocontroller}
      >
        <Text style={styles.addButtonText}>Dodaj nowy mikrokontroler</Text>
      </TouchableOpacity>

      {/* Lista mikrokontrolerów */}
      <Text style={styles.title}>Twoje mikrokontrolery:</Text>
      {userMicrocontrollers.length === 0 ? (
        <Text style={styles.noMicrocontrollersText}>
          Nie masz jeszcze dodanego żadnego mikrokontrolera.
        </Text>
      ) : (
        <FlatList
          data={userMicrocontrollers}
          keyExtractor={(item) => item.controller_id}
          renderItem={({ item }) => (
            <View style={styles.microcontrollerItem}>
              <View>
                <Text>ID: {item.controller_id}</Text>
                <Text>
                  Przypisana roślina:{" "}
                  {item.assigned_plant
                    ? item.assigned_plant.custom_name
                    : "Brak"}
                </Text>
              </View>
              {item.assigned_plant ? (
                <TouchableOpacity
                  style={styles.unassignButton}
                  onPress={() =>
                    handleUnassignMicrocontroller(item.controller_id)
                  }
                >
                  <Text style={styles.unassignButtonText}>Odepnij</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={() =>
                    handleAddMicrocontrollerFromList(item.controller_id)
                  }
                >
                  <Text style={styles.assignButtonText}>Dodaj</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  microcontrollerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noMicrocontrollersText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  unassignButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  unassignButtonText: {
    color: "#fff",
  },
  assignButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  assignButtonText: {
    color: "#fff",
  },
});

export default AddMicrocontroller;
