"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  BarChart3,
  CheckCircle2,
  Eye,
  ExternalLink,
  Link2,
  MoveDown,
  MoveUp,
  Paintbrush,
  Plus,
  Radio,
  Settings,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  Layers,
  Home,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  MousePointerClick,
  Users,
  Clock,
  Menu,
  X,
  LogOut,
  Copy
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultProfile, themePresets } from "@/lib/mock-data";
import { loadProfile, saveProfile } from "@/lib/storage";
import { LinkItem, LinkProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

function createBlankLink(): LinkItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    url: "",
    clicks: 0
  };
}

function swapLinks(links: LinkItem[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= links.length) {
    return links;
  }
  const clone = [...links];
  [clone[index], clone[nextIndex]] = [clone[nextIndex], clone[index]];
  return clone;
}

function fontClass(font: "grotesk" | "serif" | "mono") {
  if (font === "serif") return "font-serif";
  if (font === "mono") return "font-mono";
  return "font-sans";
}

type NavSection = "overview" | "links" | "theme" | "profile" | "settings";
type TimeRange = "7d" | "30d" | "90d";

const mockAnalytics = {
  views: [
    { date: "Apr 6", value: 12 },
    { date: "Apr 7", value: 18 },
    { date: "Apr 8", value: 15 },
    { date: "Apr 9", value: 24 },
    { date: "Apr 10", value: 31 },
    { date: "Apr 11", value: 28 },
    { date: "Apr 12", value: 42 },
    { date: "Apr 13", value: 38 }
  ],
  clicks: [
    { label: "Book a Brand Session", value: 86, percentage: 30 },
    { label: "Watch My Latest Tutorial", value: 139, percentage: 49 },
    { label: "Join My Weekly Newsletter", value: 57, percentage: 20 }
  ],
  devices: [
    { label: "Mobile", value: 62 },
    { label: "Desktop", value: 28 },
    { label: "Tablet", value: 10 }
  ],
  referrers: [
    { label: "Instagram", value: 45 },
    { label: "Twitter/X", value: 28 },
    { label: "TikTok", value: 15 },
    { label: "Direct", value: 12 }
  ],
  topCountries: [
    { label: "United States", value: 42, flag: "🇺🇸" },
    { label: "Nigeria", value: 18, flag: "🇳🇬" },
    { label: "United Kingdom", value: 12, flag: "🇬🇧" },
    { label: "Canada", value: 8, flag: "🇨🇦" },
    { label: "Germany", value: 5, flag: "🇩🇪" }
  ]
};

