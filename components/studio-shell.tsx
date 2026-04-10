"use client";

import Link from "next/link";
import { ArrowUp, BarChart3, Eye, Link2, MoveDown, MoveUp, Paintbrush, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  if (font === "serif") {
    return "font-[Georgia,_ui-serif,_serif]";
  }
  if (font === "mono") {
    return "font-[IBM_Plex_Mono,_ui-monospace,_monospace]";
  }
  return "font-[Space_Grotesk,_ui-sans-serif,_system-ui]";
}

export function StudioShell() {
  const [profile, setProfile] = useState<LinkProfile>(defaultProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadProfile();
    setProfile(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    saveProfile(profile);
  }, [profile, ready]);

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

  if (!ready) {
    return <div className="p-6 text-sm text-muted-foreground">Loading studio...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-border bg-card p-8 shadow-glow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary">Local-first v1 scaffold</Badge>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">Build, preview, and publish your creator page.</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                This starter maps directly to the PRD: profile editing, link management, theme presets,
                simulated analytics, and a public username page backed by local browser state.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={publicPath} target="_blank" rel="noreferrer">
              <Button size="lg">
                <Eye className="mr-2 h-4 w-4" />
                Open public page
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total visits</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Eye className="h-6 w-6 text-primary" />
              {profile.views}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total clicks</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <BarChart3 className="h-6 w-6 text-primary" />
              {totalClicks}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Public URL</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5 text-primary" />
              {publicPath}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile setup</CardTitle>
              <CardDescription>Configure the public identity shown on the bio page.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Display name</label>
                <Input
                  value={profile.displayName}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, displayName: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  value={profile.username}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      username: event.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "")
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar initials</label>
                <Input
                  maxLength={2}
                  value={profile.avatar}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      avatar: event.target.value.toUpperCase()
                    }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={profile.bio}
                  onChange={(event) =>
                    setProfile((current) => ({ ...current, bio: event.target.value }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link management</CardTitle>
              <CardDescription>Add, edit, reorder, and remove destination links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.links.map((link, index) => (
                <div key={link.id} className="rounded-2xl border border-border p-4">
                  <div className="grid gap-3 md:grid-cols-[1fr_1.2fr_auto]">
                    <Input
                      placeholder="Link label"
                      value={link.title}
                      onChange={(event) => updateLink(link.id, "title", event.target.value)}
                    />
                    <Input
                      placeholder="https://example.com"
                      value={link.url}
                      onChange={(event) => updateLink(link.id, "url", event.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setProfile((current) => ({
                            ...current,
                            links: swapLinks(current.links, index, -1)
                          }))
                        }
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setProfile((current) => ({
                            ...current,
                            links: swapLinks(current.links, index, 1)
                          }))
                        }
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeLink(link.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{link.clicks} simulated clicks</span>
                    <button
                      className="inline-flex items-center gap-1 text-primary"
                      onClick={() => updateLink(link.id, "clicks", link.clicks + 1)}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                      simulate click
                    </button>
                  </div>
                </div>
              ))}
              <Button
                variant="secondary"
                onClick={() =>
                  setProfile((current) => ({
                    ...current,
                    links: [...current.links, createBlankLink()]
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme presets</CardTitle>
              <CardDescription>Switch colors and typography for different creator styles.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {themePresets.map((preset) => (
                <button
                  key={preset.id}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    profile.themeId === preset.id
                      ? "border-primary shadow-glow"
                      : "border-border hover:border-primary/40"
                  )}
                  onClick={() =>
                    setProfile((current) => ({ ...current, themeId: preset.id }))
                  }
                >
                  <div className="mb-3 flex gap-2">
                    <span className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.background }} />
                    <span className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.card }} />
                    <span className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                  </div>
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-xs text-muted-foreground">{preset.font} typography</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5 text-primary" />
              Live preview
            </CardTitle>
            <CardDescription>Public mobile view using the current local state.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div
              className={cn("min-h-[780px] p-6", fontClass(theme.font))}
              style={{ backgroundColor: theme.background, color: theme.text }}
            >
              <div className="mx-auto max-w-sm space-y-5 rounded-[2rem] border border-black/5 p-5 shadow-glow" style={{ backgroundColor: theme.card }}>
                <div className="space-y-4 text-center">
                  <div
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold"
                    style={{ backgroundColor: theme.accent, color: theme.card }}
                  >
                    {profile.avatar || "LN"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">{profile.displayName}</h2>
                    <p className="mt-2 text-sm" style={{ color: theme.muted }}>
                      {profile.bio}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {profile.links.map((link) => (
                    <div
                      key={link.id}
                      className="rounded-2xl px-4 py-4 text-sm font-medium"
                      style={{ backgroundColor: theme.background, color: theme.text }}
                    >
                      {link.title || "Untitled link"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
