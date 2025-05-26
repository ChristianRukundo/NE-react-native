import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { registerSchema, type RegisterFormData } from "../../lib/validations";
import { authApi } from "../../lib/api";

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authApi.register({
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      }),
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Sign Up Successful",
        text2: "Please verify your email or phone.",
      });

      router.push("/auth/otp-verification");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Sign Up Failed",
        text2:
          error.response?.data?.message ||
          "Please check your details and try again.",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("Submitting data:", data);
    registerMutation.mutate(data);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-center mt-4 mb-8 relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-0"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-dm-sans-medium text-gray-900">
            Sign Up
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-3xl font-dm-sans-bold text-gray-900 mb-3">
            Create Account
          </Text>
          <Text className="text-lg font-dm-sans text-gray-500">
            Let's get you started!
          </Text>
        </View>

        <View className="mb-6">
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="First Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Last Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="relative">
                <Input
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-12"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="relative">
                <Input
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-12"
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="agreeToTerms"
            render={({ field: { onChange, value } }) => (
              <View className="mb-8 mt-4">
                <TouchableOpacity
                  onPress={() => onChange(!value)}
                  className="flex-row items-start"
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center mt-1 ${
                      value
                        ? "bg-orange-500 border-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {value && (
                      <Ionicons name="checkmark" size={12} color="white" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-dm-sans text-gray-600 text-sm">
                      By creating an account, you agree to our{" "}
                      <Text className="text-orange-500 font-dm-sans-medium">
                        Terms and Conditions
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
                {errors.agreeToTerms && (
                  <Text className="text-red-500 font-dm-sans text-xs mt-1 ml-8">
                    {errors.agreeToTerms.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={registerMutation.isPending}
            className="mb-6"
          >
            {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
          </Button>

          <View className="flex-row items-center justify-center pb-6">
            <Text className="font-dm-sans text-gray-500">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text className="font-dm-sans-medium text-orange-500">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
