import { Alert, ImageBackground, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import * as Notifications from "expo-notifications";

// Lokalne importy
import { MeteoAPI } from "./api/meteo";
import { AppNavigator } from "./navigation";
import backgroundImage from "./assets/background.png";
import { useAuth } from "./hooks/useAuth";

// Konfiguracja powiadomień
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const navTheme = {
  colors: {
    background: "transparent",
  },
};

export default function App() {
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuth();
  const [coordinates, setCoordinates] = useState();
  const [city, setCity] = useState();
  const [weather, setWeather] = useState();

  const [isFontLoaded] = useFonts({
    "Alata-Regular": require("./assets/fonts/Alata-Regular.ttf"),
  });

  useEffect(() => {
    checkAuth(); // Sprawdź stan autoryzacji przy starcie
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getUserCoordinates();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (coordinates) {
      fetchLocationData();
    }
  }, [coordinates]);

  const getUserCoordinates = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await getCurrentPositionAsync();
        setCoordinates({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } else {
        setCoordinates({ lat: "48.85", lng: "2.35" });
      }
    } catch (error) {
      console.error("Błąd pobierania lokalizacji:", error);
      setCoordinates({ lat: "48.85", lng: "2.35" });
    }
  };

  const fetchLocationData = async () => {
    try {
      const [cityResponse, weatherResponse] = await Promise.all([
        MeteoAPI.fetchCityByCoords(coordinates),
        MeteoAPI.fetchWeatherByCoords(coordinates),
      ]);
      setCity(cityResponse);
      setWeather(weatherResponse);
    } catch (error) {
      console.error("Błąd pobierania danych lokalizacji:", error);
      Alert.alert("Błąd", "Nie udało się pobrać danych lokalizacji");
    }
  };

  const handleLoginSuccess = async () => {
    try {
      console.log("Login success - getting coordinates");
      await getUserCoordinates();
      console.log("Coordinates retrieved after login");
    } catch (error) {
      console.error("Błąd po logowaniu:", error);
    }
  };

  if (authLoading || !isFontLoaded) {
    return null; // Tutaj możesz dodać komponent ładowania
  }

  return (
    <NavigationContainer theme={navTheme}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaProvider>
          <SafeAreaView style={styles.container} edges={["top"]}>
            <AppNavigator
              isAuthenticated={isAuthenticated}
              onLoginSuccess={() => {
                checkAuth();
                handleLoginSuccess();
              }}
              weather={weather}
              city={city}
              onSubmitSearch={async (cityName) => {
                try {
                  const coords = await MeteoAPI.fetchCoordsByCity(cityName);
                  setCoordinates(coords);
                } catch (error) {
                  Alert.alert("Błąd", "Nie udało się znaleźć podanego miasta");
                }
              }}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </ImageBackground>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
