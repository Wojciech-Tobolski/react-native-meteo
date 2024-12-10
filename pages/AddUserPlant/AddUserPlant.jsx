// UserPlantForm.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Txt } from "../../components/Txt/Txt";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../confiq";

const AddUserPlant = ({ route, navigation }) => {
  const { plant } = route.params;
  const [customName, setCustomName] = useState(plant?.name || "");
  const [isOutdoor, setIsOutdoor] = useState(false);
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
      // Uzyskaj token autoryzacyjny z AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Brak autoryzacji. Zaloguj się ponownie.");
        return;
      }

      const formData = new FormData();
      formData.append("plant_id", plant.id);
      formData.append("custom_name", customName);
      formData.append("is_outdoor", isOutdoor);

      if (selectedImage && selectedImage.uri) {
        formData.append("custom_image", {
          uri: selectedImage.uri,
          type: "image/jpeg", // Typ obrazu (domyślnie image/jpeg)
          name: "user_plant.jpg", // Nazwa pliku
        });
      }

      console.log("Wysyłane dane:", formData);

      const response = await axios.post(
        `${API_URL}user-plants/add_new_user_plant`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Dodanie tokenu do nagłówka
          },
        }
      );

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
    <View style={styles.container}>
      <Txt>Nazwa rośliny:</Txt>
      <TextInput
        value={customName}
        onChangeText={setCustomName}
        placeholder="Wpisz nazwę rośliny"
        style={styles.input}
      />

      <Txt>Czy roślina jest na zewnątrz?</Txt>
      <TouchableOpacity
        onPress={() => setIsOutdoor(!isOutdoor)}
        style={styles.checkboxContainer}
      >
        <MaterialIcons
          name={isOutdoor ? "check-box" : "check-box-outline-blank"}
          size={24}
          color="black"
        />
        <Txt>{isOutdoor ? "Tak" : "Nie"}</Txt>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Txt>Zmień zdjęcie rośliny</Txt>
      </TouchableOpacity>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage.uri }}
          style={{ width: 100, height: 100, marginVertical: 10 }}
        />
      )}

      <Button title="Dodaj roślinę" onPress={handleAddUserPlant} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  imagePickerButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
  },
});

export default AddUserPlant;
