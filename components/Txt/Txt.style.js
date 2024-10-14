import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const s = StyleSheet.create({
  txt: {
    fontSize: hp("3%"),
    color: "white",
    fontFamily: "Alata-Regular",
  },
});
