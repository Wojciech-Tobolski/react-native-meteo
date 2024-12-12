import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../../confiq";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.72;
const SPACING = 10;
const FULL_ITEM_WIDTH = ITEM_WIDTH + SPACING * 2;

const PlantGrid = () => {
  const [plants, setPlants] = useState([]);
  const navigation = useNavigation();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const fetchPlants = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}plants/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlants(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu roślin:", error);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const renderPlantItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * FULL_ITEM_WIDTH,
      index * FULL_ITEM_WIDTH,
      (index + 1) * FULL_ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.container}>
        <Animated.FlatList
          data={plants}
          renderItem={renderPlantItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={FULL_ITEM_WIDTH}
          decelerationRate="fast"
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={plants}
        renderItem={renderPlantItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={FULL_ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: width * 0.14,
  },
  plantItem: {
    width: ITEM_WIDTH,
    marginHorizontal: SPACING,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  plantImage: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.4,
    borderRadius: 20,
  },
  textContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  plantName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  plantType: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
});

export default PlantGrid;
