"use client";

import { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AuthPage from "./AuthPage";
import StoreProvider, { useAppSelector, useAppDispatch } from "@/app/redux";
import { useRefreshMutation } from "@/state/api";
import { setCredentials } from "@/state/authSlice";
import { setIsSidebarCollapsed } from "@/state";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    let wasMobile = window.innerWidth < 768;

    if (wasMobile) {
      dispatch(setIsSidebarCollapsed(true));
    } else {
      dispatch(setIsSidebarCollapsed(false));
    }

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile !== wasMobile) {
        wasMobile = isMobile;
        dispatch(setIsSidebarCollapsed(isMobile));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);
  const token = useAppSelector((state) => state.auth.token);
  const [isCheckingAuth, setIsCheckingAuth] = useState(!token);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await refresh().unwrap();
        dispatch(setCredentials({ token: result.token, user: result.user }));
      } catch {
        // Ignore error as user is not authenticated
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (!token) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0b0f19]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return <AuthPage />;
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Backdrop overlay for mobile screens when sidebar is open */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden"
          onClick={() => dispatch(setIsSidebarCollapsed(true))}
        />
      )}

      <main
        className={`flex w-full flex-col main-bg-gradient ${isSidebarCollapsed ? "" : "md:pl-64"}`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
