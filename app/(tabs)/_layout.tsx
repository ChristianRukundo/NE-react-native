import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#2D2D2D",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#FF5722",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontFamily: "DMSans-Medium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`w-12 h-12 rounded-full items-center justify-center `}
            >
              <Ionicons
                name="home"
                size={24}
                color={focused ? "#FF5722" : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: "Vehicles",
          tabBarIcon: ({ color }) => (
            <Ionicons name="car" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="parking-slots"
        options={{
          title: "Parking",
          tabBarIcon: ({ color }) => (
            <Ionicons name="business" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`w-12 h-12 rounded-full items-center justify-cente`}
            >
              <Ionicons
                name="person"
                size={24}
                color={focused ? "#FF5722" : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
