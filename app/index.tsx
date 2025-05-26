"use client"

import { useEffect } from "react"
import { router } from "expo-router"
import { View, Text } from "react-native"

export default function Index() {
  useEffect(() => {
    // Navigate to onboarding after a brief delay
    const timer = setTimeout(() => {
      router.replace("/onboarding")
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-dm-sans-bold text-gray-900">Loading...</Text>
    </View>
  )
}
