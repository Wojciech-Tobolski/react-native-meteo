import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Auth Screens
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";

// Main App Screens
import PlantDetails from "../pages/PlantDetails/PlantDetails";
import AddUserPlant from "../pages/AddUserPlant/AddUserPlant";
import UserPlantDetails from "../components/UserPlantDetails/UserPlantDetails";
import AddMicrocontroller from "../pages/AddMicrocontroller/AddMicrocontroller";
import PlantConditions from "../pages/PlantConditions/PlantConditions";
import PlantConditionsChart from "../pages/PlantGraphs/PlantGraphs";
import NotificationSettings from "../components/NotificationSettings/NotificationSettings";
import { NotificationsScreen } from "../pages/Notifications/NotificationsScreen";
import Tabs from "../components/TabNawigator/TabNawigator";

const Stack = createNativeStackNavigator();

export const AppNavigator = ({
  isAuthenticated,
  onLoginSuccess,
  weather,
  city,
  onSubmitSearch,
}) => {
  console.log("AppNavigator: Rendering with auth state:", isAuthenticated);

  if (isAuthenticated === undefined || isAuthenticated === null) {
    console.log("AppNavigator: Auth state is undefined or null");
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? "MainTabs" : "Login"}
    >
      {/* Auth Screens */}
      <Stack.Screen
        name="Login"
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      >
        {(props) => <LoginPage {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>

      <Stack.Screen
        name="Register"
        component={RegisterPage}
        options={{
          headerShown: false,
          headerTitle: "Rejestracja",
          headerTitleAlign: "center",
        }}
      />

      {/* Main App Screens */}
      <Stack.Screen name="MainTabs" options={{ gestureEnabled: false }}>
        {(props) => (
          <Tabs
            {...props}
            weather={weather}
            city={city}
            onSubmitSearch={onSubmitSearch}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="PlantDetails"
        component={PlantDetails}
        options={{
          headerTitle: "Szczegóły rośliny",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddUserPlant"
        component={AddUserPlant}
        options={{
          headerTitle: "Dodaj roślinę",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UserPlantDetails"
        component={UserPlantDetails}
        options={{
          headerTitle: "Szczegóły mojej rośliny",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="AddMicrocontroller"
        component={AddMicrocontroller}
        options={{
          headerTitle: "Dodaj mikrokontroler",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PlantConditions"
        component={PlantConditions}
        options={{
          headerTitle: "Warunki rośliny",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PlantConditionsChart"
        component={PlantConditionsChart}
        options={{
          headerTitle: "Wykresy",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerTitle: "Ustawienia powiadomień",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
