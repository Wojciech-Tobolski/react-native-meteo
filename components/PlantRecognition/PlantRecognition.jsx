import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function PlantRecognition() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [plantInfo, setPlantInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Funkcja do robienia zdjęcia
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setSelectedImage(result.assets ? result.assets[0] : result);
      }
    } else {
      alert("Camera permission is required!");
    }
  };

  // Funkcja do wyboru zdjęcia z galerii
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setSelectedImage(result.assets ? result.assets[0] : result);
    }
  };

  // Funkcja do identyfikacji rośliny
  const identifyPlant = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("images", {
      uri: selectedImage.uri,
      type: "image/jpeg",
      name: "plant.jpg",
    });
    formData.append("latitude", "51.5074");
    formData.append("longitude", "-0.1278");
    formData.append("similar_images", "True");

    try {
      const response = await axios.post(
        "https://api.plant.id/v3/identification",
        formData,
        {
          headers: {
            "Api-Key": "7J0DHMu8IsOhuey6Oiw1Vq22BjSutuFoB1LMVJclE840ENPctH",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Logowanie całej odpowiedzi API
      console.log("API Response:", response.data);

      const suggestions = response.data.result?.classification?.suggestions;

      if (suggestions && suggestions.length > 0) {
        setPlantInfo(suggestions); // Przypisanie sugestii do stanu
      } else {
        setError("No plant identified.");
      }
    } catch (err) {
      setError("Error identifying plant: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja do weryfikacji i dodania rośliny
  const verifyAndAddPlant = (plant) => {
    alert(`Verifying and adding plant: ${plant.name}`);
    // Tutaj możesz dodać logikę do weryfikacji i dodawania rośliny
  };

  // Komponent renderujący kafelki
  const renderPlantItem = ({ item }) => {
    // Sprawdzamy dostępność obrazów i logujemy URL
    if (item.similar_images && item.similar_images.length > 0) {
      item.similar_images.forEach((image, index) => {
        console.log(`Image ${index + 1} URL:`, image.url_small); // Logowanie URL obrazu
      });
    } else {
      console.log("No similar images available");
    }

    return (
      <View style={styles.card}>
        {item.similar_images && item.similar_images.length > 0 ? (
          item.similar_images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.url_small }}
              style={styles.image}
            />
          ))
        ) : (
          <Text>No image available</Text>
        )}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.probability}>
          Probability: {Math.round(item.probability * 100)}%
        </Text>
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={() => verifyAndAddPlant(item)}
        >
          <Text style={styles.verifyButtonText}>Verify & Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Select or take a photo of the plant</Text>
      <Button title="Pick an image from gallery" onPress={pickImage} />
      <Button title="Take a photo" onPress={takePhoto} />

      {selectedImage && (
        <Image
          source={{ uri: selectedImage.uri }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}

      <Button
        title="Identify Plant"
        onPress={identifyPlant}
        disabled={loading}
      />

      {/* Wyświetlanie wyników w formie kafelków */}
      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {plantInfo.length > 0 && !loading && (
        <FlatList
          data={plantInfo}
          renderItem={renderPlantItem}
          keyExtractor={(item) => item.id}
          numColumns={2} // Wyświetlanie 2 kafelków w jednym wierszu
        />
      )}
    </View>
  );
}

// Style dla kafelków
const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  probability: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  verifyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
