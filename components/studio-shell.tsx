"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  ExternalLink,
  Paintbrush,
  Plus,
  Settings,
  User,
  Layers,
  Home,
  Menu,
  X,
  LogOut,
  Copy,
  Sparkles,
  Link2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultProfile, themePresets, loadProfile, saveProfile, checkUsernameAvailable } from "@/lib/supabase-storage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
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

function SetupWizard({ 
  isOpen, 
  onClose, 
  profile, 
  setProfile, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  profile: LinkProfile; 
  setProfile: React.Dispatch<React.SetStateAction<LinkProfile>>;
  onSave: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSaving(true);
      await onSave();
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 300);
    }
  };

  const handleSkip = () => {
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {}} />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-6 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-[hsl(24_85%_42%)]" : "bg-[hsl(25_10%_45%/0.1)]"
                )}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(24_85%_50%/0.1)]">
                  <User className="h-7 w-7 text-[hsl(24_85%_42%)]" />
                </div>
                <h2 className="font-serif text-2xl font-medium">Welcome! Let's set up your profile</h2>
                <p className="mt-2 text-sm text-[hsl(25_10%_45%)]">Start by telling us about yourself</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input
                    placeholder="Your name"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(25_10%_45%)]">@</span>
                    <Input
                      placeholder="yourname"
                      value={profile.username}
                      onChange={(e) => setProfile({ 
                        ...profile, 
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") 
                      })}
                      className="rounded-xl pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(24_85%_50%/0.1)]">
                  <Sparkles className="h-7 w-7 text-[hsl(24_85%_42%)]" />
                </div>
                <h2 className="font-serif text-2xl font-medium">Add a bio</h2>
                <p className="mt-2 text-sm text-[hsl(25_10%_45%)]">Tell visitors who you are</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  placeholder="A short description about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar initials</label>
                <Input
                  maxLength={2}
                  placeholder="AB"
                  value={profile.avatar}
                  onChange={(e) => setProfile({ ...profile, avatar: e.target.value.toUpperCase() })}
                  className="w-24 rounded-xl text-center text-xl font-medium uppercase"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(24_85%_50%/0.1)]">
                  <ExternalLink className="h-7 w-7 text-[hsl(24_85%_42%)]" />
                </div>
                <h2 className="font-serif text-2xl font-medium">Ready to go!</h2>
                <p className="mt-2 text-sm text-[hsl(25_10%_45%)]">Add your first link to get started</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Link Title</label>
                <Input
                  placeholder="e.g., My Portfolio"
                  value={profile.links[0]?.title || ""}
                  onChange={(e) => setProfile({
                    ...profile,
                    links: profile.links.length > 0 
                      ? [{ ...profile.links[0], title: e.target.value }]
                      : [{ id: crypto.randomUUID(), title: e.target.value, url: "", clicks: 0 }]
                  })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input
                  placeholder="https://yourwebsite.com"
                  value={profile.links[0]?.url || ""}
                  onChange={(e) => setProfile({
                    ...profile,
                    links: profile.links.length > 0 
                      ? [{ ...profile.links[0], url: e.target.value }]
                      : [{ id: crypto.randomUUID(), title: "", url: e.target.value, clicks: 0 }]
                  })}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={step > 1 ? () => setStep(step - 1) : handleSkip}
              className="flex-1 rounded-xl"
            >
              {step > 1 ? "Back" : "Skip"}
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSaving}
              className="flex-1 rounded-xl bg-[hsl(24_85%_42%)]"
            >
              {isSaving ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <span>{step === 3 ? "Finish" : "Next"}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const demoAuth = localStorage.getItem("linknest_auth");
      
      if (!demoAuth && (!isSupabaseConfigured || !supabase)) {
        router.push("/login");
        return;
      }

      if (supabase && isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (demoAuth) {
            setIsAuthenticated(true);
            const stored = await loadProfile();
            setProfile(stored);
            setReady(true);
            return;
          }
          router.push("/login");
          return;
        }
        setIsAuthenticated(true);
        const stored = await loadProfile(session.user.id);
        setProfile(stored);
        setCurrentUserId(session.user.id);
        
        if (!stored.username || !stored.displayName) {
          setShowSetupWizard(true);
        }
      } else {
        setIsAuthenticated(true);
        const stored = await loadProfile();
        setProfile(stored);
        setCurrentUserId("demo");
      }
      setReady(true);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!ready || !isAuthenticated) return;
    
    const saveTimeout = setTimeout(() => {
      saveProfile(profile);
    }, 500);
    
    return () => clearTimeout(saveTimeout);
  }, [profile, ready, isAuthenticated]);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !currentUserId) return;

    const pollInterval = setInterval(async () => {
      const fresh = await loadProfile(currentUserId);
      setProfile(prev => ({
        ...prev,
        links: prev.links.map(link => {
          const freshLink = fresh.links.find(f => f.id === link.id);
          return freshLink ? { ...link, clicks: freshLink.clicks } : link;
        }),
        views: fresh.views,
      }));
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [ready, currentUserId]);

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

  useEffect(() => {
    if (!profile.username || !isSupabaseConfigured) {
      setUsernameError(null);
      return;
    }

    const checkUsername = async () => {
      setCheckingUsername(true);
      const available = await checkUsernameAvailable(profile.username, profile.user_id);
      setUsernameError(available ? null : "This username is already taken");
      setCheckingUsername(false);
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [profile.username, profile.user_id]);

  const handleLogout = async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
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
  const ctr = profile.views > 0 ? Math.round((totalClicks / profile.views) * 100) : 0;

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

  return (
    <>
      <SetupWizard
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        profile={profile}
        setProfile={setProfile}
        onSave={() => {
          setProfile({ ...profile, published: profile.username && profile.displayName ? profile.published : false });
        }}
      />
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
                      <div className="text-xs text-[hsl(25_10%_45%)]">Total Views</div>
                    </div>
                  </Card>

                  <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-sm">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(24_85%_50%/0.1)]">
                        <ExternalLink className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                      </div>
                      <div className="mb-1 font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">{totalClicks}</div>
                      <div className="text-xs text-[hsl(25_10%_45%)]">Total Clicks</div>
                    </div>
                  </Card>

                  <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-sm">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(24_85%_50%/0.1)]">
                        <Layers className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                      </div>
                      <div className="mb-1 font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">{profile.links.length}</div>
                      <div className="text-xs text-[hsl(25_10%_45%)]">Active Links</div>
                    </div>
                  </Card>

                  <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white p-6 shadow-sm">
                    <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-500 group-hover:scale-125" />
                    <div className="relative">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(24_85%_50%/0.1)]">
                        <BarChart3 className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                      </div>
                      <div className="mb-1 font-serif text-3xl font-medium text-[hsl(25_25%_10%)]">{ctr}%</div>
                      <div className="text-xs text-[hsl(25_10%_45%)]">Click Rate</div>
                    </div>
                  </Card>
                </div>

                {profile.links.length > 0 && (
                  <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
                    <div className="border-b border-[hsl(25_10%_45%/0.06)] px-6 py-5">
                      <h2 className="font-serif text-xl font-medium text-[hsl(25_25%_10%)]">Link Performance</h2>
                      <p className="mt-1 text-sm text-[hsl(25_10%_45%)]">Clicks per link</p>
                    </div>
                    <div className="space-y-5 p-6">
                      {profile.links.map((item) => {
                        const maxClicks = Math.max(...profile.links.map(l => l.clicks), 1);
                        const pct = Math.round((item.clicks / maxClicks) * 100);
                        return (
                          <div key={item.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-[hsl(25_25%_10%)]">{item.title || "Untitled"}</span>
                              <span className="text-[hsl(25_10%_45%)]">{item.clicks} clicks</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-[hsl(25_10%_45%/0.08)]">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[hsl(24_85%_50%)] to-[hsl(24_85%_60%)]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {!profile.published && (
                  <Card className="overflow-hidden rounded-2xl border-2 border-dashed border-[hsl(24_85%_50%/0.3)] bg-[hsl(24_85%_50%/0.02)] p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.1)]">
                        <ExternalLink className="h-6 w-6 text-[hsl(24_85%_42%)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[hsl(25_25%_10%)]">Your page is not published</h3>
                        <p className="text-sm text-[hsl(25_10%_45%)]">Publish your page to start getting views and track analytics</p>
                      </div>
                      <Button
                        onClick={() => setProfile({ ...profile, published: true })}
                        className="rounded-xl bg-[hsl(24_85%_42%)]"
                      >
                        Publish Now
                      </Button>
                    </div>
                  </Card>
                )}
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
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[hsl(25_10%_45%)]">{link.clicks} clicks</span>
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
                                  disabled={index === 0}
                                  className="h-8 w-8 p-0 disabled:opacity-30"
                                >
                                  <span className="text-lg">↑</span>
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
                                  disabled={index === profile.links.length - 1}
                                  className="h-8 w-8 p-0 disabled:opacity-30"
                                >
                                  <span className="text-lg">↓</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLink(link.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                >
                                  <span className="text-lg">×</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {profile.links.length === 0 && (
                      <div className="p-12 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(25_10%_45%/0.1)]">
                          <Link2 className="h-8 w-8 text-[hsl(25_10%_45%)]" />
                        </div>
                        <h3 className="mb-2 font-medium text-[hsl(25_25%_10%)]">No links yet</h3>
                        <p className="mb-4 text-sm text-[hsl(25_10%_45%)]">Add your first link to start sharing</p>
                        <Button
                          onClick={() =>
                            setProfile((current) => ({
                              ...current,
                              links: [...current.links, createBlankLink()]
                            }))
                          }
                          className="rounded-xl bg-[hsl(24_85%_42%)]"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Link
                        </Button>
                      </div>
                    )}
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
                            LN
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
                            className={cn(
                              "rounded-xl pl-8",
                              usernameError && "border-red-300 focus:border-red-400"
                            )}
                          />
                          {checkingUsername && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(25_10%_45%)]">
                              Checking...
                            </span>
                          )}
                        </div>
                        {usernameError && (
                          <p className="text-xs text-red-500">{usernameError}</p>
                        )}
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