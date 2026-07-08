import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Switch } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { mobileApi } from "../services/api";

export default function HomeScreen() {
  const [alarms, setAlarms] = useState([]);

  const loadAlarms = async () => {
    try {
      const res = await mobileApi.get("/alarms");
      setAlarms(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAlarms();
    }, [])
  );

  const toggleSwitch = async (id) => {
    try {
      await mobileApi.put(`/alarms/${id}/toggle`);
      loadAlarms();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Dashboard</Text>

      {alarms.length === 0 ? (
        <Text style={styles.emptyText}>You have no alarms set. Go to the Alarms tab to add one!</Text>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.alarm_time}</Text>
                <Text style={styles.subText}>{item.challenge_category.toUpperCase()} • {item.days_of_week}</Text>
              </View>
              <Switch
                value={item.is_active}
                onValueChange={() => toggleSwitch(item.id)}
                trackColor={{ false: "#ccc", true: "#007BFF" }}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    padding: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  time: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
  },
  subText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 40,
  }
});