export function StudioShell() {
  const router = useRouter();
  const [profile, setProfile] = useState<LinkProfile>(defaultProfile);
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem("linknest_auth");
    if (!auth) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);
    const stored = loadProfile();
    setProfile(stored);
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    saveProfile(profile);
  }, [profile, ready]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        const mobileToggle = document.getElementById("mobile-menu-toggle");
        if (mobileToggle && !mobileToggle.contains(event.target as Node)) {
          setMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("linknest_auth");
    router.push("/login");
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${profile.username || "username"}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const theme = useMemo(
    () => themePresets.find((item) => item.id === profile.themeId) ?? themePresets[0],
    [profile.themeId]
  );

  const totalClicks = profile.links.reduce((sum, link) => sum + link.clicks, 0);
  const publicPath = `/${profile.username || "username"}`;

  const updateLink = (id: string, key: keyof LinkItem, value: string | number) => {
    setProfile((current) => ({
      ...current,
      links: current.links.map((link) =>
        link.id === id ? { ...link, [key]: value } : link
      )
    }));
  };

  const removeLink = (id: string) => {
    setProfile((current) => ({
      ...current,
      links: current.links.filter((link) => link.id !== id)
    }));
  };

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(30_15%_97%)]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[hsl(24_85%_50%/0.2)] border-t-[hsl(24_85%_50%)]"></div>
          <p className="text-sm text-[hsl(25_10%_45%)]">Loading studio...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "overview" as NavSection, label: "Overview", icon: Home },
    { id: "links" as NavSection, label: "Links", icon: Layers },
    { id: "theme" as NavSection, label: "Theme", icon: Paintbrush },
    { id: "profile" as NavSection, label: "Profile", icon: User },
    { id: "settings" as NavSection, label: "Settings", icon: Settings }
  ];

  const maxViews = Math.max(...mockAnalytics.views.map(v => v.value));
  const maxClicks = Math.max(...mockAnalytics.clicks.map(v => v.value));

  return (
    <>
      <div className="grain-overlay" />
      <div className="flex min-h-screen bg-[hsl(30_15%_97%)]">
        <aside
          ref={sidebarRef}
          className={cn(
            "fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r border-[hsl(25_10%_45%/0.06)] bg-white transition-transform duration-300 lg:translate-x-0",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-[hsl(25_10%_45%/0.06)] px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(24_85%_42%)] text-[hsl(30_15%_97%)]">
                <span className="font-serif text-lg font-medium italic">L</span>
              </div>
              <span className="font-serif text-xl font-medium">LinkNest</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden rounded-lg p-2 text-[hsl(25_10%_45%)] hover:bg-[hsl(25_10%_45%/0.05)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[hsl(24_85%_50%/0.1)] text-[hsl(24_85%_42%)]"
                      : "text-[hsl(25_10%_45%)] hover:bg-[hsl(25_10%_45%/0.04)] hover:text-[hsl(25_25%_10%)]"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-[hsl(24_85%_42%)]")} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[hsl(24_85%_42%)]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-[hsl(25_10%_45%/0.06)] p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[hsl(25_10%_45%)] transition-all hover:bg-red-50 hover:text-red-500"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 min-h-screen lg:ml-[260px]">
          <header className="sticky top-0 z-30 border-b border-[hsl(25_10%_45%/0.06)] bg-[hsl(30_15%_97%)]/80 backdrop-blur-xl">
            <div className="flex h-14 sm:h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  id="mobile-menu-toggle"
                  onClick={() => setMobileMenuOpen(true)}
                  className="rounded-lg p-2 text-[hsl(25_10%_45%)] hover:bg-[hsl(25_10%_45%/0.05)] lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="font-serif text-xl sm:text-2xl font-medium capitalize text-[hsl(25_25%_10%)]">
                  {activeSection === "overview" ? "Dashboard" : activeSection}
                </h1>
                {profile.published && (
                  <div className="hidden sm:flex items-center gap-2 rounded-full bg-[hsl(150_60%_45%/0.12)] px-3 py-1">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(150_60%_40%)]" />
                    <span className="text-xs font-medium text-[hsl(150_60%_35%)]">Live</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link href={publicPath as any} target="_blank" className="group flex items-center gap-2 rounded-xl border border-[hsl(25_10%_45%/0.1)] bg-white px-2 sm:px-3 py-2 transition-all hover:border-[hsl(24_85%_50%/0.3)] hover:shadow-sm">
                  <span className="hidden sm:inline text-sm text-[hsl(25_10%_45%)]">{publicPath}</span>
                  <span className="sm:hidden text-xs text-[hsl(25_10%_45%)]">/page</span>
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <ExternalLink className="h-4 w-4 text-[hsl(25_10%_45%)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </Link>
                <button
                  onClick={handleCopyLink}
                  className="rounded-xl border border-[hsl(25_10%_45%/0.1)] bg-white p-2 text-[hsl(25_10%_45%)] transition-all hover:border-[hsl(24_85%_50%/0.3)] hover:shadow-sm sm:hidden"
                  title="Copy link"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <Button
                  size="sm"
                  variant={profile.published ? "outline" : "default"}
                  onClick={() =>
                    setProfile((current) => ({
                      ...current,
                      published: !current.published
                    }))
                  }
                  className={cn(
                    "rounded-xl px-3 sm:px-4",
                    profile.published && "border-[hsl(150_60%_45%/0.3)] text-[hsl(150_60%_40%)] hover:border-[hsl(150_60%_45%)]"
                  )}
                >
                  {profile.published ? "Unpublish" : "Publish"}
                </Button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {activeSection === "overview" && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-sm">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(24_85%_50%/0.1)]">
                        <Eye className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                      </div>
                      <div className="mb-1 font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">{profile.views}</div>
                      <div className="flex items-center gap-1 text-xs text-[hsl(150_60%_40%)]">
                        <TrendingUp className="h-3 w-3" />
                        <span>+12% from last week</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-sm">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(24_85%_50%/0.1)]">
                        <MousePointerClick className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                      </div>
                      <div className="mb-1 font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">{totalClicks}</div>
                      <div className="flex items-center gap-1 text-xs text-[hsl(150_60%_40%)]">
                        <TrendingUp className="h-3 w-3" />
                        <span>+8% from last week</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-sm">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(24_85%_50%/0.1)]">
                        <Users className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                      </div>
                      <div className="mb-1 font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">{profile.links.length}</div>
                      <div className="text-xs text-[hsl(25_10%_45%)]">Active links</div>
                    </div>
                  </Card>

                  <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-sm">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(24_85%_50%/0.1)]">
                        <Clock className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                      </div>
                      <div className="mb-1 font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">
                        {Math.round(totalClicks / Math.max(profile.views, 1) * 100)}%
                      </div>
                      <div className="text-xs text-[hsl(25_10%_45%)]">Click rate</div>
                    </div>
                  </Card>
                </div>

                <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                  <div className="border-b border-[hsl(25_10%_45%/0.06)] px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-serif text-xl font-medium text-[hsl(25_25%_10%)]">Visitor Activity</h2>
                        <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">Page views over the last 7 days</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-xl border border-[hsl(25_10%_45%/0.1)] p-1">
                        {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
                          <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={cn(
                              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                              timeRange === range
                                ? "bg-[hsl(24_85%_50%)] text-white"
                                : "text-[hsl(25_10%_45%)] hover:bg-[hsl(25_10%_45%/0.05)]"
                            )}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex h-64 items-end justify-between gap-4">
                      {mockAnalytics.views.map((item, index) => (
                        <div key={item.date} className="flex flex-1 flex-col items-center gap-3">
                          <div className="relative h-full w-full">
                            <div
                              className="absolute inset-x-0 bottom-0 rounded-t-lg bg-gradient-to-t from-[hsl(24_85%_50%/0.2)] to-[hsl(24_85%_50%)] transition-all duration-500 hover:from-[hsl(24_85%_50%/0.3)]"
                              style={{ height: `${(item.value / maxViews) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-[hsl(25_10%_45%)]">{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                  <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                    <div className="border-b border-[hsl(25_10%_45%/0.06)] px-6 py-5">
                      <h2 className="font-serif text-xl font-medium text-[hsl(25_25%_10%)]">Link Performance</h2>
                      <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">Clicks per link</p>
                    </div>
                    <div className="space-y-5 p-6">
                      {mockAnalytics.clicks.map((item, index) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-[hsl(25_25%_10%)]">{item.label}</span>
                            <span className="text-[hsl(25_10%_45%)]">{item.value} clicks</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[hsl(25_10%_45%/0.08)]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[hsl(24_85%_50%)] to-[hsl(24_85%_60%)] transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                    <div className="border-b border-[hsl(25_10%_45%/0.06)] px-6 py-5">
                      <h2 className="font-serif text-xl font-medium text-[hsl(25_25%_10%)]">Traffic Sources</h2>
                      <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">Where your visitors come from</p>
                    </div>
                    <div className="space-y-4 p-6">
                      {mockAnalytics.referrers.map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(25_10%_45%/0.06)]">
                              <span className="text-sm">{item.label === "Instagram" ? "📷" : item.label === "Twitter/X" ? "𝕏" : item.label === "TikTok" ? "🎵" : "🔗"}</span>
                            </div>
                            <span className="text-sm font-medium text-[hsl(25_25%_10%)]">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-[hsl(25_10%_45%/0.08)]">
                              <div
                                className="h-full rounded-full bg-[hsl(24_85%_50%)]"
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                            <span className="w-10 text-right text-sm text-[hsl(25_10%_45%)]">{item.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                  <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                    <div className="border-b border-[hsl(25_10%_45%/0.06)] px-6 py-5">
                      <h2 className="font-serif text-xl font-medium text-[hsl(25_25%_10%)]">Devices</h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {mockAnalytics.devices.map((item) => (
                          <div key={item.label} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-[hsl(25_25%_10%)]">{item.label}</span>
                                <span className="font-medium text-[hsl(25_25%_10%)]">{item.value}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-[hsl(25_10%_45%/0.08)]">
                                <div
                                  className="h-full rounded-full bg-[hsl(24_85%_50%)]"
                                  style={{ width: `${item.value}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm lg:col-span-2">
                    <div className="border-b border-[hsl(25_10%_45%/0.06)] px-6 py-5">
                      <h2 className="font-serif text-xl font-medium text-[hsl(25_25%_10%)]">Top Countries</h2>
                    </div>
                    <div className="divide-y divide-[hsl(25_10%_45%/0.06)]">
                      {mockAnalytics.topCountries.map((item, index) => (
                        <div key={item.label} className="flex items-center justify-between px-6 py-4">
                          <div className="flex items-center gap-4">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(25_10%_45%/0.06)] text-sm">
                              {index + 1}
                            </span>
                            <span className="text-xl">{item.flag}</span>
                            <span className="text-sm font-medium text-[hsl(25_25%_10%)]">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-[hsl(25_10%_45%/0.08)]">
                              <div
                                className="h-full rounded-full bg-[hsl(24_85%_50%)]"
                                style={{ width: `${item.value * 2}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-sm font-medium text-[hsl(25_25%_10%)]">{item.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "links" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-[hsl(25_25%_10%)]">Manage Links</h2>
                    <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">Add, edit, and organize your links</p>
                  </div>
                  <Button
                    onClick={() =>
                      setProfile((current) => ({
                        ...current,
                        links: [...current.links, createBlankLink()]
                      }))
                    }
                    className="rounded-xl bg-[hsl(24_85%_42%)] text-white hover:bg-[hsl(24_85%_35%)]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                  </Button>
                </div>

                <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                  <div className="divide-y divide-[hsl(25_10%_45%/0.06)]">
                    {profile.links.map((link, index) => (
                      <div key={link.id} className="group p-4 sm:p-6 transition-all hover:bg-[hsl(25_10%_45%/0.02)]">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[hsl(25_10%_45%/0.06)] text-xs sm:text-sm font-medium text-[hsl(25_10%_45%)]">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-3 sm:space-y-4">
                            <div className="grid gap-3 sm:gap-4">
                              <Input
                                placeholder="Link label"
                                value={link.title}
                                onChange={(event) => updateLink(link.id, "title", event.target.value)}
                                className="rounded-xl text-sm"
                              />
                              <Input
                                placeholder="https://example.com"
                                value={link.url}
                                onChange={(event) => updateLink(link.id, "url", event.target.value)}
                                className="rounded-xl text-sm"
                              />
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl bg-[hsl(25_10%_45%/0.03)] px-3 sm:px-4 py-2 sm:py-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-3 sm:gap-6">
                                <div className="flex items-center gap-2">
                                  <MousePointerClick className="h-4 w-4 text-[hsl(24_85%_42%)]" />
                                  <span className="text-sm font-medium text-[hsl(25_25%_10%)]">{link.clicks}</span>
                                  <span className="hidden text-xs text-[hsl(25_10%_45%)] sm:inline">clicks</span>
                                </div>
                                <div className="hidden h-4 w-px bg-[hsl(25_10%_45%/0.1)] sm:block" />
                                <span className="text-xs text-[hsl(25_10%_45%)]">
                                  {link.url ? new URL(link.url).hostname : "No URL"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 sm:opacity-100">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setProfile((current) => ({
                                      ...current,
                                      links: swapLinks(current.links, index, -1)
                                    }))
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setProfile((current) => ({
                                      ...current,
                                      links: swapLinks(current.links, index, 1)
                                    }))
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <MoveDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateLink(link.id, "clicks", link.clicks + 1)}
                                  className="h-8 gap-1.5 px-2 text-[hsl(24_85%_42%)]"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                  <span className="text-xs">Simulate</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLink(link.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeSection === "theme" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-[hsl(25_25%_10%)]">Theme Presets</h2>
                  <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">Choose a theme that matches your style</p>
                </div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {themePresets.map((preset) => (
                    <Card
                      key={preset.id}
                      className={cn(
                        "group cursor-pointer overflow-hidden rounded-2xl border-0 p-0 transition-all duration-300",
                        profile.themeId === preset.id
                          ? "ring-2 ring-[hsl(24_85%_42%)] shadow-lg shadow-[hsl(24_85%_50%/0.15)]"
                          : "hover:shadow-lg"
                      )}
                      onClick={() =>
                        setProfile((current) => ({ ...current, themeId: preset.id }))
                      }
                    >
                      <div
                        className="h-40 p-6"
                        style={{ backgroundColor: preset.background }}
                      >
                        <div className="flex h-full flex-col items-center justify-center rounded-xl p-4" style={{ backgroundColor: preset.card }}>
                          <div
                            className="mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold"
                            style={{ backgroundColor: preset.accent, color: preset.card }}
                          >
                            AC
                          </div>
                          <div className="h-3 w-20 rounded" style={{ backgroundColor: preset.muted }} />
                          <div className="mt-2 h-2 w-16 rounded" style={{ backgroundColor: preset.muted, opacity: 0.5 }} />
                        </div>
                      </div>
                      <div className="bg-white p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-medium text-[hsl(25_25%_10%)]">{preset.name}</span>
                          {profile.themeId === preset.id && (
                            <CheckCircle2 className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                          )}
                        </div>
                        <div className="mb-4 flex gap-2">
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: preset.background }} />
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: preset.card }} />
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: preset.accent }} />
                          <span className="h-5 w-5 rounded-full" style={{ backgroundColor: preset.text }} />
                        </div>
                        <span className="text-xs capitalize text-[hsl(25_10%_45%)]">{preset.font} typography</span>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                  <div className="border-b border-[hsl(25_10%_45%/0.06)] px-4 sm:px-6 py-4 sm:py-5">
                    <h2 className="font-serif text-lg sm:text-xl font-medium text-[hsl(25_25%_10%)]">Live Preview</h2>
                  </div>
                  <div className="p-4 sm:p-8">
                    <div className="mx-auto max-w-sm">
                      <div
                        className={cn(
                          "rounded-[2rem] border p-6 shadow-xl",
                          fontClass(theme.font)
                        )}
                        style={{ 
                          backgroundColor: theme.card,
                          borderColor: theme.accent + '20'
                        }}
                      >
                        <div className="space-y-5 text-center">
                          <div
                            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold"
                            style={{ backgroundColor: theme.accent, color: theme.card }}
                          >
                            {profile.avatar || "LN"}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
                              {profile.displayName || "Your name"}
                            </h2>
                            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: theme.muted }}>
                              {profile.bio || "Your bio will appear here"}
                            </p>
                          </div>
                          <div className="space-y-2.5">
                            {profile.links.slice(0, 3).map((link) => (
                              <div
                                key={link.id}
                                className="rounded-xl px-4 py-3 text-sm font-medium"
                                style={{ backgroundColor: theme.background, color: theme.text }}
                              >
                                {link.title || "Untitled link"}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeSection === "profile" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-[hsl(25_25%_10%)]">Profile Settings</h2>
                  <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">Customize your public profile information</p>
                </div>

                <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                  <div className="border-b border-[hsl(25_10%_45%/0.06)] px-4 sm:px-6 py-4 sm:py-5">
                    <h3 className="font-serif text-lg font-medium text-[hsl(25_25%_10%)]">Basic Information</h3>
                  </div>
                  <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[hsl(25_25%_10%)]">Display name</label>
                        <Input
                          value={profile.displayName}
                          onChange={(event) =>
                            setProfile((current) => ({ ...current, displayName: event.target.value }))
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[hsl(25_25%_10%)]">Username</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(25_10%_45%)]">@</span>
                          <Input
                            value={profile.username}
                            onChange={(event) =>
                              setProfile((current) => ({
                                ...current,
                                username: event.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "")
                              }))
                            }
                            className="rounded-xl pl-8"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[hsl(25_25%_10%)]">Bio</label>
                      <Textarea
                        value={profile.bio}
                        onChange={(event) =>
                          setProfile((current) => ({ ...current, bio: event.target.value }))
                        }
                        rows={3}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[hsl(25_25%_10%)]">Avatar initials</label>
                      <Input
                        maxLength={2}
                        value={profile.avatar}
                        onChange={(event) =>
                          setProfile((current) => ({
                            ...current,
                            avatar: event.target.value.toUpperCase()
                          }))
                        }
                        className="w-24 rounded-xl text-center text-xl font-medium uppercase"
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-[hsl(25_25%_10%)]">Settings</h2>
                  <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">Configure your workspace</p>
                </div>

                <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                  <div className="border-b border-[hsl(25_10%_45%/0.06)] px-4 sm:px-6 py-4 sm:py-5">
                    <h3 className="font-serif text-lg font-medium text-[hsl(25_25%_10%)]">Publishing</h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-[hsl(25_25%_10%)]">Public page status</p>
                        <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">
                          {profile.published
                            ? "Your page is live and accessible"
                            : "Your page is not visible to visitors"}
                        </p>
                      </div>
                      <Button
                        variant={profile.published ? "outline" : "default"}
                        onClick={() =>
                          setProfile((current) => ({
                            ...current,
                            published: !current.published
                          }))
                        }
                        className="rounded-xl w-full sm:w-auto"
                      >
                        {profile.published ? "Unpublish" : "Publish"}
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                  <div className="border-b border-[hsl(25_10%_45%/0.06)] px-4 sm:px-6 py-4 sm:py-5">
                    <h3 className="font-serif text-lg font-medium text-[hsl(25_25%_10%)]">Data Management</h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-[hsl(25_25%_10%)]">Reset analytics</p>
                        <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">
                          Reset all views and clicks to zero
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 w-full sm:w-auto"
                        onClick={() =>
                          setProfile((current) => ({
                            ...current,
                            views: 0,
                            links: current.links.map(link => ({ ...link, clicks: 0 }))
                          }))
                        }
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
