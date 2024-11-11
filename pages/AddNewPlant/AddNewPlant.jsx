import { View } from "react-native";
import { Txt } from "../../components/Txt/Txt";
import PlantForm from "../../components/PlantForm/PlantForm";

export function AddNewPlant() {
  return (
    <View>
      <Txt>Add new plant</Txt>
      <PlantForm />
    </View>
  );
}
