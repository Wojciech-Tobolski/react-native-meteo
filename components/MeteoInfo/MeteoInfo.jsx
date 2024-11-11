import { View, Image, TouchableOpacity } from "react-native";
import { s } from "./MeteoInfo.style";
import { Txt } from "../Txt/Txt";
import { useNavigation } from "@react-navigation/native";

export function MeteoInfo({ interpretation, temperature, city, dailyWeather }) {
  const nav = useNavigation();
  return (
    <>
      <TouchableOpacity
        onPress={() => nav.navigate("Forecasts", { city, ...dailyWeather })}
      >
        <View style={s.container}>
          <View>
            <Txt style={s.city}>{city}</Txt>
          </View>
          <View style={s.temperature_box}>
            <Image style={s.image} source={interpretation.image} />
            <Txt style={s.temperature}>{temperature}°C</Txt>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
