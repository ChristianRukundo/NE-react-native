// components/ui/Input.tsx (Enhanced)
"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  // isPassword prop is now handled by checking secureTextEntry
  leftIcon?: keyof typeof Feather.glyphMap;
  // rightIcon is now determined by secureTextEntry or a custom onRightIconPress
  // onRightIconPress?: () => void; // Keep if you need a generic right icon action
  iconColor?: string;
  iconSize?: number;
  containerClassName?: string; // For custom styling of the outer container
  inputWrapperClassName?: string; // For custom styling of the input's direct wrapper
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  secureTextEntry, // Use secureTextEntry directly
  // onRightIconPress,
  iconColor = "#9CA3AF", // Slightly darker gray for default icons
  iconSize = 18, // Slightly smaller default icon
  className, // This will apply to the TextInput element itself
  containerClassName,
  inputWrapperClassName,
  editable = true, // Default to true
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const themeColors = {
    primaryFocusBorder: "#FF6F00", // **ADJUST THIS TO YOUR PRIMARY COLOR**
    errorBorder: "#EF4444", // Red-500
    defaultBorder: "#D1D5DB", // Gray-300
    disabledBorder: "#E5E7EB", // Gray-200
    disabledBackground: "#F9FAFB", // Gray-50
    labelText: "#374151", // Gray-700
    inputText: "#1F2937", // Gray-800
    placeholderText: "#9CA3AF", // Gray-400
    errorText: "#EF4444", // Red-500
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const hasRightIconAction = secureTextEntry; // || onRightIconPress;

  return (
    <View className={twMerge("mb-5", containerClassName)}>
      {label && (
        <Text
          className={`mb-1.5 text-sm font-dm-sans-medium text-[${themeColors.labelText}]`}
        >
          {label}
        </Text>
      )}
      <View
        className={twMerge(
          "flex-row items-center w-full rounded-xl border bg-white overflow-hidden", // overflow-hidden to contain children
          // Border priority: error > focus > default > disabled
          error
            ? `border-[${themeColors.errorBorder}]`
            : isFocused
            ? `border-[${themeColors.primaryFocusBorder}] shadow-md shadow-[${themeColors.primaryFocusBorder}/30]` // Subtle shadow on focus
            : !editable
            ? `border-[${themeColors.disabledBorder}]`
            : `border-[${themeColors.defaultBorder}]`,
          !editable ? `bg-[${themeColors.disabledBackground}]` : "bg-white",
          inputWrapperClassName
        )}
        // Using StyleSheet for more control over shadow on focus if needed
        // style={[isFocused && !error ? styles.focusedInputContainer : {}]}
      >
        {leftIcon && (
          <View className="pl-3.5 pr-2 items-center justify-center">
            <Feather
              name={leftIcon}
              size={iconSize}
              color={
                isFocused && !error ? themeColors.primaryFocusBorder : iconColor
              }
            />
          </View>
        )}

        <TextInput
          className={twMerge(
            "flex-1 text-base py-3", // Standardized padding
            leftIcon ? "" : "pl-4", // Conditional padding if no left icon
            hasRightIconAction ? "pr-12" : "pr-4", // Conditional padding if right icon action
            `font-dm-sans text-[${
              editable ? themeColors.inputText : themeColors.placeholderText
            }]`,
            className
          )}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={themeColors.placeholderText}
          editable={editable}
          {...props}
          // style={styles.inputFont} // Using Tailwind for font now
        />

        {secureTextEntry && editable && (
          <TouchableOpacity
            className="absolute right-0 top-0 bottom-0 px-3.5 items-center justify-center"
            onPress={togglePasswordVisibility}
            accessibilityLabel={
              isPasswordVisible ? "Hide password" : "Show password"
            }
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={iconSize}
              color={
                isFocused && !error ? themeColors.primaryFocusBorder : iconColor
              }
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View className="flex-row items-center mt-1.5">
          <Feather
            name="alert-circle"
            size={14}
            color={themeColors.errorText}
            style={{ marginRight: 4 }}
          />
          <Text
            className={`text-xs font-dm-sans text-[${themeColors.errorText}]`}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;
