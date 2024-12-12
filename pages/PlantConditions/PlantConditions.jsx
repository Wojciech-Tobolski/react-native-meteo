import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"; // Import ikon z expo

import { API_URL } from "../../confiq";

const PlantConditions = ({ route }) => {
  const { plantId } = route.params;
  const [latestData, setLatestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchLatestSensorData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd", "Brak autoryzacji. Zaloguj się ponownie.");
        return;
      }

      const response = await axios.get(
        `${API_URL}devices/data/${plantId}/latest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLatestData(response.data);
    } catch (error) {
      console.error("Error fetching latest sensor data:", error);
      Alert.alert("Błąd", "Nie udało się pobrać danych z czujników.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestSensorData();
  }, []);

  const checkRange = (value, min, max) => {
    return value >= min && value <= max;
  };

  const renderSensorValue = (label, value, min, max, unit) => {
    const roundedValue = value.toFixed(1);
    const inRange = checkRange(value, min, max);

    return (
      <View style={styles.dataRow}>
        <Text style={styles.label}>{label}</Text>
        <Text
          style={[styles.value, inRange ? styles.inRange : styles.outOfRange]}
        >
          {roundedValue} {unit}
        </Text>
        <Text style={styles.suggestedValue}>
          Sugerowane: {min} - {max} {unit}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!latestData) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Brak danych z czujników.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Strzałka powrotu */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Wróć</Text>
        </TouchableOpacity>

        {/* Ikony synchronizacji i wykresów */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={fetchLatestSensorData}
            style={styles.iconButton}
          >
            <MaterialIcons name="sync" size={24} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PlantConditionsChart", { plantId })
            }
            style={styles.iconButton}
          >
            <MaterialIcons name="show-chart" size={24} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Dane z czujników</Text>
      <Text style={styles.lastMeasurement}>
        Ostatnie pomiary:{" "}
        {latestData.latest_data.timestamp
          ? new Date(latestData.latest_data.timestamp).toLocaleString()
          : "Brak danych"}
      </Text>

      {renderSensorValue(
        "Wilgotność gleby",
        latestData.latest_data.soil_moisture,
        latestData.suggested_ranges.min_soil_humidity,
        latestData.suggested_ranges.max_soil_humidity,
        "%"
      )}
      {renderSensorValue(
        "Temperatura",
        latestData.latest_data.temperature,
        latestData.suggested_ranges.min_temperature,
        latestData.suggested_ranges.max_temperature,
        "°C"
      )}
      {renderSensorValue(
        "Wilgotność powietrza",
        latestData.latest_data.humidity,
        latestData.suggested_ranges.min_air_humidity,
        latestData.suggested_ranges.max_air_humidity,
        "%"
      )}
      {renderSensorValue(
        "Poziom światła",
        latestData.latest_data.light_level,
        latestData.suggested_ranges.min_light_level,
        latestData.suggested_ranges.max_light_level,
        "lx"
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  iconsContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  lastMeasurement: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  dataRow: {
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
  },
  suggestedValue: {
    fontSize: 14,
    color: "#888",
    textAlign: "right",
    marginTop: 5,
  },
  inRange: {
    color: "#4CAF50",
  },
  outOfRange: {
    color: "#f44336",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default PlantConditions;
