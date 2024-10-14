import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { s } from "./Forecasts.style";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../../components/Txt/Txt";
import { MeteoBasic } from "../../components/MeteoBasic/MeteoBasic";
import { MeteoAdvanced } from "../../components/MeteoAdvanced/MeteoAdvanced";
import { useRoute } from "@react-navigation/native";
import { Header } from "../../components/Header/Header";
import { ForecastsListItem } from "../../components/ForecastListItem/ForecastListItem";
import { DAYS, getWeatherInterpretation } from "../../utils/meteo-utils";

export function Forecasts({}) {
  const { params } = useRoute();
  const forecastList = (
    <View style={{ marginTop: 50 }}>
      {params.time.map((time, index) => {
        const weatherCode = params.weathercode[index];
        const image = getWeatherInterpretation(weatherCode).image;
        const temperature = params.temperature_2m_max[index];
        const date = new Date(time);
        const dayOfTheWeek = DAYS[date.getDay()];
        const formatDate = date.toLocaleDateString("default", {
          day: "numeric",
          month: "numeric",
        });
        return (
          <ForecastsListItem
            key={time}
            image={image}
            day={dayOfTheWeek}
            date={formatDate}
            temperature={temperature.toFixed(0)}
          />
        );
      })}
    </View>
  );
  return (
    <>
      <Header city={params.city} />
      {forecastList}
    </>
  );
}
