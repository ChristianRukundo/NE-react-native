"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal as RNModal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

export interface PickerOption {
  label: string;
  value: string | number;
}

export interface PickerProps {
  label?: string;
  value?: string | number;
  onValueChange: (value: string | number) => void;
  options: PickerOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const THEME_COLORS = {
  labelText: "#6B7280",
  valueText: "#1F2937",
  placeholderText: "#9CA3AF",
  borderColor: "#E5E7EB",
  errorBorderColor: "#EF4444",
  iconColor: "#9CA3AF",
  modalOverlay: "rgba(0,0,0,0.5)",
  modalBackground: "#FFFFFF",
  modalHeaderBorder: "#F3F4F6",
  listItemBorder: "#F9FAFB",
};

export function Picker({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  error,
  disabled = false,
}: PickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <View className={twMerge("mb-4")}>
      {label && (
        <Text
          style={{ color: THEME_COLORS.labelText }}
          className="font-dm-sans text-sm mb-1.5"
        >
          {label}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={[
          styles.pickerButton,
          {
            borderColor: error
              ? THEME_COLORS.errorBorderColor
              : THEME_COLORS.borderColor,
          },
          disabled && styles.disabledPickerButton,
        ]}
      >
        <Text
          style={[
            styles.pickerButtonText,
            {
              color: selectedOption
                ? THEME_COLORS.valueText
                : THEME_COLORS.placeholderText,
            },
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={THEME_COLORS.iconColor}
        />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText} className="font-dm-sans text-xs mt-1">
          {error}
        </Text>
      )}

      <RNModal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={styles.modalContentContainer}
            onStartShouldSetResponder={() => true}
          >

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "Select Option"}</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={THEME_COLORS.labelText}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                  style={styles.listItem}
                >
                  <Text style={styles.listItemText}>{item.label}</Text>
                  {item.value === value && (
                    <Ionicons
                      name="checkmark-sharp"
                      size={20}
                      color={THEME_COLORS.valueText}
                    />
                  )}
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
          </View>
        </TouchableOpacity>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME_COLORS.modalBackground,
    minHeight: 48,
  },
  disabledPickerButton: {
    backgroundColor: "#F3F4F6",
    opacity: 0.7,
  },
  pickerButtonText: {
    fontFamily: "DMSans-Regular",
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  errorText: {
    color: THEME_COLORS.errorBorderColor,
    fontFamily: "DMSans-Regular",
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: THEME_COLORS.modalOverlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContentContainer: {
    backgroundColor: THEME_COLORS.modalBackground,
    borderRadius: 20,
    width: "100%",
    maxHeight: "70%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: THEME_COLORS.modalHeaderBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "DMSans-Bold",
    color: THEME_COLORS.valueText,
  },
  modalCloseButton: {
    padding: 4,
  },
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: THEME_COLORS.listItemBorder,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemText: {
    fontFamily: "DMSans-Regular",
    fontSize: 15,
    color: THEME_COLORS.valueText,
  },
});
