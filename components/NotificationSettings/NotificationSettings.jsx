import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../confiq";
import { ChevronDown } from "lucide-react-native";

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}notifications/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.notification_time) {
        const [hours, minutes] = response.data.notification_time.split(":");
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        setNotificationTime(date);
        setTempTime(date);
      }

      setNotificationsEnabled(response.data.notifications_enabled);
    } catch (error) {
      console.error("Błąd podczas ładowania ustawień powiadomień:", error);
    }
  };

  const saveSettings = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Formatowanie czasu w formacie HH:MM
      const formattedTime = `${String(notificationTime.getHours()).padStart(
        2,
        "0"
      )}:${String(notificationTime.getMinutes()).padStart(2, "0")}`;

      console.log("Wysyłam ustawienia:", {
        notification_time: formattedTime,
        notifications_enabled: notificationsEnabled,
      });

      await axios.post(
        `${API_URL}notifications/settings`,
        {
          notification_time: formattedTime,
          notifications_enabled: notificationsEnabled,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHasUnsavedChanges(false);

      // Dodano potwierdzenie zapisania
      loadSettings(); // Odświeżamy ustawienia po zapisie
    } catch (error) {
      console.error(
        "Błąd podczas zapisywania ustawień powiadomień:",
        error.response?.data || error
      );
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setTempTime(selectedTime);
      setNotificationTime(selectedTime);
      setHasUnsavedChanges(true);
      if (Platform.OS === "android") {
        setNotificationTime(selectedTime);
      }
    }
  };

  const checkNotificationToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}notifications/check-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert(
        "Status powiadomień",
        `Token: ${response.data.token}\nAktywne: ${response.data.notifications_enabled}\nGodzina: ${response.data.notification_time}`
      );
    } catch (error) {
      console.error("Błąd sprawdzania tokenu:", error);
      Alert.alert("Błąd", "Nie udało się sprawdzić tokenu powiadomień");
    }
  };

  const sendTestNotification = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API_URL}notifications/test-notification`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Sukces", "Wysłano testowe powiadomienie");
    } catch (error) {
      console.error("Błąd wysyłania testowego powiadomienia:", error);
      Alert.alert("Błąd", "Nie udało się wysłać testowego powiadomienia");
    }
  };

  const toggleSwitch = (value) => {
    setNotificationsEnabled(value);
    setHasUnsavedChanges(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ustawienia powiadomień</Text>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Włącz powiadomienia</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleSwitch}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#155af7" : "#f4f3f4"}
        />
      </View>

      <TouchableOpacity
        style={styles.settingRow}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.settingLabel}>Godzina powiadomień</Text>
        <View style={styles.timePickerButton}>
          <Text style={styles.timeText}>
            {notificationTime.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <ChevronDown size={20} color="#666" />
        </View>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {hasUnsavedChanges && (
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
        </TouchableOpacity>
      )}
      <View style={styles.testButtonsContainer}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={checkNotificationToken}
        >
          <Text style={styles.testButtonText}>Sprawdź token</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={sendTestNotification}
        >
          <Text style={styles.testButtonText}>Wyślij test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 16,
    color: "#155af7",
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#155af7",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotificationSettings;
