import React from "react";
import { View, StyleSheet } from "react-native";
import PlantGrid from "../../components/PlantGrid/PlantGrid";

const Plants = () => {
  console.log("Rendering Plants component"); // Debug log
  return (
    <View style={styles.container}>
      <PlantGrid />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Plants;
