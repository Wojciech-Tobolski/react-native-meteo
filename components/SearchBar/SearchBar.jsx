import { TextInput } from "react-native";
import { s } from "./SearchBar.style";

export function SearchBar({ onSubmit }) {
  return (
    <TextInput
      style={s.input}
      onSubmitEditing={(e) => onSubmit(e.nativeEvent.text)}
      placeholder="Type a city... Ex: Paris"
    />
  );
}
