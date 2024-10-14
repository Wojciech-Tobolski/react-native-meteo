import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { s } from "./Txt.style";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export function Txt({ children, style, ...restProps }) {
  return (
    <Text style={[s.txt, style]} {...restProps}>
      {children}
    </Text>
  );
}
