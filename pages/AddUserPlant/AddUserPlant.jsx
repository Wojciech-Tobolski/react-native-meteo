import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { Txt } from "../../components/Txt/Txt";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../confiq";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AddUserPlant = ({ route, navigation }) => {
  const { plant } = route.params;
  const [customName, setCustomName] = useState(plant?.name || "");
  const [selectedImage, setSelectedImage] = useState(
    { uri: plant?.image_url } || null
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets ? result.assets[0] : result);
    }
  };

  const handleAddUserPlant = async () => {
    if (!customName) {
      alert("Proszę wpisać nazwę rośliny.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Brak autoryzacji. Zaloguj się ponownie.");
        return;
      }

      const formData = new FormData();
      formData.append("plant_id", plant.id);
      formData.append("custom_name", customName);

      if (selectedImage && selectedImage.uri) {
        formData.append("custom_image", {
          uri: selectedImage.uri,
          type: "image/jpeg",
          name: "user_plant.jpg",
        });
      }

      const response = await axios.post(`${API_URL}my-plants/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert("Roślina została dodana do Twojej kolekcji!");
        navigation.navigate("Home");
      } else {
        throw new Error("Błąd przy wysyłaniu formularza");
      }
    } catch (error) {
      console.error("Error details:", error);
      alert("Wystąpił problem z dodaniem rośliny.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header z przyciskiem powrotu */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#2e7d32" />
        </TouchableOpacity>
        <Txt style={styles.headerTitle}>Dodaj swoją roślinę</Txt>
      </View>

      <View style={styles.content}>
        {/* Sekcja ze zdjęciem */}
        <View style={styles.imageSection}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.plantImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons
                name="image-plus"
                size={50}
                color="#ccc"
              />
            </View>
          )}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.imagePickerButton}
          >
            <MaterialCommunityIcons name="camera" size={24} color="white" />
            <Txt style={styles.imagePickerText}>
              {selectedImage ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
            </Txt>
          </TouchableOpacity>
        </View>

        {/* Sekcja z nazwą */}
        <View style={styles.inputSection}>
          <View style={styles.inputHeader}>
            <MaterialCommunityIcons name="flower" size={24} color="#2e7d32" />
            <Txt style={styles.inputLabel}>Nazwa rośliny</Txt>
          </View>
          <TextInput
            value={customName}
            onChangeText={setCustomName}
            placeholder="Wpisz nazwę swojej rośliny"
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Przycisk dodawania */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddUserPlant}>
          <MaterialCommunityIcons name="plus" size={24} color="white" />
          <Txt style={styles.addButtonText}>Dodaj do kolekcji</Txt>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#2e7d32",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  plantImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  imagePickerText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: "#2e7d32",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default AddUserPlant;
