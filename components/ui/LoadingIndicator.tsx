// components/ui/LoadingIndicator.tsx
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Optional for full-screen variant

interface LoadingIndicatorProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean; // To control if it takes up the whole screen
  backgroundColor?: string; // Optional background for full-screen
  textColor?: string; // Optional text color
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message, // Default message set below
  size = "large",
  color = "#f97316", // primary-500 (citrus theme orange)
  fullScreen = false,
  backgroundColor = "bg-gray-50", // Default background for full screen (light gray)
  textColor = "text-primary-600", // Default text color
}) => {
  const loadingMessage =
    message || (fullScreen ? "Loading, please wait..." : "Loading...");

  if (fullScreen) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${backgroundColor}`}
      >
        <ActivityIndicator size={size} color={color} />
        {loadingMessage && (
          <Text className={`mt-4 text-base font-dm-sans-medium ${textColor}`}>
            {loadingMessage}
          </Text>
        )}
      </SafeAreaView>
    );
  }

  // Inline loading indicator
  return (
    <View className="flex-row items-center justify-center py-4">
      <ActivityIndicator size={size} color={color} />
      {loadingMessage && (
        <Text className={`ml-3 text-sm font-dm-sans ${textColor}`}>
          {loadingMessage}
        </Text>
      )}
    </View>
  );
};

export default LoadingIndicator;
