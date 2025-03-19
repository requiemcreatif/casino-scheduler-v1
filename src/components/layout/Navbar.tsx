"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  HomeIcon,
  UserGroupIcon,
  Squares2X2Icon,
  CalendarIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
} from "@heroicons/react/24/outline";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const Navbar: React.FC = () => {
  const { user, logout, isAllowed } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
      allowedRole: "viewer",
    },
    {
      name: "Game Presenters",
      href: "/presenters",
      icon: UserGroupIcon,
      allowedRole: "viewer",
    },
    {
      name: "Tables",
      href: "/tables",
      icon: Squares2X2Icon,
      allowedRole: "viewer",
    },
    {
      name: "Schedules",
      href: "/schedules",
      icon: CalendarIcon,
      allowedRole: "viewer",
    },
  ].filter((item) => isAllowed(item.allowedRole as any));

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-800 dark:from-gray-800 dark:to-gray-900 sticky top-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl transition hover:text-indigo-200 dark:hover:text-gray-300">
                Casino Scheduler
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive(item.href)
                        ? "bg-indigo-800 text-white shadow-sm dark:bg-gray-700"
                        : "text-indigo-100 hover:bg-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-200 ease-in-out`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <ThemeToggle />
              {user && (
                <div className="flex items-center">
                  <span className="text-white mr-4 px-3 py-1 bg-indigo-600 bg-opacity-50 dark:bg-gray-700 rounded-full text-sm">
                    {user.username} ({user.role})
                  </span>
                  <Link
                    href="/logout"
                    className="bg-indigo-800 p-2 rounded-full text-indigo-100 hover:text-white flex items-center transition-all hover:bg-indigo-900 dark:bg-gray-700 dark:hover:bg-gray-600"
                    aria-label="Logout"
                  >
                    <LogoutIcon className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-indigo-800 inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
              aria-label="Main menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-indigo-600 dark:border-gray-700">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                isActive(item.href)
                  ? "bg-indigo-800 text-white dark:bg-gray-700"
                  : "text-indigo-100 hover:bg-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700"
              } px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ))}
          <div className="flex items-center px-3 py-2">
            <span className="text-indigo-100 dark:text-gray-300 mr-2">
              Theme
            </span>
            <ThemeToggle />
          </div>
          {user && (
            <div className="border-t border-indigo-600 dark:border-gray-700 pt-2 mt-2">
              <div className="px-3 py-2 text-indigo-200 dark:text-gray-300 text-sm font-medium">
                Signed in as {user.username} ({user.role})
              </div>
              <Link
                href="/logout"
                className="w-full text-left text-indigo-100 hover:bg-indigo-600 px-3 py-2 rounded-md text-base font-medium flex items-center transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogoutIcon className="h-5 w-5 mr-2" />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
