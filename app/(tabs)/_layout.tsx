"use client";

import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 5 : 5,
          paddingTop: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontFamily: "DMSans-Medium",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Expenses",
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "list-sharp" : "list-outline"}
              size={size + 1}
              color={color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                fontFamily: "DMSans-Medium",
                fontSize: 11,
                marginTop: Platform.OS === "ios" ? -2 : 0,
                marginBottom: Platform.OS === "ios" ? 0 : 5,
              }}
            >
              Expenses
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="create-expense"
        options={{
          title: "Add New",
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "add-outline" : "add"}	
              size={focused ? size + 6 : size + 4}
              color={focused ? "#f97316" : color}
            />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color: focused ? "#f97316" : color,
                fontFamily: "DMSans-Medium",
                fontSize: 11,
                marginTop: 2,
              }}
            >
              Add New
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="expense/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
