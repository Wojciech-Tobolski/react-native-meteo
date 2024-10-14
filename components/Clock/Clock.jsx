import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { s } from "./Clock.style";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { nowToHHMM } from "../../utils/date-time";
import { Txt } from "../Txt/Txt";
import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState(nowToHHMM());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(nowToHHMM());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <>
      <Txt style={s.time}>{time}</Txt>
    </>
  );
}
