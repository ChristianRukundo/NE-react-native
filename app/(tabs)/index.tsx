"use client";

import { useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import type { Expense } from "../../lib/types";
import ExpenseListItem from "../../components/ExpenseListItem";
import { Header } from "../../components/ui/Header";
import { DeleteModal } from "../../components/ui/DeleteModal";
import { Ionicons } from "@expo/vector-icons";
import { financeApi } from "../../lib/api";

const ITEMS_PER_PAGE = 10;

export default function ExpensesListScreen() {
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: allExpenses,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: financeApi.getExpenses,
    staleTime: 1000 * 60 * 2,
  });

  const displayedExpenses = allExpenses
    ? allExpenses.slice(0, displayCount)
    : [];
  const hasMore = allExpenses ? allExpenses.length > displayCount : false;

  const deleteMutation = useMutation({
    mutationFn: financeApi.deleteExpense,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Expense deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: error.message,
      });
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    },
  });

  const handleDeletePress = useCallback(
    (expenseId: string) => {
      const expense = allExpenses?.find((e) => e.id === expenseId);
      if (expense) {
        setExpenseToDelete(expense);
        setShowDeleteModal(true);
      }
    },
    [allExpenses]
  );

  const confirmDeleteExpense = useCallback(() => {
    if (expenseToDelete) {
      deleteMutation.mutate(expenseToDelete.id);
    }
  }, [expenseToDelete, deleteMutation]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore]);

  const handleRefresh = useCallback(() => {
    setDisplayCount(ITEMS_PER_PAGE);
    setIsLoadingMore(false);
    refetch();
  }, [refetch]);

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <ExpenseListItem expense={item} onDeletePress={handleDeletePress} />
  );

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 140,
      offset: 140 * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: Expense) => item.id, []);

  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <View className="flex-1 justify-center items-center mt-20 px-8">
        <View className="w-32 h-32 bg-orange-100 rounded-full items-center justify-center mb-8">
          <Ionicons name="receipt-outline" size={64} color="#F97316" />
        </View>
        <Text className="text-2xl font-dm-sans-bold text-gray-800 mb-3 text-center">
          No Expenses Yet
        </Text>
        <Text className="text-lg font-dm-sans text-gray-500 text-center leading-relaxed mb-8">
          Start tracking your spending by adding your first expense!
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/create-expense")}
          className="bg-orange-500 px-8 py-4 rounded-2xl"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white font-dm-sans-bold text-lg ml-2">
              Add First Expense
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    if (!allExpenses || allExpenses.length === 0) return null;

    return (
      <View style={{ minHeight: 120 }}>
        {hasMore && (
          <View className="px-4 py-6">
            <TouchableOpacity
              onPress={handleLoadMore}
              disabled={isLoadingMore}
              className={`py-4 rounded-2xl shadow-lg ${
                isLoadingMore ? "bg-orange-300" : "bg-orange-500"
              }`}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                {isLoadingMore ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white font-dm-sans-bold text-lg ml-2">
                      Loading...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="chevron-down-circle-outline"
                      size={24}
                      color="white"
                    />
                    <Text className="text-white font-dm-sans-bold text-lg ml-2">
                      Load More Expenses
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {}
        <View className="px-4 pb-6" style={{ minHeight: 40 }}>
          <Text className="text-center text-sm font-dm-sans-medium text-gray-500">
            Showing {displayedExpenses.length} of {allExpenses.length} expenses
          </Text>
          {!hasMore && allExpenses.length > ITEMS_PER_PAGE && (
            <Text className="text-center text-xs font-dm-sans text-gray-400 mt-1">
              All expenses loaded
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="My Expenses" showLogout />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#F97316" />
          <Text className="mt-4 font-dm-sans-medium text-gray-700">
            Loading expenses...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="My Expenses" showLogout />

      {}
      {allExpenses && allExpenses.length > 0 && (
        <View className="mx-4 mt-4 mb-2" style={{ height: 80 }}>
          <View className="bg-orange-50 p-4 rounded-2xl border border-orange-100 h-full">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm font-dm-sans-medium text-orange-600">
                  Total Expenses
                </Text>
                <Text className="text-2xl font-dm-sans-bold text-orange-800">
                  {allExpenses.length}
                </Text>
              </View>
              <View className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                <Ionicons name="receipt" size={24} color="white" />
              </View>
            </View>
          </View>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={displayedExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 40 : 60,
        }}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor="#F97316"
            colors={["#F97316"]}
            title="Pull to refresh"
            titleColor="#F97316"
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 100,
        }}
        legacyImplementation={false}
      />

      {}
      <DeleteModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setExpenseToDelete(null);
        }}
        onConfirm={confirmDeleteExpense}
        isLoading={deleteMutation.isPending}
        title="Delete Expense"
        description="Are you sure you want to delete this expense?"
        itemName={expenseToDelete?.name}
      />
    </SafeAreaView>
  );
}
