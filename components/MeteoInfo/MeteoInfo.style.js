import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {},
  image: {
    width: 30,
    height: 30,
  },
  city: { fontSize: 18 },
  interpretation: {},
  interpretation_txt: { fontSize: 15 },
  temperature_box: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  temperature: { fontSize: 18, marginLeft: 5 },
});
