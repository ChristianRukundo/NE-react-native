"use client";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { financeApi } from "../../lib/api";
import { expenseSchema, type ExpenseFormData } from "../../lib/validations";
import type { CreateExpenseData } from "../../lib/types";
import PlainInput from "../../components/ui/PlainInput";
import Button from "../../components/ui/Button";
import { Header } from "../../components/ui/Header";
import CategoryPicker from "../../components/ui/CategoryPicker";
import DatePicker from "../../components/ui/DatePicker";

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Travel",
  "Education",
  "Clothes",
  "Groceries",
  "Other",
];

export default function CreateExpenseScreen() {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      name: "",
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      title: "",
      note: "",
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: (data: CreateExpenseData) => financeApi.createExpense(data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Expense Added",
        text2: "Your expense has been successfully logged.",
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      reset();
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Creation Failed",
        text2: error.message || "Could not add your expense. Please try again.",
      });
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    const apiData: CreateExpenseData = {
      name: data.name,
      amount: data.amount,
      description: data.description || "",
      category: data.category,
      date: data.date,
      title: data.title || "",
      note: data.note || "",
    };
    createExpenseMutation.mutate(apiData);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Add New Expense" showBack={router.canGoBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 24,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4 shadow-lg">
              <Ionicons name="add-circle" size={40} color="#F97316" />
            </View>
            <Text className="text-3xl font-dm-sans-bold text-gray-800 text-center mb-2">
              Track Your Spending
            </Text>
            <Text className="text-gray-500 font-dm-sans text-center">
              Every expense matters for your financial goals
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-6">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <PlainInput
                  label="Expense Name"
                  placeholder="e.g., Lunch with team, Groceries"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  leftIcon="receipt-outline"
                  iconColor={
                    errors.name ? "#ef4444" : value ? "#F97316" : "#9ca3af"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <PlainInput
                  label="Title (Optional)"
                  placeholder="e.g., Drip, Monthly Groceries"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.title?.message}
                  leftIcon="bookmark-outline"
                  iconColor={
                    errors.title ? "#ef4444" : value ? "#F97316" : "#9ca3af"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <PlainInput
                  label="Amount"
                  placeholder="0.00"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.amount?.message}
                  keyboardType="numeric"
                  leftIcon="cash-outline"
                  iconColor={
                    errors.amount ? "#ef4444" : value ? "#F97316" : "#9ca3af"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <CategoryPicker
                  label="Category"
                  value={value}
                  onValueChange={onChange}
                  categories={EXPENSE_CATEGORIES}
                  error={errors.category?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Date"
                  value={value}
                  onValueChange={onChange}
                  error={errors.date?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <PlainInput
                  label="Description (Optional)"
                  placeholder="e.g., Client meeting at Cafe Kivu"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.description?.message}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{ minHeight: 80 }}
                  leftIcon="document-text-outline"
                  iconColor={
                    errors.description
                      ? "#ef4444"
                      : value
                      ? "#F97316"
                      : "#9ca3af"
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="note"
              render={({ field: { onChange, onBlur, value } }) => (
                <PlainInput
                  label="Note (Optional)"
                  placeholder="e.g., I will go in the morning"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.note?.message}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  style={{ minHeight: 60 }}
                  leftIcon="create-outline"
                  iconColor={
                    errors.note ? "#ef4444" : value ? "#F97316" : "#9ca3af"
                  }
                />
              )}
            />
          </View>

          {/* Submit Button */}
          <View className="mt-10">
            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={createExpenseMutation.isPending || isSubmitting}
              className="shadow-lg"
              fullWidth
              size="lg"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white font-dm-sans-bold text-lg ml-2">
                  Add Expense
                </Text>
              </View>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
