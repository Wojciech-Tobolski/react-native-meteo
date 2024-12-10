import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Txt } from "../../components/Txt/Txt";
import { useNavigation } from "@react-navigation/native";
import { AuthAPI } from "../../api/auth";
import { LogOut } from "lucide-react-native";

export function Profile() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AuthAPI.logout();

      const parentNavigator = navigation.getParent();
      console.log("Parent Navigator State:", parentNavigator?.getState());

      if (!parentNavigator) {
        console.error("Nie można znaleźć nadrzędnego nawigatora.");
        return;
      }

      parentNavigator.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="#fff" size={18} />
        <Txt style={styles.logoutText}>Wyloguj</Txt>
      </TouchableOpacity>
      <Txt style={styles.title}>Your profile</Txt>
      <TouchableOpacity
        onPress={() => navigation.navigate("NotificationSettings")}
        style={styles.settingButton}
      >
        <Txt style={styles.buttonText}>Ustawienia powiadomień</Txt>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
