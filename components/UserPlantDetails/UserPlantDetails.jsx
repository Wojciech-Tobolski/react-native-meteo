import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserPlantDetails = ({ route }) => {
  const { plant, plantDetails } = route.params;
  const navigation = useNavigation();

  const deletePlant = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Brak autoryzacji. Zaloguj się ponownie.");
        return;
      }

      await axios.delete(
        `http://192.168.1.32:8000/user-plants/deleted/${plant.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Sukces", "Roślina została usunięta.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error deleting plant:", error);
      alert("Wystąpił problem z usunięciem rośliny.");
    }
  };

  if (!plantDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Plant details not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerButtonsContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <View style={styles.headerActionButtonsContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={deletePlant}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerContainer}>
        <Image source={{ uri: plant.custom_image_url }} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{plant.custom_name}</Text>
          <Text style={styles.subtitle}>
            {plantDetails.plant_type || "Unknown Type"} •{" "}
            {plantDetails.name || "Unknown Name"}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.diagnoseButton}>
        <Text style={styles.diagnoseButtonText}>Diagnose for further info</Text>
      </TouchableOpacity>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About </Text>
        <Text style={styles.aboutText}>
          {plantDetails.description || "No information available."}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Details </Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Temperature: </Text>
          <Text style={styles.detailValue}>{`${
            plantDetails.min_temperature || "N/A"
          }°C - ${plantDetails.max_temperature || "N/A"}°C`}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Light Requirements: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.light_requirements || "N/A"}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Sunlight: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.sunlight || "N/A"}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Watering Frequency: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.watering_frequency
              ? `Every ${plantDetails.watering_frequency} days`
              : "N/A"}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Humidity Requirements: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.humidity_requirements
              ? `${plantDetails.humidity_requirements}%`
              : "N/A"}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Soil Type: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.soil_type || "N/A"}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Repotting Frequency: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.repotting_frequency || "N/A"}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Pests: </Text>
          <Text style={styles.detailValue}>{plantDetails.pests || "None"}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#333",
  },
  headerActionButtonsContainer: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerContainer: {
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 15,
  },
  titleContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  diagnoseButton: {
    backgroundColor: "#ff6666",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
  diagnoseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailValue: {
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#f44336",
    textAlign: "center",
  },
});

export default UserPlantDetails;
