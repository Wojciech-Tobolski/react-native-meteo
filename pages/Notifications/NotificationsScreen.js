// screens/Notifications/NotificationsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Text,
} from "react-native";
import { Txt } from "../../components/Txt/Txt";
import axios from "axios";
import { API_URL } from "../../confiq";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Check,
  AlertTriangle,
  Droplets,
  Thermometer,
  Sun,
} from "lucide-react-native";

const NotificationIcon = ({ type }) => {
  const iconProps = { size: 20, color: "#007AFF" };

  switch (type) {
    case "WATER_NEEDED":
      return <Droplets {...iconProps} color="#4299e1" />;
    case "TEMPERATURE_TOO_LOW":
    case "TEMPERATURE_TOO_HIGH":
      return <Thermometer {...iconProps} color="#f56565" />;
    case "LIGHT_NEEDED":
      return <Sun {...iconProps} color="#ecc94b" />;
    default:
      return <AlertTriangle {...iconProps} color="#718096" />;
  }
};

const NotificationItem = ({ notification, onPress }) => {
  const formattedDate = new Date(notification.created_at).toLocaleString(
    "pl-PL",
    {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.read && styles.unreadNotification,
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={styles.iconContainer}>
        <NotificationIcon type={notification.notification_type} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.timestamp}>{formattedDate}</Text>
      </View>
      {notification.read && (
        <View style={styles.readIndicator}>
          <Check size={16} color="#68D391" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${API_URL}notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (notification) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API_URL}notifications/${notification.id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${API_URL}notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Powiadomienia</Text>
        {notifications.some((n) => !n.read) && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>
              Oznacz wszystkie jako przeczytane
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem notification={item} onPress={markAsRead} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadNotifications();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Brak powiadomień</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    color: "#007AFF",
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    marginBottom: 1,
    alignItems: "center",
  },
  unreadNotification: {
    backgroundColor: "#f0f9ff",
  },
  iconContainer: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#718096",
  },
  readIndicator: {
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
  },
});
