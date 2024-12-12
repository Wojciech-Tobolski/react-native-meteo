// hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { API_URL } from "../confiq";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [notificationToken, setNotificationToken] = useState(null);

  // Inicjalizacja przy starcie
  useEffect(() => {
    initializeAuth();
  }, []);

  // Inicjalizacja autoryzacji
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log("Found token:", token);
      if (token) {
        // Ustawienie domyślnego headera dla wszystkich requestów
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const isValid = await validateToken(token);
        console.log("Token valid:", isValid); // Debug
        if (isValid) {
          setIsAuthenticated(true);
          await loadUserData();
          await setupNotifications();
        } else {
          await handleLogout();
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      console.error("Błąd inicjalizacji auth:", error);
      await handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  // Ładowanie danych użytkownika
  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        setUser({ id: userId });
      }
    } catch (error) {
      console.error("Błąd ładowania danych użytkownika:", error);
    }
  };

  // Walidacja tokenu
  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${API_URL}auth/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.is_valid;
    } catch (error) {
      console.error("Błąd walidacji tokenu:", error);
      return false;
    }
  };

  // Konfiguracja powiadomień
  const setupNotifications = async () => {
    if (!Device.isDevice) {
      console.log("Powiadomienia wymagają fizycznego urządzenia");
      return null;
    }

    try {
      if (Platform.OS === "android") {
        await configureAndroidChannel();
      }

      const permission = await requestNotificationPermission();
      if (!permission) return null;

      const token = await registerForPushNotifications();
      if (token) {
        setNotificationToken(token);
        await saveNotificationToken(token);
      }

      return token;
    } catch (error) {
      console.error("Błąd konfiguracji powiadomień:", error);
      return null;
    }
  };

  // Konfiguracja kanału dla Androida
  const configureAndroidChannel = async () => {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  };

  // Prośba o zgodę na powiadomienia
  const requestNotificationPermission = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Powiadomienia",
          "Nie udało się uzyskać zgody na powiadomienia"
        );
        return false;
      }
    }
    return true;
  };

  // Rejestracja tokenu powiadomień
  const registerForPushNotifications = async () => {
    try {
      return (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })
      ).data;
    } catch (error) {
      console.error("Błąd podczas pobierania tokenu powiadomień:", error);
      return null;
    }
  };

  // Zapisywanie tokenu powiadomień
  const saveNotificationToken = async (token) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      await axios.post(
        `${API_URL}notifications/save-token`,
        { token, userId },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Błąd zapisywania tokenu powiadomień:", error);
    }
  };

  // Logowanie
  const login = async (username, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}auth/login`, {
        username,
        password,
      });

      const { access_token, user_id } = response.data;

      await AsyncStorage.setItem("token", access_token);
      await AsyncStorage.setItem("userId", user_id.toString());

      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setUser({ id: user_id });
      setIsAuthenticated(true);

      await setupNotifications();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || "Błąd logowania";
      Alert.alert("Błąd", message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const registerData = {
        username: userData.username,
        password: userData.password,
        notification_time: userData.notification_time || "20:00:00",
        notifications_enabled: userData.notifications_enabled || true,
      };

      const response = await axios.post(
        `${API_URL}auth/register`,
        registerData
      );

      if (response.data.message) {
        return response.data;
      }
    } catch (error) {
      console.error("Błąd rejestracji:", error);
      const errorMessage =
        error.response?.data?.detail || "Błąd podczas rejestracji";
      Alert.alert("Błąd", errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Wylogowanie
  // hooks/useAuth.js

  const handleLogout = async () => {
    console.log("Auth: Starting logout");
    try {
      await AsyncStorage.multiRemove(["token", "userId"]);
      console.log("Auth: Token removed");

      delete axios.defaults.headers.common["Authorization"];
      console.log("Auth: Axios headers cleared");

      setUser(null);
      setNotificationToken(null);
      setIsAuthenticated(false);

      console.log("Auth: State updated, isAuthenticated:", false);
      return true;
    } catch (error) {
      console.error("Auth: Logout error:", error);
      return false;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    notificationToken,
    login,
    logout: handleLogout,
    checkAuth: initializeAuth,
    register,
  };
};
