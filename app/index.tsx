// app/index.tsx
"use client";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InitialLoadingScreen() {

  return (
    <SafeAreaView className="flex-1 bg-primary-50 justify-center items-center">
      <ActivityIndicator size="large" color="#FFFFFF" />
    </SafeAreaView>
  );
}
