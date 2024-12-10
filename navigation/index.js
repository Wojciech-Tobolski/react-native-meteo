import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "../components/TabNawigator/TabNawigator";
import LoginPage from "../pages/Login/LoginPage";
import PlantDetails from "../pages/PlantDetails/PlantDetails";
import AddUserPlant from "../pages/AddUserPlant/AddUserPlant";
import UserPlantDetails from "../components/UserPlantDetails/UserPlantDetails";
import AddMicrocontroller from "../pages/AddMicrocontroller/AddMicrocontroller";
import PlantConditions from "../pages/PlantConditions/PlantConditions";
import PlantConditionsChart from "../pages/PlantGraphs/PlantGraphs";
import NotificationSettings from "../components/NotificationSettings/NotificationSettings";
import { NotificationsScreen } from "../pages/Notifications/NotificationsScreen";

const Stack = createNativeStackNavigator();

export const AppNavigator = ({
  isAuthenticated,
  onLoginSuccess,
  weather,
  city,
  onSubmitSearch,
}) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {/* Główne zakładki */}
          <Stack.Screen name="Tabs">
            {() => (
              <Tabs
                weather={weather}
                city={city}
                onSubmitSearch={onSubmitSearch}
              />
            )}
          </Stack.Screen>

          {/* Szczegóły */}
          <Stack.Screen name="PlantDetails" component={PlantDetails} />
          <Stack.Screen name="AddUserPlant" component={AddUserPlant} />
          <Stack.Screen name="UserPlantDetails" component={UserPlantDetails} />
          <Stack.Screen
            name="AddMicrocontroller"
            component={AddMicrocontroller}
          />
          <Stack.Screen name="PlantConditions" component={PlantConditions} />
          <Stack.Screen
            name="PlantConditionsChart"
            component={PlantConditionsChart}
          />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettings}
            options={{
              headerShown: true,
              title: "Ustawienia powiadomień",
              headerStyle: {
                backgroundColor: "transparent",
              },
              headerTintColor: "#000",
            }}
          />
          <Stack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{
              headerShown: true,
              headerTitle: "Powiadomienia",
              headerTitleAlign: "center",
            }}
          />
        </>
      ) : (
        /* Ekran logowania */
        <Stack.Screen name="Login">
          {() => <LoginPage onLoginSuccess={onLoginSuccess} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};
