import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    backgroundColor: "#0000005c",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 10,
  },
  scroll: { flexGrow: 1, padding: 16, paddingBottom: 100 },
  name: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  image: {
    alignSelf: "center",
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
});
