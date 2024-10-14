import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: { width: 50, height: 50 },
  day: { fontSize: 20, minWidth: 50, textAlign: "center" },
  date: { fontSize: 20 },
  temperature: {
    minWidth: 50,
    textAlign: "right",
  },
});
