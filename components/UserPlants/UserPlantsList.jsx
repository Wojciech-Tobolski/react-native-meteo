import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../confiq";
import { UserPlantAPI } from "../../api/user-plants";
import { PlantAPI } from "../../api/plants";

const UserPlantList = () => {
  const [userPlants, setUserPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserPlants = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Brak autoryzacji. Zaloguj się ponownie.");
        setLoading(false);
        return;
      }

      const plants = await UserPlantAPI.getUserPlants(token);
      setUserPlants(plants);
    } catch (error) {
      console.error("Error fetching user plants:", error);
      alert("Wystąpił problem z pobraniem roślin użytkownika.");
    } finally {
      setLoading(false);
    }
  };

  const handlePressPlant = async (item) => {
    const plantDetails = await PlantAPI.getPlantDetailsById(item.plant_id);
    if (!plantDetails) {
      alert("Nie udało się pobrać danych rośliny.");
      return;
    }
    navigation.navigate("UserPlantDetails", { plant: item, plantDetails });
  };

  // Use useFocusEffect to refresh list when screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserPlants();
    }, [])
  );

  const renderItem = ({ item }) => {
    const imageUrl = item.custom_image_url || "https://via.placeholder.com/130";

    // Dodaj zabezpieczenie przed nieprawidłowym URI
    const validImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : "https://via.placeholder.com/130";
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePressPlant(item)}
      >
        <Image
          source={{ uri: validImageUrl }}
          style={styles.image}
          defaultSource={require("../../assets/placeholder.png")} // Dodaj domyślny obraz
        />
        <View style={styles.cardContent}>
          <Text style={styles.plantName}>{item.custom_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ładowanie roślin użytkownika...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userPlants}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      numColumns={2} // Number of columns fixed to 3
      columnWrapperStyle={{ justifyContent: "flex-start" }} // Ensure the last item does not occupy full width
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flexBasis: "43%",
    margin: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    alignItems: "center",
  },
  plantName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
});

export default UserPlantList;
