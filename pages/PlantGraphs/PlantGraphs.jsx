import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { API_URL } from "../../confiq";

const screenWidth = Dimensions.get("window").width;

const DEFAULT_LABELS = {
  day: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
  week: ["Pn", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"],
  month: Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")),
};

const CHART_TITLES = {
  temperature: "Temperatura (°C)",
  humidity: "Wilgotność Powietrza (%)",
  soil_moisture: "Wilgotność Gleby (%)",
  light_level: "Światło (lx)",
};

const CHART_UNITS = {
  temperature: "°C",
  humidity: "%",
  soil_moisture: "%",
  light_level: "lx",
};

const PlantConditionsChart = ({ route, navigation }) => {
  const { plantId } = route.params;
  const [timeRange, setTimeRange] = useState("day");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchSensorData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Błąd autoryzacji", "Zaloguj się ponownie.");
        return;
      }

      const response = await axios.get(
        `${API_URL}devices/data/${plantId}/statistics`,
        {
          params: { period: timeRange },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedData = response.data;
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      Alert.alert("Błąd", "Nie udało się pobrać danych dla wykresu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
  }, [timeRange]);

  const prepareChartData = (data, key, labelKey) => {
    const labels = [...DEFAULT_LABELS[timeRange]];

    const values = labels.map((label) => {
      const entry = data.find((item) => {
        const itemLabel =
          timeRange === "week" && item[labelKey] === "0"
            ? "Nd"
            : timeRange === "month"
            ? String(item[labelKey]).padStart(2, "0")
            : timeRange === "day"
            ? `${String(item[labelKey]).padStart(2, "0")}:00`
            : String(item[labelKey]);
        return itemLabel === label;
      });
      return entry ? parseFloat(entry[key].toFixed(1)) : 0;
    });

    return { labels, values };
  };

  const renderYAxisLabels = (maxValue, minValue, height, unit) => {
    const stepCount = 5;
    const step = (maxValue - minValue) / (stepCount - 1);
    const positions = Array.from({ length: stepCount }, (_, i) => ({
      value: (minValue + step * i).toFixed(1),
      position: height - (height / (stepCount - 1)) * i * 0.75 - 38,
    }));

    return positions.map((pos, index) => (
      <Text key={index} style={[styles.yAxisLabel, { top: pos.position - 10 }]}>
        {`${pos.value}${unit}`}
      </Text>
    ));
  };

  const renderChart = (dataKey, color, labelKey) => {
    const chartData = data
      ? prepareChartData(data, dataKey, labelKey)
      : {
          labels: DEFAULT_LABELS[timeRange],
          values: Array(DEFAULT_LABELS[timeRange].length).fill(0),
        };

    const maxValue = Math.max(...chartData.values) || 100;
    const minValue = Math.min(...chartData.values) || 0;
    const chartHeight = 220;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{CHART_TITLES[dataKey]}</Text>
        <View style={styles.chartWithYAxis}>
          <View style={styles.yAxisContainer}>
            {renderYAxisLabels(
              maxValue,
              minValue,
              chartHeight,
              CHART_UNITS[dataKey]
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chartScrollView}
          >
            <BarChart
              data={{
                labels: chartData.labels || [],
                datasets: [{ data: chartData.values || [] }],
              }}
              width={Math.max(chartData.labels.length * 50, screenWidth - 70)}
              height={chartHeight}
              withHorizontalLabels={false}
              yAxisLabel=""
              fromZero={false}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: () => color,
                barPercentage: 0.7,
                decimalPlaces: 1,
                paddingLeft: 0,
                paddingRight: 0,
                propsForLabels: {
                  dx: "0",
                },
                barRadius: 0,
                formatYLabel: (value) => `${value}${CHART_UNITS[dataKey]}`,
              }}
              style={[
                styles.chartStyle,
                {
                  marginLeft: -60,
                  paddingLeft: 0,
                },
              ]}
              segments={5}
              withInnerLines={true}
            />
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.buttonText}>← Wróć</Text>
        </TouchableOpacity>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Text style={styles.dropdownText}>
              {timeRange === "day"
                ? "Dzień"
                : timeRange === "week"
                ? "Tydzień"
                : "Miesiąc"}
            </Text>
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {["day", "week", "month"].map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => {
                    setTimeRange(range);
                    setIsDropdownOpen(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>
                    {range === "day"
                      ? "Dzień"
                      : range === "week"
                      ? "Tydzień"
                      : "Miesiąc"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : data && data.length > 0 ? (
        <ScrollView>
          {renderChart(
            "temperature",
            "#ff6666",
            timeRange === "day"
              ? "hour"
              : timeRange === "week"
              ? "weekday"
              : "day_of_month"
          )}
          {renderChart(
            "humidity",
            "#66b2ff",
            timeRange === "day"
              ? "hour"
              : timeRange === "week"
              ? "weekday"
              : "day_of_month"
          )}
          {renderChart(
            "soil_moisture",
            "#228B22",
            timeRange === "day"
              ? "hour"
              : timeRange === "week"
              ? "weekday"
              : "day_of_month"
          )}
          {renderChart(
            "light_level",
            "#FF8C00",
            timeRange === "day"
              ? "hour"
              : timeRange === "week"
              ? "weekday"
              : "day_of_month"
          )}
        </ScrollView>
      ) : (
        <Text style={styles.noDataText}>
          Brak wystarczających danych do wygenerowania wykresów.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingRight: 10,
    paddingLeft: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownText: {
    fontSize: 16,
    color: "#007BFF",
  },
  dropdownList: {
    position: "absolute",
    top: 25,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 100,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  chartContainer: {
    marginBottom: 20,
    position: "relative",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
    width: "100%",
  },
  chartWithYAxis: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  yAxisContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 50,
    height: 220,
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "white",
    zIndex: 2,
  },
  yAxisLabel: {
    position: "absolute",
    right: 10,
    fontSize: 12,
    color: "#666",
    width: 45,
    textAlign: "right",
  },
  chartScrollView: {
    marginLeft: 40,
  },
  chartStyle: {
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "white",
  },
  loader: {
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default PlantConditionsChart;
