import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// Adres URL Twojego backendu
const BACKEND_URL = "http://192.168.1.32:8000"; // Dostosuj adres IP

const PlantItem = ({ plant }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `${BACKEND_URL}${plant.image_url}` }}
        style={styles.image}
      />
      <Text style={styles.name}>{plant.name}</Text>
      <Text>Typ: {plant.plant_type}</Text>
      <Text>Wymagania światła: {plant.light_requirements}</Text>
      <Text>Wilgotność: {plant.humidity_requirements}</Text>
      <Text>Częstotliwość podlewania: {plant.watering_frequency}</Text>
      <Text>Temperatura optymalna: {plant.optimal_temperature}</Text>
      <Text>Typ gleby: {plant.soil_type}</Text>
      <Text>
        Przesadzanie: {new Date(plant.transplanting_time).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default PlantItem;
