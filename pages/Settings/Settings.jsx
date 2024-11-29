import { View } from "react-native";
import { Txt } from "../../components/Txt/Txt";
import PlantRecognition from "../../components/PlantRecognition/PlantRecognition";

export function Settings() {
  return (
    <View>
      <Txt>Plant Recognition</Txt>
      <PlantRecognition />
    </View>
  );
}
