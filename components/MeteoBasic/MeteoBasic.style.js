import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  image: {
    width: 90,
    height: 90,
  },
  clock: { alignItems: "flex-end" },
  city: {},
  interpretation: { alignSelf: "flex-end", transform: [{ rotate: "-90deg" }] },
  interpretation_txt: { fontSize: 20 },
  temperature_box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  temperature: { fontSize: 150 },
});
