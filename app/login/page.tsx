"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase is not configured. Please set up your Supabase project.");
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        router.push("/studio");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/studio");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem("linknest_auth", "true");
    router.push("/studio");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[hsl(30_15%_97%)] px-4">
      <div className="grain-overlay" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[hsl(24_85%_50%/0.06)] blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[hsl(35_20%_88%/0.5)] blur-[100px]" />
      </div>

      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(24_85%_42%)] shadow-lg shadow-[hsl(24_85%_50%/0.2)]">
            <span className="font-serif text-2xl font-medium italic text-[hsl(30_15%_97%)]">L</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-[hsl(25_10%_45%)]">
            {isSignUp ? "Sign up to start creating your page" : "Sign in to your LinkNest studio"}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-[hsl(25_10%_10%/0.08)]">
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[hsl(25_25%_10%)]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[hsl(25_25%_10%)]">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(25_10%_45%)] transition-colors hover:text-[hsl(25_25%_10%)]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="group w-full rounded-xl bg-[hsl(24_85%_42%)] py-6 text-base font-medium hover:bg-[hsl(24_85%_35%)] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>{isSignUp ? "Create account" : "Sign in"}</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-[hsl(24_85%_42%)] hover:underline"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(25_10%_45%/0.1)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-[hsl(25_10%_45%)]">or</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full rounded-xl border-2"
          >
            Try Demo Mode
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-[hsl(25_10%_45%)]">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}