"use client";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LoadingStateProps {
  title?: string;
  message?: string;
  showIcon?: boolean;
}

export function LoadingState({
  title = "Loading",
  message = "Please wait while we fetch your data...",
  showIcon = true,
}: LoadingStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      {showIcon && (
        <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="wallet" size={48} color="#F97316" />
        </View>
      )}
      <ActivityIndicator size="large" color="#F97316" className="mb-4" />
      <Text className="text-2xl font-dm-sans-bold text-gray-800 text-center mb-3">
        {title}
      </Text>
      <Text className="text-base font-dm-sans text-gray-600 text-center leading-relaxed px-4">
        {message}
      </Text>
    </View>
  );
}
