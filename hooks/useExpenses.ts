"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi } from "../lib/api";
import type { Expense } from "../lib/types";
import Toast from "react-native-toast-message";

export function useExpenses() {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery<Expense[], Error>({
    queryKey: ["expenses"],
    queryFn: financeApi.getExpenses,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false, // Disable auto refetch on focus
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  const deleteExpenseMutation = useMutation<void, Error, string>({
    mutationFn: financeApi.deleteExpense,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Expense deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: error.message || "Could not delete expense",
      });
    },
  });

  const manualRefetch = () => {
    return expensesQuery.refetch();
  };

  return {
    // Data
    expenses: expensesQuery.data,

    // Loading states
    isInitialLoading: expensesQuery.isLoading && !expensesQuery.data,
    isRefetching: expensesQuery.isRefetching,
    isFetching: expensesQuery.isFetching && !expensesQuery.isRefetching,

    // Error states
    isError: expensesQuery.isError,
    error: expensesQuery.error,

    // Actions
    refetch: manualRefetch,
    deleteExpense: deleteExpenseMutation.mutate,

    // Mutation states
    isDeletingExpense: deleteExpenseMutation.isPending,
  };
}
