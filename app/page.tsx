import Link from "next/link";
import { ArrowRight, BarChart3, Paintbrush, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">LinkNest</div>
          <Link href="/studio">
            <Button>Open studio</Button>
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary">Scaffolded from the PRD</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance">
                A creator-first link-in-bio app with customization and lightweight analytics.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                This starter includes a dashboard editor, local persistence, public profile routing,
                simulated click tracking, theme presets, and mobile-responsive layouts.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/studio">
                <Button size="lg">
                  Start editing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-glow">
            <div className="rounded-[1.5rem] bg-[#0f172a] p-5 text-slate-50">
              <div className="mx-auto max-w-sm rounded-[1.75rem] bg-[#1e293b] p-5">
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-2xl font-semibold">
                    AC
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-300">@adeola</p>
                    <h2 className="mt-2 text-2xl font-semibold">Adeola Creates</h2>
                    <p className="mt-3 text-sm text-slate-300">
                      Designer, educator, and storyteller sharing tools, workshops, and new drops.
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900">
                    Book a Brand Session
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900">
                    Watch My Latest Tutorial
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-900">
                    Join My Weekly Newsletter
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Paintbrush className="h-5 w-5 text-primary" />
                Theme presets
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Switch between bold, elegant, and editorial creator looks.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-primary" />
                Simulated analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Track visits and link clicks locally while validating the product flow.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Smartphone className="h-5 w-5 text-primary" />
                Mobile-first public page
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Preview a clean public page optimized for creator traffic from social platforms.
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
