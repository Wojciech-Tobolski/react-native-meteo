import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Txt } from "../../components/Txt/Txt";
import { MeteoInfo } from "../../components/MeteoInfo/MeteoInfo";
import { getWeatherInterpretation } from "../../utils/meteo-utils";
import UserPlantList from "../../components/UserPlants/UserPlantsList";
import { StatusBar } from "react-native";
import Constants from "expo-constants";
import { Bell } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useNotifications } from "../../hooks/useNotifications";

export function Home({ weather, city, onSubmitSearch }) {
  const navigation = useNavigation();
  const { unreadCount } = useNotifications();

  if (!weather || !weather.current_weather) {
    return (
      <View style={styles.loadingContainer}>
        <Txt style={styles.loadingText}>Ładowanie danych pogodowych...</Txt>
      </View>
    );
  }

  const currentWeather = weather.current_weather;
  const currentInterpretation = getWeatherInterpretation(
    currentWeather.weathercode
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Górny pasek z pogodą i powiadomieniami */}
      <View style={styles.topBar}>
        {/* Sekcja pogodowa */}
        <View style={styles.weatherSection}>
          <MeteoInfo
            dailyWeather={weather.daily}
            city={city}
            interpretation={currentInterpretation}
            temperature={Math.round(currentWeather.temperature)}
            sunrise={weather.daily.sunrise[0].split("T")[1]}
            sunset={weather.daily.sunset[0].split("T")[1]}
          />
        </View>

        {/* Przycisk powiadomień */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate("Notifications")}
        >
          <Bell size={24} color="white" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Sekcja roślin */}
      <View style={styles.plantsSection}>
        <Txt style={styles.sectionTitle}>Twoje rośliny</Txt>
        <View style={styles.plantListContainer}>
          <UserPlantList />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  weatherSection: {
    paddingRight: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 40,
    padding: 20,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  plantsSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  plantListContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
});
