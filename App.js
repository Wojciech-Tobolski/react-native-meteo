import { Alert, ImageBackground } from "react-native";
import { s } from "./App.style";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Home } from "./pages/Home/Home";
import { Forecasts } from "./pages/Forecasts/Forecasts";
import backgroundImage from "./assets/background.png";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { useEffect, useState } from "react";
import { MeteoAPI } from "./api/meteo";
import { useFonts } from "expo-font";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Linking, Platform } from "react-native";
import Tabs from "./components/TabNawigator/TabNawigator";
import { AuthAPI } from "./api/auth";
import LoginPage from "./pages/Login/LoginPage";

const Stack = createNativeStackNavigator();
const navTheme = {
  colors: {
    background: "transparent",
  },
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [coordinates, setCoordinates] = useState();
  const [city, setCity] = useState();
  const [weather, setWeather] = useState();
  const [isFontLoaded] = useFonts({
    "Alata-Regular": require("./assets/fonts/Alata-Regular.ttf"),
  });
  useEffect(() => {
    async function checkToken() {
      const isValid = await AuthAPI.validateToken();
      setIsAuthenticated(isValid);
    }
    checkToken();
  }, []);

  useEffect(() => {
    getUserCoordinates();
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("1:   ", response.notification.request.content);
    });
    Notifications.addNotificationReceivedListener((response) => {
      console.log("2:   ", response.request.content.data);
    });
    subscribeToNotifications();
  }, []);

  useEffect(() => {
    console.log("Coordinates changed:", coordinates);
    if (coordinates) {
      fetchCityByCoords(coordinates);
      fetchWeatherByCoords(coordinates);
    }
  }, [coordinates]);

  async function subscribeToNotifications() {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Failed to get permissions");
          return;
        }
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;
      //send token to backend
      console.log("Token EXPO", token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  async function fetchWeatherByCoords(coords) {
    const weatherResponse = await MeteoAPI.fetchWeatherByCoords(coords);
    setWeather(weatherResponse);
  }
  async function fetchCityByCoords(coords) {
    console.log("Fetching city for coordinates:", coords);
    try {
      const cityResponse = await MeteoAPI.fetchCityByCoords(coords);
      console.log("City response:", cityResponse);
      setCity(cityResponse);
    } catch (error) {
      console.error("Error fetching city:", error); // To wyświetli błąd, jeśli wystąpi
      Alert.alert("Error", "Nie udało się pobrać miasta.");
    }
  }

  async function fetchCoordsByCity(city) {
    try {
      const coordsResponse = await MeteoAPI.fetchCoordsByCity(city);
      setCoordinates(coordsResponse);
    } catch (err) {
      Alert.alert("Auch !", err);
    }
  }

  async function getUserCoordinates(params) {
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
  }
  return (
    <NavigationContainer theme={navTheme}>
      <ImageBackground
        imageStyle={s.img}
        style={s.img_background}
        source={backgroundImage}
      >
        <SafeAreaProvider>
          <SafeAreaView style={s.container}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {isAuthenticated ? (
                <Stack.Screen name="Tabs">
                  {() => (
                    <Tabs
                      weather={weather}
                      city={city}
                      onSubmitSearch={(city) => fetchCityByCoords(city)}
                    />
                  )}
                </Stack.Screen>
              ) : (
                <Stack.Screen name="Login">
                  {() => (
                    <LoginPage
                      onLoginSuccess={() => setIsAuthenticated(true)}
                    />
                  )}
                </Stack.Screen>
              )}
            </Stack.Navigator>
          </SafeAreaView>
        </SafeAreaProvider>
      </ImageBackground>
    </NavigationContainer>
  );
}
