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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { DevicesAPI } from "../../api/devices";

const AddMicrocontroller = ({ route }) => {
  const { plantId } = route.params;
  const [microcontrollerId, setMicrocontrollerId] = useState("");
  const [userMicrocontrollers, setUserMicrocontrollers] = useState([]);
  const navigation = useNavigation();

  const fetchUserMicrocontrollers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd autoryzacji", "Zaloguj się ponownie.");
        return;
      }

      const data = await DevicesAPI.getUserMicrocontrollers(token);
      setUserMicrocontrollers(data);
    } catch (error) {
      console.error("Error fetching user microcontrollers:", error);
      Alert.alert("Błąd", "Nie udało się pobrać mikrokontrolerów.");
    }
  };

  useEffect(() => {
    fetchUserMicrocontrollers();
  }, []);

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

      const response = await DevicesAPI.AssignMicrocontroller(
        token,
        microcontrollerId,
        plantId
      );
      Alert.alert("Sukces", response.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
      fetchUserMicrocontrollers();
    } catch (error) {
      console.error("Error adding new microcontroller:", error);
      Alert.alert("Błąd", "Nie udało się dodać nowego mikrokontrolera.");
    }
  };

  const handleAddMicrocontrollerFromList = async (controllerId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd autoryzacji", "Zaloguj się ponownie.");
        return;
      }

      const response = await DevicesAPI.AssignMicrocontroller(
        token,
        controllerId,
        plantId
      );
      Alert.alert("Sukces", response.message, [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
      fetchUserMicrocontrollers();
    } catch (error) {
      console.error("Error assigning microcontroller:", error);
      Alert.alert("Błąd", "Nie udało się przypisać mikrokontrolera.");
    }
  };

  const handleUnassignMicrocontroller = async (controllerId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd autoryzacji", "Zaloguj się ponownie.");
        return;
      }

      await DevicesAPI.unassignMicrocontroller(token, controllerId);
      Alert.alert("Sukces", "Mikrokontroler został odpięty od rośliny.");
      fetchUserMicrocontrollers();
    } catch (error) {
      console.error("Error unassigning microcontroller:", error);
      Alert.alert("Błąd", "Nie udało się odpiąć mikrokontrolera.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Wróć</Text>
      </TouchableOpacity>

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
