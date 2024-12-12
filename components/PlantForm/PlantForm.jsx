import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Txt } from "../Txt/Txt";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PlantAPI } from "../../api/plants";

export default function PlantForm() {
  // Basic info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [plantType, setPlantType] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  // Environmental requirements
  const [minTemperature, setMinTemperature] = useState("15");
  const [maxTemperature, setMaxTemperature] = useState("25");
  const [minSunlight, setMinSunlight] = useState("1000");
  const [maxSunlight, setMaxSunlight] = useState("10000");
  const [minSoilHumidity, setMinSoilHumidity] = useState("40");
  const [maxSoilHumidity, setMaxSoilHumidity] = useState("60");
  const [minAirHumidity, setMinAirHumidity] = useState("40");
  const [maxAirHumidity, setMaxAirHumidity] = useState("60");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const submitForm = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("plant_type", plantType);
    formData.append("min_temperature", minTemperature);
    formData.append("max_temperature", maxTemperature);
    formData.append("min_sunlight", minSunlight);
    formData.append("max_sunlight", maxSunlight);
    formData.append("min_soil_humidity", minSoilHumidity);
    formData.append("max_soil_humidity", maxSoilHumidity);
    formData.append("min_air_humidity", minAirHumidity);
    formData.append("max_air_humidity", maxAirHumidity);

    if (imageUrl) {
      formData.append("image", {
        uri: imageUrl,
        type: "image/jpeg",
        name: "plant.jpg",
      });
    }

    formData._parts.forEach((part) => {
      console.log(part[0], part[1]);
    });

    await PlantAPI.addNewPlant(formData);
  };

  const InputField = React.memo(
    ({
      icon,
      title,
      value,
      setValue,
      placeholder,
      unit = "",
      keyboardType = "default",
    }) => (
      <View style={styles.inputContainer}>
        <View style={styles.inputHeader}>
          <MaterialCommunityIcons name={icon} size={24} color="#2e7d32" />
          <Txt style={styles.inputTitle}>{title}</Txt>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoComplete="off" // Dodane
            autoCorrect={false} // Dodane
            spellCheck={false} // Dodane
            blurOnSubmit={false}
            returnKeyType="next" // Zmienione z "done" na "next"
            enablesReturnKeyAutomatically={false} // Zmienione
          />
          {unit && <Txt style={styles.unitText}>{unit}</Txt>}
        </View>
      </View>
    )
  );

  return (
    <ScrollView style={styles.container}>
      {/* Podstawowe informacje */}
      <View style={styles.section}>
        <Txt style={styles.sectionTitle}>Podstawowe informacje</Txt>

        <InputField
          icon="flower"
          title="Nazwa rośliny"
          value={name}
          setValue={setName}
          placeholder="Wpisz nazwę rośliny"
        />

        <InputField
          icon="sprout"
          title="Typ rośliny"
          value={plantType}
          setValue={setPlantType}
          placeholder="Wpisz typ rośliny"
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <MaterialCommunityIcons name="text" size={24} color="#2e7d32" />
            <Txt style={styles.inputTitle}>Opis</Txt>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Dodaj opis rośliny"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <MaterialCommunityIcons name="image-plus" size={24} color="#fff" />
          <Txt style={styles.imageButtonText}>Wybierz zdjęcie</Txt>
        </TouchableOpacity>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      </View>

      {/* Wymagania środowiskowe */}
      <View style={styles.section}>
        <Txt style={styles.sectionTitle}>Wymagania środowiskowe</Txt>

        <View style={styles.subsection}>
          <Txt style={styles.subsectionTitle}>Temperatura</Txt>
          <InputField
            icon="thermometer-low"
            title="Minimalna temperatura"
            value={minTemperature}
            setValue={setMinTemperature}
            placeholder="0"
            unit="°C"
            keyboardType="numeric"
          />
          <InputField
            icon="thermometer-high"
            title="Maksymalna temperatura"
            value={maxTemperature}
            setValue={setMaxTemperature}
            placeholder="40"
            unit="°C"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subsection}>
          <Txt style={styles.subsectionTitle}>Nasłonecznienie</Txt>
          <InputField
            icon="weather-sunny"
            title="Minimalne nasłonecznienie"
            value={minSunlight}
            setValue={setMinSunlight}
            placeholder="1000"
            unit="lux"
            keyboardType="numeric"
          />
          <InputField
            icon="weather-sunny-alert"
            title="Maksymalne nasłonecznienie"
            value={maxSunlight}
            setValue={setMaxSunlight}
            placeholder="10000"
            unit="lux"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subsection}>
          <Txt style={styles.subsectionTitle}>Wilgotność gleby</Txt>
          <InputField
            icon="water-outline"
            title="Minimalna wilgotność"
            value={minSoilHumidity}
            setValue={setMinSoilHumidity}
            placeholder="40"
            unit="%"
            keyboardType="numeric"
          />
          <InputField
            icon="water"
            title="Maksymalna wilgotność"
            value={maxSoilHumidity}
            setValue={setMaxSoilHumidity}
            placeholder="60"
            unit="%"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.subsection}>
          <Txt style={styles.subsectionTitle}>Wilgotność powietrza</Txt>
          <InputField
            icon="air-humidifier"
            title="Minimalna wilgotność"
            value={minAirHumidity}
            setValue={setMinAirHumidity}
            placeholder="40"
            unit="%"
            keyboardType="numeric"
          />
          <InputField
            icon="air-humidifier-off"
            title="Maksymalna wilgotność"
            value={maxAirHumidity}
            setValue={setMaxAirHumidity}
            placeholder="60"
            unit="%"
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={submitForm}>
        <MaterialCommunityIcons name="content-save" size={24} color="#fff" />
        <Txt style={styles.submitButtonText}>Zapisz roślinę</Txt>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2e7d32",
  },
  subsection: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1b5e20",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputTitle: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    backgroundColor: "#fff",
  },
  unitText: {
    marginLeft: 8,
    color: "#666",
    width: 40,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 4,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#2e7d32",
    padding: 16,
    marginBottom: 100,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
