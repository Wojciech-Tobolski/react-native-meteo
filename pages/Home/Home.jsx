import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { s } from "./Home.style";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../../components/Txt/Txt";
import { MeteoBasic } from "../../components/MeteoBasic/MeteoBasic";
import { getWeatherInterpretation } from "../../utils/meteo-utils";
import { MeteoAdvanced } from "../../components/MeteoAdvanced/MeteoAdvanced";
import { SearchBar } from "../../components/SearchBar/SearchBar";

export function Home({ weather, city, onSubmitSearch }) {
  const currentWeather = weather.current_weather;
  const currentInterpretation = getWeatherInterpretation(
    currentWeather.weathercode
  );
  return (
    <>
      <View style={s.meteo_basic}>
        <MeteoBasic
          dailyWeather={weather.daily}
          city={city}
          interpretation={currentInterpretation}
          temperature={Math.round(currentWeather.temperature)}
        />
      </View>
      <View style={s.search_bar_container}>
        <SearchBar onSubmit={onSubmitSearch} />
      </View>
      <View style={s.meteo_advanced}>
        <MeteoAdvanced
          sunrise={weather.daily.sunrise[0].split("T")[1]}
          sunset={weather.daily.sunset[0].split("T")[1]}
          windspeed={currentWeather.windspeed}
        />
      </View>
    </>
  );
}
