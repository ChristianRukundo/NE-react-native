import type React from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  type TouchableOpacityProps,
  Platform,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: keyof typeof Feather.glyphMap | keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap | keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconLibrary?: "feather" | "ionicons";
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  iconSize = 18,
  iconLibrary = "feather",
  children,
  className,
  disabled,
  fullWidth = false,
  activeOpacity = 0.8,
  ...props
}) => {
  const getButtonStyles = () => {
    let baseStyles = "flex-row items-center justify-center rounded-xl";

    if (fullWidth) baseStyles += " w-full";

    // Size styles
    if (size === "sm") baseStyles += " py-2.5 px-4 h-10";
    else if (size === "md") baseStyles += " py-3 px-5 h-12";
    else if (size === "lg") baseStyles += " py-3.5 px-6 h-14";

    // Variant styles
    if (disabled || isLoading) {
      baseStyles += " bg-gray-200";
    } else {
      if (variant === "primary") baseStyles += " bg-orange-500";
      else if (variant === "secondary") baseStyles += " bg-gray-600";
      else if (variant === "outline") baseStyles += " bg-white border-2 border-orange-500";
      else if (variant === "ghost") baseStyles += " bg-transparent";
      else if (variant === "danger") baseStyles += " bg-red-500";
    }

    return baseStyles;
  };

  const getTextStyles = () => {
    let textStyles = "font-bold";

    // Size styles
    if (size === "sm") textStyles += " text-sm";
    else if (size === "md") textStyles += " text-base";
    else if (size === "lg") textStyles += " text-lg";

    // Color styles
    if (disabled || isLoading) {
      textStyles += " text-gray-400";
    } else {
      if (variant === "primary") textStyles += " text-white";
      else if (variant === "secondary") textStyles += " text-white";
      else if (variant === "outline") textStyles += " text-orange-500";
      else if (variant === "ghost") textStyles += " text-orange-500";
      else if (variant === "danger") textStyles += " text-white";
    }

    return textStyles;
  };

  const getIconColor = () => {
    if (disabled || isLoading) return "#9CA3AF";
    if (variant === "primary") return "#FFFFFF";
    if (variant === "secondary") return "#FFFFFF";
    if (variant === "danger") return "#FFFFFF";
    if (variant === "outline") return "#F97316";
    if (variant === "ghost") return "#F97316";
    return "#6B7280";
  };

  const renderIcon = (iconName: string, marginStyle: object) => {
    if (iconLibrary === "ionicons") {
      return (
        <Ionicons
          name={iconName as keyof typeof Ionicons.glyphMap}
          size={iconSize}
          color={getIconColor()}
          style={marginStyle}
        />
      );
    } else {
      return (
        <Feather
          name={iconName as keyof typeof Feather.glyphMap}
          size={iconSize}
          color={getIconColor()}
          style={marginStyle}
        />
      );
    }
  };

  return (
    <TouchableOpacity
      className={twMerge(getButtonStyles(), className)}
      disabled={disabled || isLoading}
      activeOpacity={activeOpacity}
      style={[
        variant === "primary" && !(disabled || isLoading) ? styles.primaryShadow : {},
        variant === "outline" ? styles.outlineShadow : {},
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <>
          {leftIcon && renderIcon(leftIcon, { marginRight: children ? 8 : 0 })}
          <Text className={getTextStyles()}>{children}</Text>
          {rightIcon && renderIcon(rightIcon, { marginLeft: children ? 8 : 0 })}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#F97316",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  outlineShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});

export default Button;
