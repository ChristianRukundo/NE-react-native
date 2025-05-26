"use client";

import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { loginSchema, type LoginFormData } from "../../lib/validations";
import { authApi } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "hannah.turin@email.com",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });

      router.replace("/dashboard");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.response?.data?.message || "Please check your credentials",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const handleGoogleLogin = () => {
    Toast.show({
      type: "info",
      text1: "Google Login",
      text2: "Google authentication would be implemented here",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="flex-row items-center mt-4 mb-8">
          <TouchableOpacity
            onPress={() => router.push("/onboarding/step-1")}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <Text className="text-3xl font-dm-sans-bold text-gray-900 mb-3">
            Let's Sign You In
          </Text>
          <Text className="text-lg font-dm-sans text-gray-500">
            Welcome back, you've{"\n"}been missed!
          </Text>
        </View>

        <View className="mb-6">
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

          <View className="flex-row items-center justify-between mb-8">
            <Controller
              control={control}
              name="rememberMe"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  onPress={() => onChange(!value)}
                  className="flex-row items-center"
                >
                  <View
                    className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                      value
                        ? "bg-orange-500 border-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {value && (
                      <Ionicons name="checkmark" size={12} color="white" />
                    )}
                  </View>
                  <Text className="font-dm-sans text-gray-900">
                    Remember Me
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity>
              <Text className="font-dm-sans text-orange-500">
                Forgot Password ?
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="bg-orange-500 py-4 rounded-2xl"
          >
            <Text className="text-white font-dm-sans-bold text-lg text-center">
              {loginMutation.isPending ? "Signing In..." : "Login"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-500 font-dm-sans">OR</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <Button
            variant="outline"
            onPress={handleGoogleLogin}
            className="mb-8 border-gray-200"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="logo-google"
                size={20}
                color="#4285F4"
                className="mr-3"
              />
              <Text className="text-gray-900 font-dm-sans-medium text-base">
                Continue with Google
              </Text>
            </View>
          </Button>

          <View className="flex-row items-center justify-center">
            <Text className="font-dm-sans text-gray-500">
              Don't have an account ?
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text className="font-dm-sans text-orange-500">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
