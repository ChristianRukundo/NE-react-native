"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CategoryPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  categories: string[];
  error?: string;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  label,
  value,
  onValueChange,
  categories,
  error,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCategorySelect = (category: string) => {
    onValueChange(category);
    setIsModalVisible(false);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      "Food & Dining": "restaurant-outline",
      Transportation: "car-outline",
      Shopping: "bag-outline",
      Entertainment: "game-controller-outline",
      "Bills & Utilities": "receipt-outline",
      Health: "medical-outline",
      Travel: "airplane-outline",
      Education: "school-outline",
      Clothes: "shirt-outline",
      Groceries: "basket-outline",
      Other: "ellipsis-horizontal-outline",
    };
    return iconMap[category] || "ellipsis-horizontal-outline";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.picker,
          error ? styles.errorBorder : styles.defaultBorder,
        ]}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.leftIconContainer}>
          <Ionicons
            name="grid-outline"
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
          {value || "Select a category"}
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

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    value === item && styles.selectedCategory,
                  ]}
                  onPress={() => handleCategorySelect(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryContent}>
                    <View style={styles.categoryIconContainer}>
                      <Ionicons
                        name={getCategoryIcon(item) as any}
                        size={24}
                        color={value === item ? "#14b8a6" : "#6b7280"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryText,
                        value === item && styles.selectedCategoryText,
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                  {value === item && (
                    <Ionicons name="checkmark" size={20} color="#14b8a6" />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  closeButton: {
    padding: 4,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  selectedCategory: {
    backgroundColor: "#f0fdfa",
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIconContainer: {
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedCategoryText: {
    color: "#14b8a6",
    fontWeight: "500",
  },
});

export default CategoryPicker;
