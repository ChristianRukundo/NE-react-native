import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingStep3() {
  const handleGetStarted = () => {
    router.replace("/auth/login");
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
        {/* Gradient Section */}
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
            <Image
              source={require("../../assets/images/onboarding-delivery.png")}
              className="w-[300px] h-[300px]"
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        {/* White Content Section */}
        <View className="px-6 pt-8 pb-6 items-center flex-1 justify-between">
          <View className="w-full items-center">
            <Text className="text-3xl font-dm-sans-bold text-gray-900 mb-4 text-center">
              Smart Parking Solutions
            </Text>
            <Text className="text-base font-dm-sans text-gray-600 text-center leading-relaxed mb-10">
              Navigate to your spot, manage bookings,{"\n"}
              and get support all in one place. Parking{"\n"}
              made simple and smart.
            </Text>
            <View className="flex-row items-center justify-center mb-10">
              <View className="w-2 h-2 bg-gray-300 rounded-full mr-2" />
              <View className="w-2 h-2 bg-gray-300 rounded-full mr-2" />
              <View className="w-6 h-2 bg-orange-500 rounded-full" />
            </View>
          </View>
          <TouchableOpacity
            onPress={handleGetStarted}
            className="bg-orange-500 py-3.5 rounded-xl w-full items-center"
          >
            <Text className="text-white font-dm-sans-bold text-base">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
