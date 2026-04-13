"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem("linknest_auth", "true");
      router.push("/studio");
    }, 800);
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
          <h1 className="font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">Welcome back</h1>
          <p className="mt-2 text-sm text-[hsl(25_10%_45%)]">Sign in to your LinkNest studio</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-[hsl(25_10%_10%/0.08)]">
          <form onSubmit={handleLogin} className="space-y-5">
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
                  <span>Sign in</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[hsl(25_10%_45%)]">
            <span>Any email and password will work for demo</span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[hsl(25_10%_45%)]">
          New to LinkNest?{" "}
          <a href="/studio" className="font-medium text-[hsl(24_85%_42%)] hover:underline">
            Start creating
          </a>
        </p>
      </div>
    </div>
  );
}
