"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onValueChange,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      onValueChange(formattedDate);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentDate = value ? new Date(value) : new Date();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.picker,
          error ? styles.errorBorder : styles.defaultBorder,
        ]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <View style={styles.leftIconContainer}>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={error ? "#ef4444" : value ? "#14b8a6" : "#9ca3af"}
          />
        </View>
        <Text
          style={[
            styles.pickerText,
            value ? styles.selectedText : styles.placeholderText,
          ]}
        >
          {value ? formatDisplayDate(value) : "Select a date"}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={error ? "#ef4444" : "#9ca3af"}
        />
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={14} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
  },
  defaultBorder: {
    borderColor: "#d1d5db",
  },
  errorBorder: {
    borderColor: "#ef4444",
  },
  leftIconContainer: {
    marginRight: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
  },
  selectedText: {
    color: "#1f2937",
  },
  placeholderText: {
    color: "#9ca3af",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginLeft: 4,
  },
});

export default DatePicker;
