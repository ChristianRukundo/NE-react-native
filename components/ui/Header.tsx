import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  showGrid?: boolean;
}

export function Header({
  title,
  showBack = false,
  showNotification = true,
  showGrid = false,
}: HeaderProps) {
  return (
    <SafeAreaView className="bg-dark-200">
      <View className="flex-row items-center justify-between px-6 py-4">
        <View className="flex-row items-center flex-1">
          {showBack && (
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          )}
          {showGrid && (
            <TouchableOpacity className="mr-4">
              <Ionicons name="grid" size={24} color="black" />
            </TouchableOpacity>
          )}
          <Text className="text-black font-dm-sans-bold text-lg flex-1 text-center">
            {title}
          </Text>
        </View>
        {showNotification && (
          <TouchableOpacity className="relative">
            <Ionicons name="notifications" size={24} color="black" />
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
