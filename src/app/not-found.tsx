"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/providers/ThemeProvider";
import { motion } from "framer-motion";

const DiceDot = ({
  visible = true,
  theme,
}: {
  visible?: boolean;
  theme: string;
}) => (
  <div
    className={`w-3 h-3 ${
      visible
        ? `rounded-full ${theme === "dark" ? "bg-red-500" : "bg-red-600"}`
        : ""
    }`}
  />
);

const DiceComponent = ({
  position,
  rotation,
  animationProps,
  transitionProps,
  dotPattern,
  theme,
}: {
  position: string;
  rotation: string;
  animationProps: any;
  transitionProps: any;
  dotPattern: boolean[];
  theme: string;
}) => (
  <motion.div
    animate={animationProps}
    transition={transitionProps}
    className={`absolute w-24 h-24 rounded-xl shadow-lg 
      ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      } 
      border-2 ${position} z-10 flex items-center justify-center transform ${rotation}`}
  >
    <div className="grid grid-cols-3 grid-rows-3 gap-1 p-2">
      {dotPattern.map((visible, index) => (
        <DiceDot key={`dot-${index}`} visible={visible} theme={theme} />
      ))}
    </div>
  </motion.div>
);

const ActionButton = ({
  href,
  primary = false,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className={`inline-flex items-center px-6 py-3 border ${
      primary
        ? "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
    } text-base font-medium rounded-md transition-colors duration-200`}
  >
    {children}
  </Link>
);

export default function NotFound() {
  const { theme } = useTheme();

  // This is to define the dice dot patterns
  const firstDicePattern = [
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
  ];
  const secondDicePattern = [
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    false,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative w-56 h-56">
            {/* First Dice */}
            <DiceComponent
              position="left-4 top-10"
              rotation="-rotate-12"
              animationProps={{ rotate: [0, 10, -10, 10, 0], y: [0, -10, 0] }}
              transitionProps={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              dotPattern={firstDicePattern}
              theme={theme}
            />

            {/* Second Dice */}
            <DiceComponent
              position="right-4 top-16"
              rotation="rotate-12"
              animationProps={{ rotate: [0, -8, 8, -8, 0], y: [0, -5, 0] }}
              transitionProps={{
                duration: 3,
                delay: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              dotPattern={secondDicePattern}
              theme={theme}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 mb-2">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like the odds weren't in your favor. The page you're looking
            for doesn't exist or has been moved.
          </p>

          <div className="flex justify-center space-x-4">
            <ActionButton href="/dashboard" primary>
              Back to Dashboard
            </ActionButton>
            <ActionButton href="/">Go Home</ActionButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
