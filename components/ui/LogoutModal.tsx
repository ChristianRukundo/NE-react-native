"use client";

import React from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Button from "./Button";

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const { width } = Dimensions.get("window");

export function LogoutModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          style={{ width: width - 48 }}
        >
          {/* Header with gradient */}
          <LinearGradient
            colors={["#FB923C", "#F97316"]}
            className="p-6 items-center"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
              <Ionicons name="log-out-outline" size={40} color="white" />
            </View>
            <Text className="text-2xl font-dm-sans-bold text-white text-center">
              Logout Confirmation
            </Text>
            <Text className="text-white/90 font-dm-sans text-center mt-2">
              Are you sure you want to sign out?
            </Text>
          </LinearGradient>

          {/* Content */}
          <View className="p-6">
            <Text className="text-base font-dm-sans text-gray-600 text-center mb-8 leading-relaxed">
              You'll need to sign in again to access your expense data. Any
              unsaved changes will be lost.
            </Text>

            {/* Action Buttons */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Button
                  variant="outline"
                  onPress={onClose}
                  disabled={isLoading}
                  className="border-2 border-gray-300 rounded-2xl py-4"
                  size="lg"
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="close" size={20} color="#6b7280" />
                    <Text className="text-gray-600 font-dm-sans-medium ml-2">
                      Cancel
                    </Text>
                  </View>
                </Button>
              </View>
              <View className="flex-1">
                <Button
                  variant="danger"
                  onPress={onConfirm}
                  isLoading={isLoading}
                  className="py-4 rounded-2xl"
                  size="lg"
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="log-out" size={20} color="white" />
                    <Text className="text-white font-dm-sans-bold ml-2">
                      Logout
                    </Text>
                  </View>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
