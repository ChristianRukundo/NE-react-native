"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import {
  authAPI,
  type LoginRequest,
  type RegisterRequest,
  type VerifyEmailRequest,
  type ResetPasswordRequest,
  type UserResponse,
} from "../lib/api";
import { router } from "expo-router";
import { useToast } from "../components/ui/Toast";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<any>;
  register: (data: RegisterRequest) => Promise<any>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (data: ResetPasswordRequest) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch current user data
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      try {
        const token = await SecureStore.getItemAsync("auth_token");
        if (!token) return null;

        const response = await authAPI.getCurrentUser();
        return response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
        await SecureStore.deleteItemAsync("auth_token");
        return null;
      }
    },
    enabled: isAuthenticated,
    retry: 1, // Only retry once to avoid infinite loops
    retryDelay: 1000, // Wait 1 second before retrying
  });

  // Check if token exists on app load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("auth_token");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error checking token:", error);
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);

  // Login function
  const login = async (data: LoginRequest) => {
    try {
      const response = await authAPI.login(data);
      const { token, user } = response.data;
      await SecureStore.setItemAsync("auth_token", token);
      setIsAuthenticated(true);
      queryClient.setQueryData(["user", "me"], user);
      router.replace("/(app)");
      return response;
    } catch (error: any) {
      console.error("Login error:", error);
      showToast(error.message || "Login failed. Please try again.", "error");
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterRequest) => {
    try {
      const response = await authAPI.register(data);
      return response;
    } catch (error: any) {
      console.error("Registration error:", error);
      showToast(
        error.message || "Registration failed. Please try again.",
        "error"
      );
      throw error;
    }
  };

  // Verify email function
  const verifyEmail = async (data: VerifyEmailRequest) => {
    try {
      const response = await authAPI.verifyEmail(data);
      return response;
    } catch (error: any) {
      console.error("Verification error:", error);
      showToast(
        error.message || "Verification failed. Please try again.",
        "error"
      );
      throw error;
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (error: any) {
      console.error("Forgot password error:", error);
      showToast(
        error.message || "Failed to send reset code. Please try again.",
        "error"
      );
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (data: ResetPasswordRequest) => {
    try {
      const response = await authAPI.resetPassword(data);
      return response;
    } catch (error: any) {
      console.error("Reset password error:", error);
      showToast(
        error.message || "Failed to reset password. Please try again.",
        "error"
      );
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      setIsAuthenticated(false);
      queryClient.clear();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Failed to logout. Please try again.", "error");
    }
  };

  const value = {
    user: user || null,
    isLoading,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
