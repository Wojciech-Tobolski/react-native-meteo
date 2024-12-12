import axios from "axios";
import { API_URL } from "../confiq";

const API_URLL = `${API_URL}plants`;

export class PlantAPI {
  static async getPlantDetailsById(plantId) {
    try {
      const response = await axios.get(`${API_URLL}/${plantId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching plant details:", error);
      return null;
    }
  }

  static async addNewPlant(formData) {
    console.log(formData);
    try {
      const response = await axios.post(`${API_URLL}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        alert("Roślina została dodana");
      } else {
        throw new Error("Błąd przy wysyłaniu formularza");
      }
    } catch (error) {
      console.error("Error details:", error.toJSON());
      alert("Wystąpił błąd podczas dodawania rośliny");
    }
  }
}
