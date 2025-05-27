
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

  leftIcon?: keyof typeof Feather.glyphMap;


  iconColor?: string;
  iconSize?: number;
  containerClassName?: string;
  inputWrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  secureTextEntry,

  iconColor = "#9CA3AF",
  iconSize = 18,
  className,
  containerClassName,
  inputWrapperClassName,
  editable = true,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const themeColors = {
    primaryFocusBorder: "#FF6F00",
    errorBorder: "#EF4444",
    defaultBorder: "#D1D5DB",
    disabledBorder: "#E5E7EB",
    disabledBackground: "#F9FAFB",
    labelText: "#374151",
    inputText: "#1F2937",
    placeholderText: "#9CA3AF",
    errorText: "#EF4444",
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

  const hasRightIconAction = secureTextEntry;

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
          "flex-row items-center w-full rounded-xl border bg-white overflow-hidden",

          error
            ? `border-[${themeColors.errorBorder}]`
            : isFocused
              ? `border-[${themeColors.primaryFocusBorder}] shadow-md shadow-[${themeColors.primaryFocusBorder}/30]`
              : !editable
                ? `border-[${themeColors.disabledBorder}]`
                : `border-[${themeColors.defaultBorder}]`,
          !editable ? `bg-[${themeColors.disabledBackground}]` : "bg-white",
          inputWrapperClassName
        )}


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
            "flex-1 text-base py-3",
            leftIcon ? "" : "pl-4",
            hasRightIconAction ? "pr-12" : "pr-4",
            `font-dm-sans text-[${editable ? themeColors.inputText : themeColors.placeholderText
            }]`,
            className
          )}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={themeColors.placeholderText}
          editable={editable}
          {...props}

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
