// AuthAPI.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.32:8000/auth";

export class AuthAPI {
  // Rejestracja użytkownika
  static async registerUser(userData) {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status !== 201)
      throw new Error("Rejestracja nie powiodła się.");
    return response.data;
  }

  // Logowanie użytkownika
  static async loginUser(credentials) {
    const params = new URLSearchParams();
    params.append("username", credentials.username);
    params.append("password", credentials.password);

    const response = await axios.post(`${API_URL}/token`, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.data.access_token) {
      throw new Error("Logowanie nie powiodło się.");
    }
    console.log("Odpowiedź logowania:", response.data);

    const { access_token, user_id } = response.data;

    await AsyncStorage.setItem("token", access_token); // Zapis tokenu w AsyncStorage
    await AsyncStorage.setItem("userId", user_id.toString());
    const storedToken = await AsyncStorage.getItem("token");
    console.log("Zapisany token:", storedToken);
    return access_token;
  }

  // Weryfikacja tokenu przy starcie aplikacji
  static async validateToken() {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token nie został znaleziony w AsyncStorage.");
        return false;
      }

      const response = await axios.get(`${API_URL}/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Status odpowiedzi:", response.status);
      return response.status === 200; // Zwracamy true, jeśli token jest poprawny
    } catch (error) {
      console.error("Błąd walidacji tokenu:", error.response || error.message);
      return false;
    }
  }
  // Pobieranie danych użytkownika
  static async fetchUserData() {
    const token = await AsyncStorage.getItem("token");

    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200)
      throw new Error("Nie udało się pobrać danych użytkownika.");

    return response.data;
  }

  // Wylogowanie użytkownika
  static async logout() {
    await AsyncStorage.removeItem("token"); // Usunięcie tokenu z AsyncStorage
    await AsyncStorage.removeItem("userId"); // Usunięcie tokenu z AsyncStorage
  }
  // Pobieranie userId
  static async getUserId() {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      throw new Error("Nie udało się pobrać userId z AsyncStorage.");
    }
    return userId;
  }
}
