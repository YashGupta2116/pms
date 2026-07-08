import React from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import Image from "next/image";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="flex items-center justify-between border-b border-gray-200/60 bg-white/95 px-4 py-3 dark:border-stroke-dark/40 dark:bg-dark-bg/95 backdrop-blur-sm sticky top-0 z-50">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-dark-secondary transition-colors"
          >
            <Menu className="h-5 w-5 dark:text-white" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-gray-400 dark:text-gray-300" />
          <input
            className="w-full rounded-md border border-gray-200 bg-gray-50 p-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-stroke-dark dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-dark-secondary"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 cursor-pointer text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 cursor-pointer text-gray-600" />
          )}
        </button>
        <Link
          href="/settings"
          className="h-min w-min rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-dark-secondary"
        >
          <Settings className="h-5 w-5 cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
