"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GoodbyeMessageProps {
  username?: string;
  redirectPath?: string;
  redirectDelay?: number;
}

export function GoodbyeMessage({
  username = "",
  redirectPath = "/auth/login",
  redirectDelay = 10000,
}: GoodbyeMessageProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(Math.floor(redirectDelay / 1000));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted for client-side rendering
    setMounted(true);

    // Set up redirect timer
    const redirectTimer = setTimeout(() => {
      router.push(redirectPath);
    }, redirectDelay);

    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clean up timers on unmount
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [redirectPath, redirectDelay, router]);

  const personalizedMessage = username ? `Goodbye, ${username}!` : "Goodbye!";

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden p-8">
          <div className="mx-auto w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6"></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {personalizedMessage}
          </div>
          <div className="text-gray-600 dark:text-gray-300 mb-6">
            You have been successfully logged out.
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to login page in {countdown} seconds...
          </div>
          <button
            onClick={() => router.push(redirectPath)}
            className="mt-6 w-full bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 text-center">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
              {personalizedMessage}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-gray-600 dark:text-gray-300 mb-6"
            >
              You have been successfully logged out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Redirecting to login page in {countdown} seconds...
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(redirectPath)}
              className="mt-6 w-full bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Login Again
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
