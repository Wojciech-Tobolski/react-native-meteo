import { StatusBar } from "expo-status-bar";
import { Text, View, Image } from "react-native";
import {
  s,
  StyledContainer,
  StyledLabel,
  StyledValue,
} from "./MeteoAdvanced.style";
import { Txt } from "../Txt/Txt";
export function MeteoAdvanced({ sunrise, sunset, windspeed }) {
  return (
    <>
      <View style={s.container}>
        <StyledContainer>
          <StyledLabel>{sunrise}</StyledLabel>
          <StyledValue>Sunrise</StyledValue>
        </StyledContainer>
        <StyledContainer>
          <StyledLabel>{sunset}</StyledLabel>
          <StyledValue>Sunset</StyledValue>
        </StyledContainer>
        <StyledContainer>
          <StyledLabel>{windspeed} km/h</StyledLabel>
          <StyledValue>Wind speed</StyledValue>
        </StyledContainer>
      </View>
    </>
  );
}
