// lib/auth.ts
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "./types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginUser: (userData: User) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let storedUser: User | null = null;
      try {
        const userJson = await AsyncStorage.getItem("userData");
        if (userJson) {
          storedUser = JSON.parse(userJson) as User;
        }
      } catch (e) {
        console.error("AuthProvider: Failed to load user from storage", e);
      }
      setUser(storedUser);
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      isLoading,
      loginUser: async (userData: User) => {
        setUser(userData);
        try {
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
        } catch (e) {
          console.error("AuthProvider: Failed to save user to storage", e);
        }
      },
      logoutUser: async () => {
        setUser(null);
        try {
          await AsyncStorage.removeItem("userData");
        } catch (e) {
          console.error("AuthProvider: Failed to remove user from storage", e);
        }
      },
    }),
    [user, isLoading]
  );

  // --- CORRECTED RETURN STATEMENT ---
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
  // --- END OF CORRECTION ---
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Make sure your component is a descendant of AuthProvider."
    );
  }
  return context;
};
