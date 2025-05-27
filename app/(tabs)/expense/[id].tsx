"use client";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

import { financeApi } from "../../../lib/api";
import type { Expense } from "../../../lib/types";
import { Header } from "../../../components/ui/Header";
import Button from "../../../components/ui/Button";
import { DeleteModal } from "../../../components/ui/DeleteModal";

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const expenseId = id;
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: expense,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Expense, Error>({
    queryKey: ["expense", expenseId],
    queryFn: () => financeApi.getExpenseById(expenseId as string),
    enabled: !!expenseId,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: financeApi.deleteExpense,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Expense Deleted" });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: err.message || "Could not delete expense.",
      });
    },
  });

  const handleDeleteExpense = () => {
    if (expense) {
      deleteMutation.mutate(expense.id);
      setShowDeleteModal(false);
    }
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

  if (isLoading && !isRefetching) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Loading Expense..." showBack />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#F97316" />
          <Text className="mt-4 font-dm-sans-medium text-gray-700">
            Fetching expense details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !expense) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Error" showBack />
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="warning-outline" size={60} color="#ef4444" />
          <Text className="mt-5 text-xl font-dm-sans-bold text-red-600 text-center">
            Failed to Load Expense
          </Text>
          <Text className="mt-2 text-base font-dm-sans text-gray-600 text-center">
            {error?.message ||
              "The expense details could not be loaded. It might have been deleted or there was a network issue."}
          </Text>
          <Button
            onPress={() => refetch()}
            isLoading={isRefetching}
            className="mt-8 w-1/2"
          >
            Try Again
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Format data for display
  const formattedAmount = Number.parseFloat(expense.amount).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "RWF",
    }
  );

  const formattedCreatedDate = new Date(expense.createdAt).toLocaleString(
    "en-GB",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const formattedExpenseDate = expense.date
    ? new Date(expense.date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Expense Details"
        showBack
        rightComponent={
          <TouchableOpacity
            onPress={() => setShowDeleteModal(true)}
            className="p-3 -mr-3 rounded-xl active:bg-white/20 active:opacity-70"
          >
            <Ionicons name="trash-bin-outline" size={26} color="white" />
          </TouchableOpacity>
        }
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 24,
          paddingBottom: 120,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#F97316"
            colors={["#F97316"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Card */}
        <View className="bg-orange-500 p-8 rounded-3xl shadow-lg mb-6">
          <View className="items-center">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
              <Ionicons name="receipt" size={40} color="white" />
            </View>
            <Text className="text-sm font-dm-sans-medium text-white/80 mb-2">
              Amount Spent
            </Text>
            <Text className="text-4xl font-dm-sans-bold text-white">
              {formattedAmount}
            </Text>
          </View>
        </View>

        {/* Details Card */}
        <View className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          {/* Expense Name */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="pricetag" size={16} color="#F97316" />
              </View>
              <Text className="text-sm font-dm-sans-medium text-gray-500">
                Expense Name
              </Text>
            </View>
            <Text className="text-2xl font-dm-sans-bold text-gray-800 leading-tight ml-11">
              {expense.name}
            </Text>
          </View>

          {/* Title (if exists and different from name) */}
          {expense.title && expense.title !== expense.name && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="bookmark" size={16} color="#f59e0b" />
                </View>
                <Text className="text-sm font-dm-sans-medium text-gray-500">
                  Title
                </Text>
              </View>
              <View className="ml-11 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <Text className="text-lg font-dm-sans-bold text-gray-800">
                  {expense.title}
                </Text>
              </View>
            </View>
          )}

          {/* Category (if exists) */}
          {expense.category && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="grid" size={16} color="#3b82f6" />
                </View>
                <Text className="text-sm font-dm-sans-medium text-gray-500">
                  Category
                </Text>
              </View>
              <View className="ml-11 flex-row items-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <Ionicons
                  name={getCategoryIcon(expense.category) as any}
                  size={24}
                  color="#3b82f6"
                />
                <Text className="text-lg font-dm-sans-bold text-gray-800 ml-3">
                  {expense.category}
                </Text>
              </View>
            </View>
          )}

          {/* Expense Date (if exists) */}
          {formattedExpenseDate && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="calendar" size={16} color="#10b981" />
                </View>
                <Text className="text-sm font-dm-sans-medium text-gray-500">
                  Expense Date
                </Text>
              </View>
              <Text className="text-lg font-dm-sans text-gray-700 ml-11">
                {formattedExpenseDate}
              </Text>
            </View>
          )}

          {/* Description (if exists) */}
          {expense.description && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="document-text" size={16} color="#8b5cf6" />
                </View>
                <Text className="text-sm font-dm-sans-medium text-gray-500">
                  Description
                </Text>
              </View>
              <View className="ml-11 bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <Text className="text-base font-dm-sans text-gray-700 leading-relaxed">
                  {expense.description}
                </Text>
              </View>
            </View>
          )}

          {/* Note (if exists) */}
          {expense.note && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-pink-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="create" size={16} color="#ec4899" />
                </View>
                <Text className="text-sm font-dm-sans-medium text-gray-500">
                  Note
                </Text>
              </View>
              <View className="ml-11 bg-pink-50 p-4 rounded-2xl border border-pink-100">
                <Text className="text-base font-dm-sans text-gray-700 leading-relaxed">
                  {expense.note}
                </Text>
              </View>
            </View>
          )}

          {/* Date Logged */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="time" size={16} color="#6b7280" />
              </View>
              <Text className="text-sm font-dm-sans-medium text-gray-500">
                Date Logged
              </Text>
            </View>
            <Text className="text-base font-dm-sans text-gray-700 ml-11">
              {formattedCreatedDate}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-4 mt-4">
            <View className="flex-1">
              <Button
                variant="outline"
                onPress={() => router.back()}
                className="border-2 border-gray-300 rounded-2xl "
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="arrow-back" size={20} color="#6b7280" />
                  <Text className="text-gray-600 font-dm-sans-medium ml-2">
                    Back
                  </Text>
                </View>
              </Button>
            </View>
            <View className="flex-1">
              <Button
                variant="danger"
                onPress={() => setShowDeleteModal(true)}
                className=" rounded-2xl"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="trash-bin" size={20} color="white" />
                  <Text className="text-white font-dm-sans-bold ml-2">
                    Delete
                  </Text>
                </View>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Delete Modal */}
      <DeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteExpense}
        isLoading={deleteMutation.isPending}
        title="Delete Expense"
        description="Are you sure you want to delete this expense?"
        itemName={expense?.name}
      />
    </SafeAreaView>
  );
}
