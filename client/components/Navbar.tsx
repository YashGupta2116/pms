import React from "react";
import { Menu, Moon, Search, Settings, Sun, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useLogoutMutation } from "@/state/api";
import { clearCredentials } from "@/state/authSlice";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("Failed to logout:", err);
    }
    dispatch(clearCredentials());
  };

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

      {/* Icons & Profile */}
      <div className="flex items-center gap-4">
        {/* Toggle Dark Mode */}
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

        {/* Settings */}
        <Link
          href="/settings"
          className="h-min w-min rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-dark-secondary"
        >
          <Settings className="h-5 w-5 cursor-pointer" />
        </Link>

        {/* Separator line */}
        <span className="self-stretch w-[1px] bg-gray-200 dark:bg-stroke-dark/40 my-1.5" />

        {/* User Profile Info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              {user.profilePictureUrl ? (
                <img
                  src={`/${user.profilePictureUrl}`}
                  alt={user?.username?.charAt(0).toUpperCase()}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                user.username && (
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {user.username.charAt(0).toUpperCase() || <User className="h-3 w-3" />}
                  </div>
                )
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">
                {user.username}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-neutral-500 leading-none mt-1">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
