"use client";

import { Stack, SplashScreen, router } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import "../global.css";
import { AuthProvider, useAuth } from "../lib/auth";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    "DMSans-Regular": require("../assets/fonts/DMSans-Regular.ttf"),
    "DMSans-Medium": require("../assets/fonts/DMSans-Medium.ttf"),
    "DMSans-Bold": require("../assets/fonts/DMSans-Bold.ttf"),
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isAuthLoading]);

  useEffect(() => {
    if (!isAuthLoading && !fontError && fontsLoaded) {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [user, isAuthLoading, fontsLoaded, fontError]);

  if (isAuthLoading || !fontsLoaded) {
    if (fontError) {
      return (
        <View className="flex-1 justify-center items-center p-5 bg-white">
          <Text className="text-lg text-red-600 text-center font-dm-sans-medium">
            Error loading fonts.
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2 font-dm-sans">
            {fontError.message}
          </Text>
        </View>
      );
    }
    return null;
  }

  if (fontError) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-white">
        <Text className="text-lg text-red-600 text-center font-dm-sans-medium">
          Error loading fonts.
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-2 font-dm-sans">
          {fontError.message}
        </Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: "none" }} />
      <Stack.Screen name="auth" options={{ animation: "none" }} />
      <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <StatusBar barStyle="light-content" />
            <RootNavigation />
            <Toast />
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
