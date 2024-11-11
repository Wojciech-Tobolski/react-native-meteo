import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../../pages/Home/Home";
import { Plants } from "../../pages/Plants/Plants";
import { Settings } from "../../pages/Settings/Settings";
import { Profile } from "../../pages/Profile/Profile";
import { AddNewPlant } from "../../pages/AddNewPlant/AddNewPlant";
import { Forecasts } from "../../pages/Forecasts/Forecasts";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = ({ weather, city, onSubmitSearch }) => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false, animation: "fade" }}
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
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        children={() => (
          <HomeStackNavigator
            weather={weather}
            city={city}
            onSubmitSearch={onSubmitSearch}
          />
        )}
      />
      <Tab.Screen name="Plants" component={Plants} />
      <Tab.Screen name="AddNewPlant" component={AddNewPlant} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Tabs;
