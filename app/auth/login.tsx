"use client";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";

import { loginSchema, type LoginFormData } from "@/lib/validations";
import { financeApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

import PlainInput from "@/components/ui/PlainInput";
import Button from "@/components/ui/Button";

export default function LoginScreen() {
  const { loginUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: financeApi.login,
    onSuccess: async (user) => {
      if (user && user.password === control._formValues.password) {
        await loginUser(user);
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: `Welcome back!`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: "Invalid email or password.",
        });
      }
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: error.message || "An unexpected error occurred.",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({ username: data.username, password: data.password });
  };

  const handleGoogleLogin = () => {
    Toast.show({
      type: "info",
      text1: "Google Login",
      text2: "This feature is not yet implemented.",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Gradient Header Section */}
          <View className="min-h-[45vh]">
            <LinearGradient
              colors={["#FB923C", "#F97316"]}
              className="flex-1 rounded-b-[40px] overflow-hidden justify-center items-center pt-12 pb-8"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-6 shadow-lg">
                <Ionicons name="wallet" size={50} color="white" />
              </View>
              <Text className="text-3xl font-dm-sans-bold text-white text-center mb-2">
                Welcome Back!
              </Text>
              <Text className="text-lg font-dm-sans text-white/90 text-center">
                Sign in to track your expenses
              </Text>
            </LinearGradient>
          </View>

          {/* White Content Section */}
          <View className="px-6 pt-8 pb-6 flex-1">
            {/* Form Section */}
            <View className="space-y-5 mb-6">
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PlainInput
                    label="Email Address"
                    placeholder="you@example.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.username?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon="mail-outline"
                    iconColor={
                      errors.username
                        ? "#ef4444"
                        : value
                        ? "#F97316"
                        : "#9CA3AF"
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PlainInput
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry={true}
                    leftIcon="lock-closed-outline"
                    iconColor={
                      errors.password
                        ? "#ef4444"
                        : value
                        ? "#F97316"
                        : "#9CA3AF"
                    }
                  />
                )}
              />
            </View>

            {/* Sign In Button */}
            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={loginMutation.isPending || isFormSubmitting}
              fullWidth
              size="lg"
              className="mb-6"
            >
              {loginMutation.isPending || isFormSubmitting
                ? "Signing In..."
                : "Sign In"}
            </Button>

            {/* Divider */}
            {/* <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-sm font-dm-sans-medium text-gray-400">
                OR
              </Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View> */}

            {/* Google Login Button */}
            {/* <TouchableOpacity
              onPress={handleGoogleLogin}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm active:bg-gray-50"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="logo-google" size={24} color="#4285f4" />
                <Text className="text-gray-700 font-dm-sans-medium text-lg ml-3">
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
