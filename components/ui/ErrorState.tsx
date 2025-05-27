"use client"
import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Button from "./Button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
  icon?: keyof typeof Ionicons.glyphMap
}

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again",
  onRetry,
  isRetrying = false,
  icon = "cloud-offline-outline",
}: ErrorStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-8">
      <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
        <Ionicons name={icon} size={48} color="#ef4444" />
      </View>
      <Text className="text-2xl font-dm-sans-bold text-gray-800 text-center mb-3">{title}</Text>
      <Text className="text-base font-dm-sans text-gray-600 text-center mb-8 leading-relaxed px-4">{message}</Text>
      {onRetry && (
        <Button onPress={onRetry} isLoading={isRetrying} className="px-8" size="lg">
          <View className="flex-row items-center">
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white font-dm-sans-bold ml-2">Try Again</Text>
          </View>
        </Button>
      )}
    </View>
  )
}
