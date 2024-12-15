import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../../pages/Home/Home";
import Plants from "../../pages/Plants/Plants";
import Settings from "../../pages/Settings/Settings";
import Profile from "../../pages/Profile/Profile";
import AddNewPlant from "../../pages/AddNewPlant/AddNewPlant";
import { Forecasts } from "../../pages/Forecasts/Forecasts";
import { View, StyleSheet } from "react-native";
import {
  HomeIcon,
  Leaf,
  PlusCircle,
  Settings2,
  UserCircle,
} from "lucide-react-native";
window.homeImportWorking = !!Home;
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = ({ weather, city, onSubmitSearch }) => {
  if (!Home) {
    throw new Error("Home import failed");
  }
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <HomeStack.Screen name="HomeTab">
        {() => (
          <Home weather={weather} city={city} onSubmitSearch={onSubmitSearch} />
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name="Forecasts" component={Forecasts} />
    </HomeStack.Navigator>
  );
};

const Tabs = ({ weather, city, onSubmitSearch }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
          tabBarLabel: "Dom",
        }}
      >
        {() => (
          <HomeStackNavigator
            weather={weather}
            city={city}
            onSubmitSearch={onSubmitSearch}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Plants"
        component={Plants}
        options={{
          tabBarIcon: ({ color, size }) => <Leaf size={size} color={color} />,
          tabBarLabel: "Rośliny",
        }}
      />

      <Tab.Screen
        name="AddNewPlant"
        component={AddNewPlant}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.addButton}>
              <PlusCircle size={size} color="white" />
            </View>
          ),
          tabBarLabel: "Dodaj",
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings2 size={size} color={color} />
          ),
          tabBarLabel: "Iedntyfikuj",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserCircle size={size} color={color} />
          ),
          tabBarLabel: "Profil",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default Tabs;
