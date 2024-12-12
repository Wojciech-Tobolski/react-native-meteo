// screens/AddNewPlant/AddNewPlant.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Txt } from "../../components/Txt/Txt";
import PlantForm from "../../components/PlantForm/PlantForm";

const AddNewPlant = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Txt style={styles.title}>Dodaj nową roślinę</Txt>
      </View>
      <PlantForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
  },
});
export default AddNewPlant;
