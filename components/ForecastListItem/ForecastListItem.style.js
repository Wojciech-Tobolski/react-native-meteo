import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    margin: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,

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
