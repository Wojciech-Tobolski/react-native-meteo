import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Txt } from "../Txt/Txt";
const PlantGrid = () => {
  const [plants, setPlants] = useState([]);
  const navigation = useNavigation();

  const fetchPlants = async () => {
    try {
      const response = await axios.get("http://192.168.1.32:8000/admin/plants"); // Zaktualizuj URL do swojego API
      setPlants(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu roślin:", error);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.plantItem}
      onPress={() => navigation.navigate("PlantDetails", { plant: item })}
    >
      <Image source={{ uri: item.image_url }} style={styles.plantImage} />
      <Txt style={styles.plantName}>{item.name}</Txt>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={plants}
      renderItem={renderPlantItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={1} // Wyświetlanie 2 elementów w wierszu
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={true} // Pokaż wskaźnik przewijania
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingVertical: 10,
  },
  plantItem: {
    flex: 1,
    margin: 10,
    alignItems: "center",
  },
  plantImage: {
    width: 180,
    height: 250,
    borderRadius: 10,
  },
  plantName: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
});

export default PlantGrid;
