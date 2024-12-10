// hooks/useNotifications.js
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../confiq";

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000); // Odświeżaj co minutę
    return () => clearInterval(interval);
  }, []);

  return { unreadCount, refreshUnreadCount: fetchUnreadCount };
};
