import axios from "axios";
import { API_URL } from "../confiq";

const API_URLL = `${API_URL}my-plants`;

export class UserPlantAPI {
  static async getUserPlants(token) {
    const response = await axios.get(`${API_URLL}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async addUserPlant(userPlantData) {
    try {
      const response = await axios.post(`${API_URLL}`, userPlantData);
      if (response.status === 201) {
        alert("Roślina została dodana do Twojej kolekcji");
      } else {
        throw new Error("Błąd przy wysyłaniu danych użytkownika");
      }
    } catch (error) {
      console.error("Error details:", error.toJSON());
      alert("Wystąpił błąd podczas dodawania rośliny użytkownika");
    }
  }

  static async deleteUserPlant(token, plantId) {
    const response = await axios.delete(`${API_URLL}/${plantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
