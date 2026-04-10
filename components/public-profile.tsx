"use client";

import Link from "next/link";
import { ExternalLink, Eye, MousePointerClick } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { defaultProfile, themePresets } from "@/lib/mock-data";
import { loadProfile, saveProfile } from "@/lib/storage";
import { LinkProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

function fontClass(font: "grotesk" | "serif" | "mono") {
  if (font === "serif") {
    return "font-[Georgia,_ui-serif,_serif]";
  }
  if (font === "mono") {
    return "font-[IBM_Plex_Mono,_ui-monospace,_monospace]";
  }
  return "font-[Space_Grotesk,_ui-sans-serif,_system-ui]";
}

export function PublicProfile({ username }: { username: string }) {
  const [profile, setProfile] = useState<LinkProfile | null>(null);
  const [mounted, setMounted] = useState(false);

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
    return <div className="p-6 text-sm text-muted-foreground">Loading page...</div>;
  }

  if (!profile) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 text-center">
        <div className="space-y-4">
          <Badge>Profile unavailable</Badge>
          <h1 className="text-3xl font-semibold">This username has not been published in local demo data.</h1>
          <p className="text-sm text-muted-foreground">
            Open the studio, set the username to <span className="font-medium">{username}</span>, and publish locally.
          </p>
          <Link href="/studio" className="text-sm font-medium text-primary">
            Go to studio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main
      className={cn("min-h-screen px-4 py-10", fontClass(theme.font))}
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <div className="mx-auto max-w-md">
        <div
          className="rounded-[2rem] border border-black/5 p-6 shadow-glow"
          style={{ backgroundColor: theme.card }}
        >
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <div
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold"
                style={{ backgroundColor: theme.accent, color: theme.card }}
              >
                {profile.avatar || "LN"}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em]" style={{ color: theme.muted }}>
                  @{profile.username}
                </p>
                <h1 className="mt-2 text-3xl font-semibold">{profile.displayName}</h1>
                <p className="mt-3 text-sm leading-6" style={{ color: theme.muted }}>
                  {profile.bio}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {profile.links.map((linkItem) => (
                <a
                  key={linkItem.id}
                  href={linkItem.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-medium transition hover:-translate-y-0.5"
                  style={{ backgroundColor: theme.background, color: theme.text }}
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
                >
                  <span>{linkItem.title || "Untitled link"}</span>
                  <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>

            <div
              className="grid grid-cols-2 gap-3 rounded-2xl p-4 text-sm"
              style={{ backgroundColor: theme.background, color: theme.muted }}
            >
              <div className="rounded-2xl p-4" style={{ backgroundColor: theme.card }}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em]">
                  <Eye className="h-3.5 w-3.5" />
                  Visits
                </div>
                <div className="mt-2 text-2xl font-semibold" style={{ color: theme.text }}>
                  {profile.views}
                </div>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: theme.card }}>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em]">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Clicks
                </div>
                <div className="mt-2 text-2xl font-semibold" style={{ color: theme.text }}>
                  {profile.links.reduce((sum, item) => sum + item.clicks, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
