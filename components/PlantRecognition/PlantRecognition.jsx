import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

export default function PlantRecognition() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [plantInfo, setPlantInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const suggestions = response.data.result?.classification?.suggestions;
      if (suggestions && suggestions.length > 0) {
        setPlantInfo(suggestions);
      } else {
        setError("No plant identified.");
      }
    } catch (err) {
      setError("Error identifying plant: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const ResultsList = () => {
    if (!plantInfo.length || loading) return null;

    return (
      <View style={styles.resultsContainer}>
        {plantInfo.map((item) => (
          <View key={item.id?.toString()} style={styles.card}>
            <View style={styles.imageContainer}>
              {item.similar_images && item.similar_images.length > 0 ? (
                <Image
                  source={{ uri: item.similar_images[0].url_small }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.noImageContainer}>
                  <MaterialIcons
                    name="image-not-supported"
                    size={40}
                    color="#666"
                  />
                </View>
              )}
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.probabilityContainer}>
              <MaterialIcons name="analytics" size={16} color="#666" />
              <Text style={styles.probability}>
                {Math.round(item.probability * 100)}%
              </Text>
            </View>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => alert(`Verifying: ${item.name}`)}
            >
              <MaterialIcons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.verifyButtonText}>Verify & Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.headerText}>Plant Recognition</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <MaterialIcons name="photo-library" size={24} color="#fff" />
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <MaterialIcons name="camera-alt" size={24} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.selectedImage}
            resizeMode="cover"
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.identifyButton, loading && styles.buttonDisabled]}
        onPress={identifyPlant}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="search" size={24} color="#fff" />
            <Text style={styles.buttonText}>Identify Plant</Text>
          </>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ResultsList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(245, 245, 245, 0.4)",
    marginBottom: 60,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  selectedImageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  identifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffe5e5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff6b6b",
    marginLeft: 8,
    fontSize: 14,
  },
  resultsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  probabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  probability: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  verifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 6,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
});
