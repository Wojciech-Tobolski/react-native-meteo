import React, { useState } from "react";
import { Txt } from "../Txt/Txt";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { PlantAPI } from "../../api/Plant";
import { s } from "./PlantForm.style";
import { ScrollView } from "react-native";

export default function PlantForm() {
  const [name, setName] = useState("");
  const [plantType, setPlantType] = useState("");
  const [lightRequirement, setLightRequirement] = useState("wysokie"); // Zmienione na "wysokie"
  const [sunlight, setSunlight] = useState("pełne słońce"); // Zmienione na "pełne słońce"
  const [humidityRequirement, setHumidityRequirement] = useState(50);
  const [wateringFrequency, setWateringFrequency] = useState(7);
  const [wateringAmount, setWateringAmount] = useState(200);
  const [soilDrynessLevel, setSoilDrynessLevel] = useState("lekko wysuszona"); // Zmienione na "lekko wysuszona"
  const [optimalTemperature, setOptimalTemperature] = useState(22);
  const [minTemperature, setMinTemperature] = useState(0);
  const [maxTemperature, setMaxTemperature] = useState(40);
  const [soilType, setSoilType] = useState("");
  const [repottingFrequency, setRepottingFrequency] = useState("");
  const [repottingSeason, setRepottingSeason] = useState("");
  const [preferredEnvironment, setPreferredEnvironment] = useState("domowe"); // Zmienione na "domowe"
  const [pests, setPests] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("łatwy"); // Zmienione na "łatwy"
  const [cleaningRequirement, setCleaningRequirement] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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

  const submitForm = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("plant_type", plantType);
    formData.append("light_requirements", lightRequirement);
    formData.append("sunlight", sunlight);
    formData.append("humidity_requirements", humidityRequirement);
    formData.append("watering_frequency", wateringFrequency);
    formData.append("watering_amount", wateringAmount);
    formData.append("soil_dryness_level", soilDrynessLevel);
    formData.append("optimal_temperature", optimalTemperature);
    formData.append("min_temperature", minTemperature);
    formData.append("max_temperature", maxTemperature);
    formData.append("soil_type", soilType);
    formData.append("repotting_frequency", repottingFrequency);
    formData.append("repotting_season", repottingSeason);
    formData.append("preferred_environment", preferredEnvironment);
    formData.append("pests", pests);
    formData.append("difficulty_level", difficultyLevel);
    formData.append("cleaning_requirement", cleaningRequirement);

    if (selectedImage) {
      formData.append("image", {
        uri: selectedImage.uri,
        type: "image/jpeg",
        name: "plant.jpg",
      });
    }
    formData._parts.forEach((part) => {
      console.log(part[0], part[1]);
    });

    await PlantAPI.addNewPlant(formData); // Wywołaj handleFormSubmit z api.js
  };

  return (
    <View style={s.container}>
      <ScrollView>
        <Txt>Nazwa rośliny:</Txt>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Wpisz nazwę rośliny"
        />

        <Txt>Typ rośliny:</Txt>
        <TextInput
          value={plantType}
          onChangeText={setPlantType}
          placeholder="Wpisz typ rośliny"
        />

        <Txt>Wymagania świetlne:</Txt>
        <Picker
          selectedValue={lightRequirement}
          onValueChange={setLightRequirement}
        >
          <Picker.Item label="Wysokie" value="wysokie" />
          <Picker.Item label="Średnie" value="średnie" />
          <Picker.Item label="Niskie" value="niskie" />
        </Picker>

        <Txt>Rodzaj światła:</Txt>
        <Picker selectedValue={sunlight} onValueChange={setSunlight}>
          <Picker.Item label="Pełne słońce" value="pełne słońce" />
          <Picker.Item label="Półcień" value="półcień" />
          <Picker.Item label="Cień" value="cień" />
          <Picker.Item
            label="Rozproszone światło"
            value="rozproszone światło"
          />
        </Picker>

        <Txt>Wymagania wilgotności gleby (%):</Txt>
        <Slider
          value={humidityRequirement}
          onValueChange={setHumidityRequirement}
          minimumValue={0}
          maximumValue={100}
          step={1}
        />
        <Txt>{humidityRequirement}%</Txt>

        <Txt>Częstotliwość podlewania (dni):</Txt>
        <Slider
          value={wateringFrequency}
          onValueChange={setWateringFrequency}
          minimumValue={1}
          maximumValue={30}
          step={1}
        />
        <Txt>{wateringFrequency} dni</Txt>

        <Txt>Ilość wody (ml):</Txt>
        <TextInput
          value={wateringAmount.toString()}
          onChangeText={(value) => setWateringAmount(Number(value))}
          keyboardType="numeric"
        />

        <Txt>Poziom suchości gleby:</Txt>
        <Picker
          selectedValue={soilDrynessLevel}
          onValueChange={setSoilDrynessLevel}
        >
          <Picker.Item label="Wilgotna" value="wilgotna" />
          <Picker.Item label="Lekko wysuszona" value="lekko wysuszona" />
          <Picker.Item label="Sucha" value="sucha" />
        </Picker>

        <Txt>Optymalna temperatura (°C):</Txt>
        <Slider
          value={optimalTemperature}
          onValueChange={setOptimalTemperature}
          minimumValue={-10}
          maximumValue={40}
          step={1}
        />
        <Txt>{optimalTemperature}°C</Txt>

        <Txt>Minimalna temperatura (°C):</Txt>
        <Slider
          value={minTemperature}
          onValueChange={setMinTemperature}
          minimumValue={-20}
          maximumValue={40}
          step={1}
        />
        <Txt>{minTemperature}°C</Txt>

        <Txt>Maksymalna temperatura (°C):</Txt>
        <Slider
          value={maxTemperature}
          onValueChange={setMaxTemperature}
          minimumValue={-20}
          maximumValue={50}
          step={1}
        />
        <Txt>{maxTemperature}°C</Txt>

        <Txt>Typ gleby:</Txt>
        <TextInput
          value={soilType}
          onChangeText={setSoilType}
          placeholder="Np. piaszczysta, gliniasta"
        />

        <Txt>Częstotliwość przesadzania:</Txt>
        <TextInput
          value={repottingFrequency}
          onChangeText={setRepottingFrequency}
          placeholder="Np. co 1-2 lata"
        />

        <Txt>Sezon przesadzania:</Txt>
        <TextInput
          value={repottingSeason}
          onChangeText={setRepottingSeason}
          placeholder="Np. wiosna, jesień"
        />

        <Txt>Preferowane środowisko:</Txt>
        <Picker
          selectedValue={preferredEnvironment}
          onValueChange={setPreferredEnvironment}
        >
          <Picker.Item label="Domowe" value="domowe" />
          <Picker.Item label="Zewnętrzne" value="zewnętrzne" />
        </Picker>

        <Txt>Informacje o szkodnikach:</Txt>
        <TextInput
          value={pests}
          onChangeText={setPests}
          placeholder="Szkodniki (jeśli występują)"
        />

        <Txt>Poziom trudności:</Txt>
        <Picker
          selectedValue={difficultyLevel}
          onValueChange={setDifficultyLevel}
        >
          <Picker.Item label="Łatwy" value="łatwy" />
          <Picker.Item label="Średni" value="średni" />
          <Picker.Item label="Trudny" value="trudny" />
        </Picker>

        <Txt>Konieczność czyszczenia liści:</Txt>
        <TextInput
          value={cleaningRequirement}
          onChangeText={setCleaningRequirement}
          placeholder="Czyszczenie liści"
        />

        <TouchableOpacity onPress={pickImage}>
          <Txt>Wybierz zdjęcie rośliny</Txt>
        </TouchableOpacity>
        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={{ width: 100, height: 100 }}
          />
        )}
      </ScrollView>
      <Button title="Dodaj roślinę" onPress={submitForm} />
    </View>
  );
}
