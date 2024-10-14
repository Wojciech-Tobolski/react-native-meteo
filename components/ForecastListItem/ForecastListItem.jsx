import { StatusBar } from "expo-status-bar";
import { Text, View, Image } from "react-native";
import { s } from "./ForecastListItem.style";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../../components/Txt/Txt";
import { MeteoBasic } from "../../components/MeteoBasic/MeteoBasic";
import { getWeatherInterpretation } from "../../utils/meteo-utils";
import { MeteoAdvanced } from "../../components/MeteoAdvanced/MeteoAdvanced";
import { useRoute } from "@react-navigation/native";
import { Header } from "../../components/Header/Header";

export function ForecastsListItem({ image, day, date, temperature }) {
  const { params } = useRoute();
  return (
    <View style={s.container}>
      <Image style={s.image} source={image} />
      <Txt style={s.day}>{day}</Txt>
      <Txt style={s.date}>{date}</Txt>
      <Txt style={s.temperature}>{temperature}°</Txt>
    </View>
  );
}
