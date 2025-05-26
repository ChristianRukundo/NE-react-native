import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-dm-sans-bold text-gray-900 mb-4">Welcome to Dashboard!</Text>
        <Text className="text-lg font-dm-sans text-gray-600 text-center">
          You have successfully completed the onboarding and authentication flow.
        </Text>
      </View>
    </SafeAreaView>
  )
}
