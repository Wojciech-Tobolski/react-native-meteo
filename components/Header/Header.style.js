import { StyleSheet } from "react-native";
const BACK_BTN_WIDTH = 30;
export const s = StyleSheet.create({
  container: { flexDirection: "row" },
  back_btn: { width: BACK_BTN_WIDTH },
  header_txts: { flex: 1, alignItems: "center", marginRight: BACK_BTN_WIDTH },
  subtitle: { fontSize: 20 },
});
