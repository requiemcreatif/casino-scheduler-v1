"use client";

import React, { useEffect, useState } from "react";
import { GoodbyeMessage } from "@/components/auth/GoodbyeMessage";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

export default function LogoutPage() {
  const { user, logout: authLogout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    async function performLogout() {
      if (user) {
        setUsername(user.username || "");
      }

      setIsLoggingOut(true);

      try {
        await api.auth.logout();

        authLogout();
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        setIsLoggingOut(false);
      }
    }

    performLogout();
  }, [user, authLogout]);

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 dark:border-indigo-400 rounded-full border-t-transparent dark:border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Logging out...</p>
        </div>
      </div>
    );
  }

  const loginPath = "/auth/login";

  return (
    <GoodbyeMessage
      username={username}
      redirectPath={loginPath}
      redirectDelay={10000}
    />
  );
}
