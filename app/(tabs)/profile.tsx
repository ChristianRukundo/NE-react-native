"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

import { profileApi } from "../../lib/api";
import { profileSchema, type ProfileFormData } from "../../lib/validations";
import { Header } from "@/components/ui/Header";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/ui/Input";
import Button from "../../components/ui/Button";
import { Picker } from "@/components/ui/picker";

const stateOptions = [
  { label: "Pennsylvania", value: "Pennsylvania" },
  { label: "California", value: "California" },
  { label: "New York", value: "New York" },
  { label: "Texas", value: "Texas" },
  { label: "Florida", value: "Florida" },
];

export default function ProfileScreen() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [promotionalNotifications, setPromotionalNotifications] =
    useState(true);

  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.get,
  });

  const updateMutation = useMutation({
    mutationFn: profileApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowEditModal(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Failed to update profile",
      });
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  const handleEditProfile = () => {
    if (profile?.data) {
      reset(profile.data);
      setShowEditModal(true);
    }
  };

  const menuItems = [
    {
      icon: "card",
      title: "Payment Methods",
      subtitle: "Add your credit & debit cards",
      onPress: () => {},
    },
    {
      icon: "location",
      title: "Locations",
      subtitle: "Add your home & work locations",
      onPress: () => {},
    },
    {
      icon: "share",
      title: "Add Social Account",
      subtitle: "Add Facebook, Instagram, Twitter etc",
      onPress: () => {},
    },
    {
      icon: "people",
      title: "Refer to Friends",
      subtitle: "Get $10 for referring friends",
      onPress: () => {},
    },
  ];

  const moreItems = [
    {
      icon: "call",
      title: "Contact Us",
      subtitle: "For more information",
      onPress: () => {},
    },
    {
      icon: "log-out",
      title: "Logout",
      subtitle: "",
      onPress: () => {
        // Handle logout
        Toast.show({
          type: "info",
          text1: "Logged Out",
          text2: "You have been logged out successfully",
        });
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-200">
      <Header title="Profile" showGrid />

      <View className="flex-1 bg-white rounded-t-[40px] mt-4">
        <ScrollView className="flex-1 px-6 pt-8">
          {/* Profile Header */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-red-400 rounded-3xl items-center justify-center mb-4">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                }}
                className="w-20 h-20 rounded-2xl"
              />
            </View>
            <Text className="font-dm-sans-bold text-2xl text-gray-900 mb-1">
              {profile?.data?.fullName || "Hannah Turin"}
            </Text>
            <Text className="font-dm-sans text-base text-primary-500 mb-4">
              {profile?.data?.email || "hannah.turin@email.com"}
            </Text>
            <TouchableOpacity
              onPress={handleEditProfile}
              className="border border-primary-500 px-8 py-3 rounded-full"
            >
              <Text className="font-dm-sans-medium text-primary-500">Edit</Text>
            </TouchableOpacity>
          </View>

          {/* General Section */}
          <View className="mb-8">
            <Text className="font-dm-sans-bold text-sm text-primary-500 mb-4 tracking-wider">
              GENERAL
            </Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                className="flex-row items-center py-4 border-b border-gray-100"
              >
                <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name={item.icon as any} size={20} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="font-dm-sans-medium text-base text-gray-900">
                    {item.title}
                  </Text>
                  <Text className="font-dm-sans text-sm text-gray-500">
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Notifications Section */}
          <View className="mb-8">
            <Text className="font-dm-sans-bold text-sm text-primary-500 mb-4 tracking-wider">
              NOTIFICATIONS
            </Text>

            <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="notifications" size={20} color="#6B7280" />
                </View>
                <View>
                  <Text className="font-dm-sans-medium text-base text-gray-900">
                    Push Notifications
                  </Text>
                  <Text className="font-dm-sans text-sm text-gray-500">
                    For daily update and others.
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#E5E7EB", true: "#FF5722" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View className="flex-row items-center justify-between py-4">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="megaphone" size={20} color="#6B7280" />
                </View>
                <View>
                  <Text className="font-dm-sans-medium text-base text-gray-900">
                    Promotional Notifications
                  </Text>
                  <Text className="font-dm-sans text-sm text-gray-500">
                    New Campaign & Offers
                  </Text>
                </View>
              </View>
              <Switch
                value={promotionalNotifications}
                onValueChange={setPromotionalNotifications}
                trackColor={{ false: "#E5E7EB", true: "#FF5722" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* More Section */}
          <View className="mb-8">
            <Text className="font-dm-sans-bold text-sm text-primary-500 mb-4 tracking-wider">
              MORE
            </Text>
            {moreItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                className="flex-row items-center py-4 border-b border-gray-100"
              >
                <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-4">
                  <Ionicons name={item.icon as any} size={20} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="font-dm-sans-medium text-base text-gray-900">
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text className="font-dm-sans text-sm text-gray-500">
                      {item.subtitle}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Image */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-red-400 rounded-3xl items-center justify-center relative">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                }}
                className="w-20 h-20 rounded-2xl"
              />
              <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full items-center justify-center shadow-md">
                <Ionicons name="camera" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
              />
            )}
          />

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
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mb-4">
                <Text className="text-gray-500 font-dm-sans text-sm mb-2">
                  Phone Number
                </Text>
                <View className="flex-row">
                  <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-4 mr-2">
                    <Text className="text-2xl mr-2">🇺🇸</Text>
                  </View>
                  <View className="flex-1">
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.phoneNumber?.message}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Current Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.address?.message}
              />
            )}
          />

          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="zipCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Zip Code"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.zipCode?.message}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    label="State"
                    value={value}
                    onValueChange={onChange}
                    options={stateOptions}
                    error={errors.state?.message}
                  />
                )}
              />
            </View>
          </View>

          <Input
            label="Password"
            value="••••••"
            editable={false}
            className="mb-4"
          />

          <TouchableOpacity className="border border-gray-200 rounded-xl py-4 mb-6">
            <Text className="text-center font-dm-sans-medium text-gray-900">
              Change Password →
            </Text>
          </TouchableOpacity>

          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving Changes..." : "Save Changes"}
          </Button>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}
