import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function OnboardingLayout() {
  return (
    
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="step-1" />
      <Stack.Screen name="step-2" />
      <Stack.Screen name="step-3" />
    </Stack>
  )
}
