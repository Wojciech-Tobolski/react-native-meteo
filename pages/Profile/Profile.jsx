import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Txt } from "../../components/Txt/Txt";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react-native";

const Profile = () => {
  const navigation = useNavigation();
  const auth = useAuth(); // Pobieramy cały obiekt auth

  useEffect(() => {
    console.log("Profile: Current auth state:", auth.isAuthenticated);
  }, [auth.isAuthenticated]);

  const handleLogout = async () => {
    console.log("Profile: Starting logout");
    try {
      await auth.logout();
      console.log(
        "Profile: Logout completed, auth state:",
        auth.isAuthenticated
      );

      // Znajdź root navigator
      let rootNav = navigation;
      while (rootNav.getParent()) {
        rootNav = rootNav.getParent();
      }
      console.log("Profile: Found root navigator");

      // Reset nawigacji
      rootNav.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Profile: Logout error:", error);
      Alert.alert("Błąd", "Nie udało się wylogować. Spróbuj ponownie.");
    }
  };

  const confirmLogout = () => {
    Alert.alert("Potwierdzenie", "Czy na pewno chcesz się wylogować?", [
      { text: "Anuluj", style: "cancel" },
      {
        text: "Wyloguj",
        onPress: handleLogout,
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <LogOut color="#fff" size={18} />
        <Txt style={styles.logoutText}>Wyloguj</Txt>
      </TouchableOpacity>

      <Txt style={styles.title}>Ustawienia profilu</Txt>
      <TouchableOpacity
        onPress={() => navigation.navigate("NotificationSettings")}
        style={styles.settingButton}
      >
        <Txt style={styles.buttonText}>Ustawienia powiadomień</Txt>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(245, 245, 245, 0.4)",
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  settingButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
