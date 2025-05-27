import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function OnboardingStep1() {
  const handleNext = () => {
    router.push("/onboarding/step-2");
  };

  const handleSkip = () => {
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View className="min-h-[60vh]">
          <LinearGradient
            colors={["#FB923C", "#F97316"]}
            className="flex-1 rounded-b-[40px] overflow-hidden justify-center items-center pt-12 pb-8"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="absolute top-6 right-6 z-10">
              <TouchableOpacity
                onPress={handleSkip}
                className="bg-white/20 px-5 py-2.5 rounded-full"
              >
                <Text className="text-white font-dm-sans-medium text-sm">
                  Skip
                </Text>
              </TouchableOpacity>
            </View>

            {/* Expense Tracking Illustration */}
            <View className="items-center">
              <View className="w-40 h-40 bg-white/20 rounded-full items-center justify-center mb-6">
                <Ionicons name="wallet" size={100} color="white" />
              </View>

              {/* Floating expense icons */}
              <View className="absolute top-20 left-8">
                <View className="w-16 h-16 bg-white/30 rounded-full items-center justify-center">
                  <Ionicons name="restaurant" size={32} color="white" />
                </View>
              </View>

              <View className="absolute top-32 right-8">
                <View className="w-12 h-12 bg-white/30 rounded-full items-center justify-center">
                  <Ionicons name="car" size={24} color="white" />
                </View>
              </View>

              <View className="absolute bottom-20 left-12">
                <View className="w-14 h-14 bg-white/30 rounded-full items-center justify-center">
                  <Ionicons name="bag" size={28} color="white" />
                </View>
              </View>

              <View className="absolute bottom-32 right-12">
                <View className="w-10 h-10 bg-white/30 rounded-full items-center justify-center">
                  <Ionicons name="medical" size={20} color="white" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="px-6 pt-8 pb-6 items-center flex-1 justify-between">
          <View className="w-full items-center">
            <Text className="text-3xl font-dm-sans-bold text-gray-900 mb-4 text-center">
              Track Every Expense
            </Text>
            <Text className="text-base font-dm-sans text-gray-600 text-center leading-relaxed mb-10">
              Never lose track of your spending again.{"\n"}
              Log expenses instantly and see where{"\n"}
              your money goes with ease.
            </Text>

            <View className="flex-row items-center justify-center mb-10">
              <View className="w-6 h-2 bg-orange-500 rounded-full mr-2" />
              <View className="w-2 h-2 bg-gray-300 rounded-full mr-2" />
              <View className="w-2 h-2 bg-gray-300 rounded-full" />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleNext}
            className="bg-orange-500 py-3.5 rounded-xl w-full items-center shadow-lg"
          >
            <Text className="text-white font-dm-sans-bold text-base">Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
