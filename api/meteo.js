import axios from "axios";
export class MeteoAPI {
  static async fetchWeatherByCoords(coords) {
    return (
      await axios.get(`https://api.open-meteo.com/v1/forecast`, {
        params: {
          latitude: coords.lat,
          longitude: coords.lng,
          daily:
            "weathercode,temperature_2m_max,sunrise,sunset,windspeed_10m_max",
          timezone: "auto",
          current_weather: true,
        },
      })
    ).data;
  }

  static async fetchCityByCoords(coords) {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "jsonv2",
            lat: coords.lat,
            lon: coords.lng,
          },
          headers: {
            "User-Agent": "MeteoApp/1.0 (wojtek.tobolski.to@gmail.com)",
          },
        }
      );

      const { city, village, town } = response.data.address;
      return city || village || town;
    } catch (error) {
      console.error("Error in fetchCityByCoords:", error);
      throw error; // Rzucamy błąd, aby został obsłużony wyżej
    }
  }

  static async fetchCoordsByCity(city) {
    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search`,
        {
          params: {
            name: city,
            count: 1,
            language: "en",
            format: "json",
          },
        }
      );

      const { latitude: lat, longitude: lng } = response.data.results[0];
      return { lat, lng };
    } catch (err) {
      console.error("Error in fetchCoordsByCity:", err);
      throw "Invalid city name";
    }
  }
}
