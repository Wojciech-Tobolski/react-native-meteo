// PlantDetails.js
import React from "react";
import { View, Image, ScrollView, TouchableOpacity } from "react-native";
import { Txt } from "../../components/Txt/Txt";
import { s } from "./PlantDetails.style";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const PlantDetails = ({ route }) => {
  const { plant } = route.params;
  const navigation = useNavigation();

  return (
    <View style={s.container}>
      <ScrollView style={s.scroll}>
        <Image source={{ uri: plant.image_url }} style={s.image} />
        <Txt style={s.name}>{plant.name}</Txt>
        <Txt>Typ: {plant.plant_type}</Txt>
        <Txt>Wymagania świetlne: {plant.light_requirements}</Txt>
        <Txt>Rodzaj światła: {plant.sunlight}</Txt>
        <Txt>Wilgotność gleby: {plant.humidity_requirements}%</Txt>
        <Txt>Częstotliwość podlewania: {plant.watering_frequency} dni</Txt>
        <Txt>Ilość wody na podlewanie: {plant.watering_amount} ml</Txt>
        <Txt>Poziom suchości gleby: {plant.soil_dryness_level}</Txt>
        <Txt>Temperatura optymalna: {plant.optimal_temperature}°C</Txt>
        <Txt>Minimalna temperatura: {plant.min_temperature}°C</Txt>
        <Txt>Maksymalna temperatura: {plant.max_temperature}°C</Txt>
        <Txt>Typ gleby: {plant.soil_type}</Txt>
        <Txt>Częstotliwość przesadzania: {plant.repotting_frequency}</Txt>
        <Txt>Sezon przesadzania: {plant.repotting_season}</Txt>
        <Txt>Preferowane środowisko: {plant.preferred_environment}</Txt>
        <Txt>Szkodniki: {plant.pests || "Brak"}</Txt>
        <Txt>Poziom trudności: {plant.difficulty_level}</Txt>
        <Txt>
          Wymagania dotyczące czyszczenia:{" "}
          {plant.cleaning_requirement || "Brak"}
        </Txt>
      </ScrollView>

      {/* Przycisk do dodania rośliny użytkownika */}
      <TouchableOpacity
        style={s.addButton}
        onPress={() => navigation.navigate("AddUserPlant", { plant })}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default PlantDetails;
