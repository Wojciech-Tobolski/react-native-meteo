import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    flexDirection: "row",

    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
  },
  city: {
    fontSize: 18,
  },
  temperature_box: {
    flexDirection: "row",
    alignItems: "center",
  },
  temperature: {
    fontSize: 18,
    marginLeft: 5,
  },
  sun_times: {
    marginLeft: 5,
  },
  sun_time_text: {
    fontSize: 14,
  },
});
