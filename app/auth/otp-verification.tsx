"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  type TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import Button from "@/components/ui/Button";
import { otpSchema, type OtpFormData } from "../../lib/validations";
import { authApi } from "../../lib/api";

const { width } = Dimensions.get("window");

const KEYPAD_NUMBERS = [
  [
    { number: "1", letters: "" },
    { number: "2", letters: "ABC" },
    { number: "3", letters: "DEF" },
  ],
  [
    { number: "4", letters: "GHI" },
    { number: "5", letters: "JKL" },
    { number: "6", letters: "MNO" },
  ],
  [
    { number: "7", letters: "PQRS" },
    { number: "8", letters: "TUV" },
    { number: "9", letters: "WXYZ" },
  ],
  [{ number: "0", letters: "" }], // This is for the UI structure, will be handled in the bottom row
];

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(60); // Design shows 00:50, assuming it starts from 60
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors }, // errors from useForm not directly used for OTP input display
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setValue("otp", otp.join(""));
  }, [otp, setValue]);

  const verifyOtpMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Verification Successful",
        text2: "Welcome to the app!",
      });
      router.replace("/dashboard");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: error.response?.data?.message || "Invalid OTP code",
      });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: () => authApi.resendOtp("+1 999 999 999"), // Hardcoded phone as per image
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "A new verification code has been sent",
      });
      setCountdown(60); // Reset countdown
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Failed to Resend",
        text2: error.response?.data?.message || "Please try again",
      });
    },
  });

  const onSubmit = (data: OtpFormData) => {
    verifyOtpMutation.mutate({
      phone: "+1 999 999 999", // Hardcoded phone
      otp: data.otp,
    });
  };

  const handleKeypadPress = (number: string) => {
    const currentIndex = otp.findIndex((digit) => digit === "");
    if (currentIndex !== -1) {
      const newOtp = [...otp];
      newOtp[currentIndex] = number;
      setOtp(newOtp);
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = otp
      .map((digit, index) => (digit !== "" ? index : -1))
      .filter((index) => index !== -1)
      .pop();

    if (lastFilledIndex !== undefined) {
      const newOtp = [...otp];
      newOtp[lastFilledIndex] = "";
      setOtp(newOtp);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-center px-6 mt-4 mb-8 relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-6"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-dm-sans-medium text-gray-900">
            OTP Verification
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6">
          {/* Description */}
          <View className="items-center mb-8">
            <Text className="text-base font-dm-sans text-gray-600 text-center mb-2">
              An Authentication code has been sent to
            </Text>
            <Text className="text-base font-dm-sans-medium text-orange-500">
              {" "}
              {/* font-dm-sans-medium for emphasis */}
              (+1) 999 999 999
            </Text>
          </View>

          {/* OTP Input */}
          <View className="flex-row justify-center space-x-3 mb-8">
            {" "}
            {/* Reduced space-x for closer boxes */}
            {otp.map((digit, index) => (
              <View
                key={index}
                className="w-16 h-16 border border-gray-200 rounded-xl items-center justify-center bg-white" // bg-white as per design
              >
                <Text className="text-2xl font-dm-sans-bold text-gray-900">
                  {digit}
                </Text>
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={verifyOtpMutation.isPending || otp.join("").length !== 4}
            className="mb-6"
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Submit"}
          </Button>

          {/* Resend Code */}
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={() => resendOtpMutation.mutate()}
              disabled={countdown > 0 || resendOtpMutation.isPending}
            >
              <Text
                className={`font-dm-sans text-gray-600 ${
                  countdown > 0 ? "opacity-50" : ""
                }`}
              >
                Code Sent. Resend Code in{" "}
                <Text className="text-orange-500">{formatTime(countdown)}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Keypad */}
        <View className="bg-gray-100 px-6 pb-8 pt-6">
          {" "}
          {/* Added pt-6 for some top padding */}
          {KEYPAD_NUMBERS.slice(0, 3).map(
            (
              row,
              rowIndex // Only first 3 rows for numbers 1-9
            ) => (
              <View key={rowIndex} className="flex-row justify-center mb-3">
                {" "}
                {/* Reduced mb */}
                {row.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    onPress={() => handleKeypadPress(item.number)}
                    className="w-20 h-16 bg-white rounded-xl items-center justify-center mx-2 shadow-sm"
                  >
                    <Text className="text-2xl font-dm-sans-bold text-gray-900">
                      {item.number}
                    </Text>
                    {item.letters && (
                      <Text className="text-xs font-dm-sans text-gray-500">
                        {item.letters}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
          {/* Bottom row with empty, 0 and backspace */}
          <View className="flex-row justify-center">
            <View className="w-20 mx-2" />{" "}
            {/* Empty space to align 0 in center */}
            <TouchableOpacity
              onPress={() => handleKeypadPress("0")}
              className="w-20 h-16 bg-white rounded-xl items-center justify-center mx-2 shadow-sm"
            >
              <Text className="text-2xl font-dm-sans-bold text-gray-900">
                0
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleBackspace}
              className="w-20 h-16 bg-white rounded-xl items-center justify-center mx-2 shadow-sm"
            >
              <Ionicons name="backspace-outline" size={28} color="#000" />{" "}
              {/* Increased icon size slightly */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
