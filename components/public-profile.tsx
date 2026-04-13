"use client";

import Link from "next/link";
import { ExternalLink, Eye, MousePointerClick } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { defaultProfile, themePresets } from "@/lib/mock-data";
import { loadProfile, saveProfile } from "@/lib/storage";
import { LinkProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

function fontClass(font: "grotesk" | "serif" | "mono") {
  if (font === "serif") {
    return "font-serif";
  }
  if (font === "mono") {
    return "font-mono";
  }
  return "font-sans";
}

export function PublicProfile({ username }: { username: string }) {
  const [profile, setProfile] = useState<LinkProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [linkHovers, setLinkHovers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = loadProfile();
    const normalized = username.toLowerCase();

    if (stored.username.toLowerCase() !== normalized || !stored.published) {
      setMounted(true);
      setProfile(null);
      return;
    }

    const withView = { ...stored, views: stored.views + 1 };
    saveProfile(withView);
    setProfile(withView);
    setMounted(true);
  }, [username]);

  const theme = useMemo(() => {
    const selected = themePresets.find((item) => item.id === profile?.themeId);
    return selected ?? themePresets[0];
  }, [profile?.themeId]);

  if (!mounted) {
    return (
      <div className="grain-overlay" />
    );
  }

  if (!profile) {
    return (
      <>
        <div className="grain-overlay" />
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center animate-fade-in-up">
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(25_10%_45%/0.1)]">
              <svg className="h-10 w-10 text-[hsl(25_10%_45%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </div>
            <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest">
              Not found
            </Badge>
            <h1 className="mb-4 font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">
              This page is not available
            </h1>
            <p className="mx-auto mb-8 max-w-sm text-[hsl(25_10%_45%)]">
              The username <span className="font-medium text-[hsl(25_25%_10%)]">@{username}</span> has not been published yet.
            </p>
            <Link href="/studio">
              <Button className="rounded-full bg-[hsl(25_25%_10%)] px-6 py-2.5 text-[hsl(30_15%_97%)] hover:bg-[hsl(25_25%_15%)]">
                Go to studio
              </Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="grain-overlay" />
      <main
        className={cn("min-h-screen px-4 py-12", fontClass(theme.font))}
        style={{ backgroundColor: theme.background }}
      >
        <div className="mx-auto max-w-md">
          <div className="relative">
            <div 
              className="absolute -left-4 -top-4 h-24 w-24 rounded-full opacity-20 blur-2xl"
              style={{ backgroundColor: theme.accent }}
            />
            <div 
              className="absolute -right-4 bottom-0 h-32 w-32 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: theme.accent }}
            />
          </div>

          <div className="relative">
            <div 
              className="rounded-[2.5rem] border p-8 shadow-xl"
              style={{ 
                backgroundColor: theme.card,
                borderColor: theme.accent + '20'
              }}
            >
              <div className="space-y-10">
                <div className="space-y-6 text-center animate-fade-in-up">
                  <div 
                    className="group relative mx-auto"
                    style={{ 
                      color: theme.accent
                    }}
                  >
                    <div 
                      className="mx-auto flex h-28 w-28 items-center justify-center rounded-full text-4xl font-semibold transition-transform duration-500 group-hover:scale-105"
                      style={{ 
                        backgroundColor: theme.accent, 
                        color: theme.card 
                      }}
                    >
                      {profile.avatar || "LN"}
                    </div>
                    <div 
                      className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full opacity-60"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>

                  <div className="space-y-3">
                    <p 
                      className="text-xs uppercase tracking-[0.32em]"
                      style={{ color: theme.muted }}
                    >
                      @{profile.username}
                    </p>
                    <h1 
                      className="font-serif text-4xl font-medium leading-tight"
                      style={{ color: theme.text }}
                    >
                      {profile.displayName}
                    </h1>
                    <p 
                      className="text-base leading-relaxed"
                      style={{ color: theme.muted }}
                    >
                      {profile.bio}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {profile.links.map((linkItem, index) => (
                    <a
                      key={linkItem.id}
                      href={linkItem.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        const nextProfile = {
                          ...profile,
                          links: profile.links.map((current) =>
                            current.id === linkItem.id
                              ? { ...current, clicks: current.clicks + 1 }
                              : current
                          )
                        };
                        setProfile(nextProfile);
                        saveProfile(nextProfile);
                      }}
                      onMouseEnter={() => setLinkHovers(prev => ({ ...prev, [linkItem.id]: true }))}
                      onMouseLeave={() => setLinkHovers(prev => ({ ...prev, [linkItem.id]: false }))}
                      className="group relative flex items-center justify-between overflow-hidden rounded-2xl px-6 py-5 text-base font-medium transition-all duration-500 animate-fade-in-up"
                      style={{ 
                        backgroundColor: theme.background, 
                        color: theme.text,
                        animationDelay: `${0.1 + index * 0.1}s`,
                        transform: linkHovers[linkItem.id] ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      <div 
                        className="absolute inset-0 opacity-0 transition-opacity duration-500"
                        style={{ 
                          background: `linear-gradient(135deg, ${theme.accent}15, transparent)`
                        }}
                      />
                      <span className="relative z-10">{linkItem.title || "Untitled link"}</span>
                      <ExternalLink 
                        className={cn(
                          "relative z-10 h-5 w-5 transition-all duration-500",
                          linkHovers[linkItem.id] ? "translate-x-1 opacity-100" : "-translate-x-2 opacity-0"
                        )}
                      />
                    </a>
                  ))}
                </div>

                <div 
                  className="grid grid-cols-2 gap-4 rounded-2xl p-5 animate-fade-in-up"
                  style={{ 
                    backgroundColor: theme.background,
                    animationDelay: `${0.1 + profile.links.length * 0.1}s`
                  }}
                >
                  <div 
                    className="rounded-xl p-4 text-center transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: theme.card }}
                  >
                    <div 
                      className="mb-2 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                      style={{ color: theme.muted }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Visits</span>
                    </div>
                    <div 
                      className="font-serif text-3xl font-medium"
                      style={{ color: theme.text }}
                    >
                      {profile.views}
                    </div>
                  </div>
                  <div 
                    className="rounded-xl p-4 text-center transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: theme.card }}
                  >
                    <div 
                      className="mb-2 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                      style={{ color: theme.muted }}
                    >
                      <MousePointerClick className="h-3.5 w-3.5" />
                      <span>Clicks</span>
                    </div>
                    <div 
                      className="font-serif text-3xl font-medium"
                      style={{ color: theme.text }}
                    >
                      {profile.links.reduce((sum, item) => sum + item.clicks, 0)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  <Link 
                    href="/"
                    className="inline-flex items-center gap-2 text-xs transition-opacity hover:opacity-70"
                    style={{ color: theme.muted }}
                  >
                    <span className="font-serif italic">Powered by LinkNest</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
