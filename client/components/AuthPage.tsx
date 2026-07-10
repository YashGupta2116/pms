"use client";

import React, { useState } from "react";
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useLoginMutation, useRegisterMutation } from "@/state/api";
import { useAppDispatch } from "@/app/redux";
import { setCredentials } from "@/state/authSlice";

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  
  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error/Success state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mutations
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const handleTabChange = (showSignIn: boolean) => {
    setIsSignIn(showSignIn);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isSignIn) {
      if (!email || !password) {
        setError("All fields are required.");
        return;
      }
      try {
        const result = await login({
          usernameOrEmail: email,
          password,
        }).unwrap();
        
        setSuccess("Signed in successfully!");
        // Small delay to show success animation
        setTimeout(() => {
          dispatch(setCredentials({ token: result.token, user: result.user }));
        }, 800);
      } catch (err: any) {
        setError(err?.data?.message || "Invalid email/username or password.");
      }
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setError("All fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      try {
        const result = await register({
          username,
          email,
          password,
        }).unwrap();

        setSuccess("Account created successfully!");
        setTimeout(() => {
          dispatch(setCredentials({ token: result.token, user: result.user }));
        }, 800);
      } catch (err: any) {
        setError(err?.data?.message || "Registration failed. Try again.");
      }
    }
  };

  const isLoading = isLoginLoading || isRegisterLoading;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-[#0b0f19]">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/10"></div>

      {/* Main Glass Container */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-neutral-800/40 dark:bg-neutral-900/60 sm:p-10">
        
        {/* Logo/Branding */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-3xl font-black tracking-wider text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
            PROMANAGE
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            {isSignIn ? "Welcome back! Please sign in to your account." : "Create your account and start managing projects."}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="mb-6 flex rounded-lg bg-gray-100 p-1 dark:bg-neutral-800">
          <button
            onClick={() => handleTabChange(true)}
            className={`flex-1 rounded-md py-2.5 text-center text-sm font-semibold transition-all duration-250 ${
              isSignIn
                ? "bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabChange(false)}
            className={`flex-1 rounded-md py-2.5 text-center text-sm font-semibold transition-all duration-250 ${
              !isSignIn
                ? "bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Messages */}
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-red-50 p-3.5 text-sm font-medium text-red-700 dark:bg-red-950/20 dark:text-red-405">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-emerald-50 p-3.5 text-sm font-medium text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-405">
            <CheckCircle2 className="h-5 w-5 shrink-0 animate-bounce" />
            <span>{success}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4.5">
          {!isSignIn && (
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 pl-11 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
              Email / Username
            </label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
              <input
                type={isSignIn ? "text" : "email"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isSignIn ? "john@example.com or johndoe" : "john@example.com"}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 pl-11 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 pl-11 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-white"
              />
            </div>
          </div>

          {!isSignIn && (
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 p-3 pl-11 pr-4 text-sm placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950/40 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all duration-200 cursor-pointer dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>{isSignIn ? "Sign In" : "Sign Up"}</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Terms/Privacy */}
        <p className="mt-6 text-center text-[10px] text-gray-400 dark:text-neutral-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
}
