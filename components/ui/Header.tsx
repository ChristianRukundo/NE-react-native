"use client";

import type React from "react";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { LogoutModal } from "./LogoutModal";
import { useAuth } from "../../lib/auth";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
  showGrid?: boolean;
  showLogout?: boolean;
  rightComponent?: React.ReactNode;
  headerClassName?: string;
  titleClassName?: string;
}

export function Header({
  title,
  showBack = false,
  showNotification = false,
  showGrid = false,
  showLogout = false,
  rightComponent,
  headerClassName,
  titleClassName,
}: HeaderProps) {
  const navigation = useNavigation();
  const { logoutUser } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const canActuallyGoBack = showBack && navigation.canGoBack();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <View className="bg-white">
        <LinearGradient
          colors={["#FB923C", "#F97316"]}
          className={`rounded-b-[40px] overflow-hidden ${
            headerClassName || ""
          }`}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView edges={["top"]}>
            <View
              className="flex-row items-center justify-between px-6 pt-4 pb-8"
              style={{ minHeight: 80 }}
            >
              {/* Left section for back/grid icons */}
              <View className="flex-1 flex-row items-center justify-start">
                {canActuallyGoBack && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-3 -ml-3 mr-2 rounded-xl active:bg-white/20"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="arrow-back" size={28} color="white" />
                  </TouchableOpacity>
                )}
                {showGrid && !canActuallyGoBack && (
                  <TouchableOpacity
                    className="p-3 -ml-3 rounded-xl active:bg-white/20"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="grid" size={26} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Title (centered) */}
              <View className="absolute inset-0 flex-row justify-center items-center pointer-events-none">
                <Text
                  className={`text-xl font-dm-sans-bold text-white ${
                    titleClassName || ""
                  }`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {title}
                </Text>
              </View>

              {/* Right section */}
              <View className="flex-1 flex-row items-center justify-end">
                {rightComponent ? (
                  <View>{rightComponent}</View>
                ) : showLogout ? (
                  <TouchableOpacity
                    onPress={() => setShowLogoutModal(true)}
                    className="p-3 -mr-3 rounded-xl active:bg-white/20 active:opacity-70"
                  >
                    <Ionicons name="log-out-outline" size={28} color="white" />
                  </TouchableOpacity>
                ) : showNotification ? (
                  <TouchableOpacity
                    className="relative p-3 -mr-3 rounded-xl active:bg-white/20"
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={26}
                      color="white"
                    />
                    <View className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-orange-500" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* Logout Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}
