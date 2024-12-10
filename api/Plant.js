import axios from "axios";
import { API_URL } from "../confiq";
const API_URLL = `${API_URL}admin`;

export class PlantAPI {
  static async addNewPlant(formData) {
    console.log(formData);
    try {
      const response = await axios.post(`${API_URLL}/add_new_plant`, formData, {
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
  static async addUserPlant(userPlantData) {
    try {
      const response = await axios.post(
        `${API_URLL}/user-plants`,
        userPlantData
      );
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
}
