import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../../confiq";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.75;
const SPACING = 12;
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
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("PlantDetails", { plant: item })}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[
            styles.plantItem,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Image
            source={{ uri: item.image_url }}
            style={styles.plantImage}
            resizeMode="cover"
          />
          <View style={styles.gradientOverlay} />
          <View style={styles.textContainer}>
            <Text style={styles.plantName}>{item.name}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Dostępne Rośliny</Text>
        <Animated.FlatList
          data={plants}
          renderItem={renderPlantItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={FULL_ITEM_WIDTH}
          decelerationRate={0.8}
          bounces={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    paddingTop: height * 0.05,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
    marginLeft: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  flatListContent: {
    paddingHorizontal: width * 0.1,
    paddingVertical: 10,
  },
  plantItem: {
    width: ITEM_WIDTH,
    height: height * 0.65,
    marginHorizontal: SPACING,
    borderRadius: 25,
    backgroundColor: "transparent",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  plantImage: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "13%", // Zwiększyłem wysokość cieniowania
    backgroundGradient: {
      colors: ["transparent", "rgba(0,0,0,0.7)"],
      locations: [0, 1],
    },
    backgroundColor: "rgba(0,0,0,0.45)", // Przyciemniłem gradient
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  textContainer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    padding: 25,
    paddingBottom: 20,
  },
  plantName: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});

export default PlantGrid;
