"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const insets = useSafeAreaInsets();

  const showToast = useCallback(
    (msg: string, type: ToastType = "info") => {
      setMessage(msg);
      setToastType(type);
      setVisible(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after 3 seconds
      setTimeout(() => {
        hideToast();
      }, 3000);
    },
    [fadeAnim]
  );

  const hideToast = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  }, [fadeAnim]);

  const getToastColor = () => {
    switch (toastType) {
      case "success":
        return "#10b981"; // green
      case "error":
        return "#ef4444"; // red
      case "warning":
        return "#f59e0b"; // amber
      case "info":
      default:
        return "#3b82f6"; // blue
    }
  };

  const getToastIcon = () => {
    switch (toastType) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "alert-triangle";
      case "info":
      default:
        return "info";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
              backgroundColor: getToastColor(),
              top: Platform.OS === "ios" ? insets.top + 10 : insets.top + 20,
              left: 20 + insets.left,
              right: 20 + insets.right,
            },
          ]}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          <View style={styles.content}>
            <Feather name={getToastIcon()} size={20} color="white" />
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity
            onPress={hideToast}
            style={styles.closeButton}
            accessibilityLabel="Close notification"
            accessibilityRole="button"
          >
            <Feather name="x" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  message: {
    color: "white",
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    fontFamily: "Inter-Medium",
  },
  closeButton: {
    marginLeft: 10,
    padding: 4,
  },
});
