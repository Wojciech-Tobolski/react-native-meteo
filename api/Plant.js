import axios from "axios";
const API_URL = "http://192.168.1.32:8000/admin";

export class PlantAPI {
  static async addNewPlant(formData) {
    console.log(formData);
    try {
      const response = await axios.post(`${API_URL}/add_new_plant`, formData, {
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
