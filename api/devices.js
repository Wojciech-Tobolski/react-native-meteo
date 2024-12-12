import axios from "axios";
import { API_URL } from "../confiq";

const API_URLL = `${API_URL}devices`;

export class DevicesAPI {
  static async getUserMicrocontrollers(token) {
    const response = await axios.get(`${API_URLL}/user-devices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  static async AssignMicrocontroller(token, controllerId, plantId) {
    const response = await axios.post(
      `${API_URLL}/assign`,
      {
        controller_id: controllerId,
        user_plant_id: plantId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  static async unassignMicrocontroller(token, controllerId) {
    const response = await axios.post(
      `${API_URLL}/unassign-plant`,
      {
        controller_id: controllerId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}
