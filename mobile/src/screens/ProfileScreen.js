import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TextInput, SafeAreaView, 
  TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform 
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    preferred_wake_time: "07:00",
    target_sleep_hours: "8",
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    difficulty_preference: "medium",
  });

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log(profile);
    // TODO: await mobileApi.put("/profile", profile);
    Alert.alert("Success", "Profile settings saved! (Mock)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile Settings</Text>
            <Text style={styles.subtitle}>Manage your wake-up preferences.</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Preferred Wake-up Time</Text>
            <TextInput
              style={styles.input}
              value={profile.preferred_wake_time}
              onChangeText={(val) => handleChange("preferred_wake_time", val)}
              placeholder="07:00"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Sleep Hours</Text>
            <TextInput
              style={styles.input}
              value={profile.target_sleep_hours}
              onChangeText={(val) => handleChange("target_sleep_hours", val)}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Time Zone</Text>
            <TextInput
              style={styles.input}
              value={profile.time_zone}
              onChangeText={(val) => handleChange("time_zone", val)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Default Difficulty</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={profile.difficulty_preference}
                onValueChange={(val) => handleChange("difficulty_preference", val)}
              >
                <Picker.Item label="Beginner" value="beginner" />
                <Picker.Item label="Easy" value="easy" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Hard" value="hard" />
                <Picker.Item label="Expert" value="expert" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});