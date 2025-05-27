import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { Expense } from "../lib/types";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface ExpenseListItemProps {
  expense: Expense;
  onDeletePress: (expenseId: string) => void;
}

const ExpenseListItemComponent: React.FC<ExpenseListItemProps> = ({
  expense,
  onDeletePress,
}) => {
  const viewDetails = () => {
    router.push(`/(tabs)/expense/${expense.id}`);
  };

  const formattedAmount = parseFloat(expense.amount).toLocaleString("en-US", {
    style: "currency",
    currency: "RWF",
  });

  const formattedDate = new Date(expense.createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <View style={styles.cardBase}>
      <TouchableOpacity onPress={viewDetails} className="flex-1">
        <View className="flex-row justify-between items-start mb-1">
          <Text
            className="text-lg font-dm-sans-bold text-gray-800 flex-shrink mr-2"
            numberOfLines={1}
          >
            {expense.name}
          </Text>
          <Text className="text-lg font-dm-sans-bold text-primary-600">
            {formattedAmount}
          </Text>
        </View>
        <Text
          className="text-sm font-dm-sans text-gray-500 mb-2"
          numberOfLines={2}
        >
          {expense.description || "No description"}
        </Text>
        <Text className="text-xs font-dm-sans text-gray-400">
          {formattedDate}
        </Text>
      </TouchableOpacity>
      <View className="flex-row justify-end items-center border-t border-gray-100 pt-2 mt-2">
        <TouchableOpacity
          onPress={() => onDeletePress(expense.id)}
          className="p-2 rounded-md active:bg-red-50"
        >
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={viewDetails}
          className="ml-2 p-2 rounded-md active:bg-gray-100"
        >
          <Ionicons name="eye-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
const ExpenseListItem = React.memo(ExpenseListItemComponent);
export default ExpenseListItem;
