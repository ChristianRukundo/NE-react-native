"use client";

import React from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Button from "./Button";

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  itemName?: string;
}

const { width } = Dimensions.get("window");

export function DeleteModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Delete Confirmation",
  description = "This action cannot be undone.",
  itemName,
}: DeleteModalProps) {
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
            colors={["#ef4444", "#dc2626"]}
            className="p-6 items-center"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
              <Ionicons name="trash-bin" size={40} color="white" />
            </View>
            <Text className="text-2xl font-dm-sans-bold text-white text-center">
              {title}
            </Text>
            <Text className="text-white/90 font-dm-sans text-center mt-2">
              This action cannot be undone
            </Text>
          </LinearGradient>

          {/* Content */}
          <View className="p-6">
            {itemName && (
              <View className="bg-red-50 p-4 rounded-2xl border border-red-100 mb-6">
                <Text className="text-sm font-dm-sans-medium text-red-600 mb-1">
                  Item to delete:
                </Text>
                <Text
                  className="text-lg font-dm-sans-bold text-red-800"
                  numberOfLines={2}
                >
                  {itemName}
                </Text>
              </View>
            )}

            <Text className="text-base font-dm-sans text-gray-600 text-center mb-8 leading-relaxed">
              {description} Once deleted, this information will be permanently
              removed from your account.
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
                    <Ionicons name="trash-bin" size={20} color="white" />
                    <Text className="text-white font-dm-sans-bold ml-2">
                      Delete
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
