// PlantDetails.js
import React from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Txt } from "../../components/Txt/Txt";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DetailsRow = ({ icon, title, value, unit = "" }) => {
  if (!value && value !== 0) return null;

  return (
    <View style={styles.detailsRow}>
      <MaterialCommunityIcons name={icon} size={24} color="#2e7d32" />
      <View style={styles.detailsContent}>
        <Txt style={styles.detailsTitle}>{title}</Txt>
        <Txt style={styles.detailsValue}>
          {value}
          {unit}
        </Txt>
      </View>
    </View>
  );
};

const PlantDetails = ({ route }) => {
  const { plant } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: plant.image_url }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <Txt style={styles.name}>{plant.name}</Txt>
            {plant.plant_type && (
              <Txt style={styles.type}>{plant.plant_type}</Txt>
            )}
          </View>
        </View>

        <View style={styles.content}>
          {plant.description && (
            <View style={styles.descriptionContainer}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color="#2e7d32"
              />
              <Txt style={styles.description}>{plant.description}</Txt>
            </View>
          )}

          <View style={styles.section}>
            <Txt style={styles.sectionTitle}>Temperatura</Txt>
            <DetailsRow
              icon="thermometer-low"
              title="Minimalna temperatura"
              value={plant.min_temperature}
              unit="°C"
            />
            <DetailsRow
              icon="thermometer-high"
              title="Maksymalna temperatura"
              value={plant.max_temperature}
              unit="°C"
            />
          </View>

          <View style={styles.section}>
            <Txt style={styles.sectionTitle}>Nasłonecznienie</Txt>
            <DetailsRow
              icon="weather-sunny"
              title="Minimalne nasłonecznienie"
              value={plant.min_sunlight}
              unit=" lux"
            />
            <DetailsRow
              icon="weather-sunny-alert"
              title="Maksymalne nasłonecznienie"
              value={plant.max_sunlight}
              unit=" lux"
            />
          </View>

          <View style={styles.section}>
            <Txt style={styles.sectionTitle}>Wilgotność gleby</Txt>
            <DetailsRow
              icon="water-outline"
              title="Minimalna wilgotność"
              value={plant.min_soil_humidity}
              unit="%"
            />
            <DetailsRow
              icon="water"
              title="Maksymalna wilgotność"
              value={plant.max_soil_humidity}
              unit="%"
            />
          </View>

          <View style={styles.section}>
            <Txt style={styles.sectionTitle}>Wilgotność powietrza</Txt>
            <DetailsRow
              icon="air-humidifier"
              title="Minimalna wilgotność"
              value={plant.min_air_humidity}
              unit="%"
            />
            <DetailsRow
              icon="air-humidifier-off"
              title="Maksymalna wilgotność"
              value={plant.max_air_humidity}
              unit="%"
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddUserPlant", { plant })}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Txt style={styles.addButtonText}>Dodaj do moich roślin</Txt>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scroll: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  type: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  description: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailsContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailsTitle: {
    fontSize: 14,
    color: "#666",
  },
  detailsValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e7d32",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default PlantDetails;
