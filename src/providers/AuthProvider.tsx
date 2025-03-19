"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { User } from "@/app/types";
import { api } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAllowed: (requiredRole?: "admin" | "manager" | "viewer") => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  isAllowed: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await api.auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirection logic
  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/auth/login") {
        router.push("/auth/login");
      }

      if (user && pathname === "/auth/login") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const loggedInUser = await api.auth.login(username, password);

      if (loggedInUser && loggedInUser.token) {
        localStorage.setItem("token", loggedInUser.token);
        setUser(loggedInUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);

      router.push("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAllowed = (
    requiredRole?: "admin" | "manager" | "viewer"
  ): boolean => {
    if (!user) return false;

    if (!requiredRole) return true;

    switch (user.role) {
      case "admin":
        return true;
      case "manager":
        return requiredRole !== "admin";
      case "viewer":
        return requiredRole === "viewer";
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAllowed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
