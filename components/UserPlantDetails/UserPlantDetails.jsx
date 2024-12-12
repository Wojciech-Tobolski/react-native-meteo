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
import { API_URL } from "../../confiq";
import { UserPlantAPI } from "../../api/user-plants";

const UserPlantDetails = ({ route }) => {
  const { plant, plantDetails } = route.params;
  const navigation = useNavigation();

  const deletePlant = async (plantId, navigation) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd", "Brak autoryzacji. Zaloguj się ponownie.");
        return;
      }

      const status = await UserPlantAPI.deleteUserPlant(token, plantId);
      if (status === 200) {
        Alert.alert("Sukces", "Roślina została usunięta.", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Błąd", "Wystąpił problem z usunięciem rośliny.");
      }
    } catch (error) {
      console.error("Błąd podczas usuwania rośliny:", error);
      Alert.alert("Błąd", "Wystąpił problem z usunięciem rośliny.");
    }
  };

  if (!plantDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Szczegóły rośliny są niedostępne.</Text>
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
          <Text style={styles.backButtonText}>{"< Powrót"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Image source={{ uri: plant.custom_image_url }} style={styles.image} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{plant.custom_name}</Text>
          <Text style={styles.subtitle}>
            {plantDetails.plant_type || "Nieznany typ"} •{" "}
            {plantDetails.name || "Nieznana nazwa"}
          </Text>
        </View>
      </View>

      {plant.has_microcontroller === false ? (
        <TouchableOpacity
          style={styles.diagnoseButton}
          onPress={() =>
            navigation.navigate("AddMicrocontroller", {
              plantId: plant.id,
            })
          }
        >
          <Text style={styles.diagnoseButtonText}>Dodaj mikroasystenta</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.diagnoseButton}
          onPress={() =>
            navigation.navigate("PlantConditions", {
              plantId: plant.id,
            })
          }
        >
          <Text style={styles.diagnoseButtonText}>Pokaż warunki rośliny</Text>
        </TouchableOpacity>
      )}

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Opis</Text>
        <Text style={styles.aboutText}>
          {plantDetails.description || "Brak informacji."}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Szczegóły</Text>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Temperatura: </Text>
          <Text style={styles.detailValue}>{`${
            plantDetails.min_temperature || "N/A"
          }°C - ${plantDetails.max_temperature || "N/A"}°C`}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Maksymalne nasłonecznienie: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.max_sunlight || "Brak danych"} lux
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Minimalne nasłonecznienie: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.min_sunlight || "Brak danych"} lux
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Wilgotność gleby: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.min_soil_humidity || "N/A"}% -{" "}
            {plantDetails.max_soil_humidity || "N/A"}%
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Wilgotność powietrza: </Text>
          <Text style={styles.detailValue}>
            {plantDetails.min_air_humidity || "N/A"}% -{" "}
            {plantDetails.max_air_humidity || "N/A"}%
          </Text>
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
