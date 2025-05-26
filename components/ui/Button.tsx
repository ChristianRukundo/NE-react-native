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

interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  iconSize?: number;
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
  children,
  className,
  disabled,
  fullWidth = false,
  activeOpacity = 0.8,
  ...props
}) => {
  const themeColors = {
    primary: "#FF6F00",
    primaryText: "#FFFFFF",
    secondary: "#4A5568",
    secondaryText: "#FFFFFF",
    outlineBorder: "#CBD5E0",
    outlineText: "#FF6F00",
    ghostText: "#FF6F00",
    danger: "#E53E3E",
    dangerText: "#FFFFFF",
    disabledBackground: "#E2E8F0",
    disabledText: "#A0AEC0",
    iconDefault: "#4A5568",
  };

  const primaryColorForIcon = themeColors.primary;

  const getButtonStyles = () => {
    let baseStyles = `flex-row items-center justify-center rounded-lg transition-all duration-150 ease-in-out ${
      fullWidth ? "w-full" : ""
    }`;

    if (size === "sm") baseStyles += " py-2.5 px-4 h-10";
    else if (size === "md") baseStyles += " py-3 px-5 h-12";
    else if (size === "lg") baseStyles += " py-3.5 px-6 h-14";

    if (variant === "primary") baseStyles += ` bg-[${themeColors.primary}]`;
    else if (variant === "secondary")
      baseStyles += ` bg-[${themeColors.secondary}]`;
    else if (variant === "outline")
      baseStyles += ` bg-white border border-[${themeColors.outlineBorder}]`;
    else if (variant === "ghost") baseStyles += " bg-transparent";
    else if (variant === "danger") baseStyles += ` bg-[${themeColors.danger}]`;

    if (disabled || isLoading) {
      if (
        variant === "primary" ||
        variant === "secondary" ||
        variant === "danger"
      ) {
        baseStyles += ` bg-[${themeColors.disabledBackground}]`;
      } else if (variant === "outline") {
        baseStyles += ` border-[${themeColors.disabledBackground}] bg-gray-50`;
      } else if (variant === "ghost") {
      }
    }
    return baseStyles;
  };

  const getTextStyles = () => {
    let textStyles = "font-dm-sans-bold";

    if (size === "sm") textStyles += " text-sm";
    else if (size === "md") textStyles += " text-base";
    else if (size === "lg") textStyles += " text-lg";

    if (disabled || isLoading) {
      textStyles += ` text-[${themeColors.disabledText}]`;
    } else {
      if (variant === "primary")
        textStyles += ` text-[${themeColors.primaryText}]`;
      else if (variant === "secondary")
        textStyles += ` text-[${themeColors.secondaryText}]`;
      else if (variant === "outline")
        textStyles += ` text-[${themeColors.outlineText}]`;
      else if (variant === "ghost")
        textStyles += ` text-[${themeColors.ghostText}]`;
      else if (variant === "danger")
        textStyles += ` text-[${themeColors.dangerText}]`;
    }
    return textStyles;
  };

  const getIconColor = () => {
    if (disabled || isLoading) return themeColors.disabledText;
    if (variant === "primary") return themeColors.primaryText;
    if (variant === "secondary") return themeColors.secondaryText;
    if (variant === "danger") return themeColors.dangerText;
    if (variant === "outline") return themeColors.outlineText;
    if (variant === "ghost") return themeColors.ghostText;
    return themeColors.iconDefault;
  };

  return (
    <TouchableOpacity
      className={twMerge(getButtonStyles(), className)}
      disabled={disabled || isLoading}
      activeOpacity={activeOpacity}
      style={[
        styles.buttonBase,
        variant === "primary" && !(disabled || isLoading)
          ? styles.primaryShadow
          : {},
        disabled || isLoading ? styles.disabledLook : {},
      ]}
      {...props}
    >
      {}
      {isLoading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <>
          {leftIcon && (
            <Feather
              name={leftIcon}
              size={iconSize}
              color={getIconColor()}
              style={{ marginRight: children ? 8 : 0 }}
            />
          )}
          {}
          {typeof children === "string" ? (
            <Text className={getTextStyles()}>{children}</Text>
          ) : (
            children
          )}
          {rightIcon && (
            <Feather
              name={rightIcon}
              size={iconSize}
              color={getIconColor()}
              style={{ marginLeft: children ? 8 : 0 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {},
  primaryShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  disabledLook: {},
});

export default Button;
