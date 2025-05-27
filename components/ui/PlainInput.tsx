// components/ui/PlainInput.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
// import { Feather } from "@expo/vector-icons"; // Remove Feather
import { Ionicons } from "@expo/vector-icons"; // Use Ionicons instead

interface PlainInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap; // Changed to Ionicons.glyphMap
  iconColor?: string;
  iconSize?: number;
  // Note: secureTextEntry is already part of TextInputProps
}

const PlainInput: React.FC<PlainInputProps> = ({
  label,
  error,
  leftIcon,
  secureTextEntry, // This prop is from TextInputProps
  iconColor = "#9CA3AF",
  iconSize = 18, // You might want to adjust default Ionicons size (e.g., to 20)
  editable = true,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry); // Initialize based on secureTextEntry
  const [isFocused, setIsFocused] = useState(false);

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

  const currentSecureTextEntry = secureTextEntry && !isPasswordVisible;
  const hasRightIconAction = secureTextEntry; // Determine if the eye icon should be shown

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          error
            ? styles.errorBorder
            : isFocused
            ? styles.focusedBorder
            : styles.defaultBorder,
          !editable && styles.disabledBackground,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons // Changed from Feather to Ionicons
              name={leftIcon}
              size={iconSize}
              color={isFocused && !error ? "#FF6F00" : iconColor}
            />
          </View>
        )}

        <TextInput
          style={[
            styles.textInput,
            leftIcon ? {} : { paddingLeft: 16 },
            hasRightIconAction ? { paddingRight: 48 } : { paddingRight: 16 },
            !editable ? styles.disabledText : styles.inputText,
          ]}
          secureTextEntry={currentSecureTextEntry} // Use the state-managed value
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#9CA3AF"
          editable={editable}
          {...props}
        />

        {/* Show eye icon only if secureTextEntry prop was initially true */}
        {hasRightIconAction && editable && (
          <TouchableOpacity
            style={styles.rightIconToggle}
            onPress={togglePasswordVisibility}
            accessibilityLabel={
              isPasswordVisible ? "Hide password" : "Show password"
            }
          >
            <Ionicons // Changed from Feather to Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} // Ionicons equivalents
              size={iconSize}
              color={isFocused && !error ? "#FF6F00" : iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons // Changed from Feather to Ionicons
            name="alert-circle-outline" // Ionicons equivalent
            size={14} // Keep size or adjust for Ionicons
            color="#EF4444"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

// Styles remain exactly as you provided
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    // fontFamily: 'DMSans-Medium', // Add if DMSans-Medium is loaded and desired
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "white",
    overflow: "hidden",
    minHeight: 50,
  },
  defaultBorder: {
    borderColor: "#D1D5DB",
  },
  focusedBorder: {
    borderColor: "#FF6F00",
    shadowColor: "#FF6F00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  errorBorder: {
    borderColor: "#EF4444",
  },
  disabledBackground: {
    backgroundColor: "#F9FAFB",
  },
  leftIconContainer: {
    paddingLeft: 14,
    paddingRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: "#1F2937",
    // fontFamily: 'DMSans-Regular', // Add if DMSans-Regular is loaded and desired
  },
  disabledText: {
    color: "#9CA3AF",
  },
  inputText: {
    color: "#1F2937",
  },
  rightIconToggle: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    // fontFamily: 'DMSans-Regular', // Add if DMSans-Regular is loaded and desired
  },
});

export default PlainInput;
