import { View } from "react-native";
import { Txt } from "../../components/Txt/Txt";
import PlantForm from "../../components/PlantForm/PlantForm";

export function AddNewPlant(plant) {
  return (
    <View>
      <Txt>Add new plant</Txt>
      <PlantForm plant={plant} />
    </View>
  );
}
