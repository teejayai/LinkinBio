"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Paintbrush, Smartphone, Link2, Settings, Eye, Sparkles, Star, Quote, ExternalLink, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = ref.current?.querySelectorAll(".animate-reveal, .animate-reveal-scale");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function HomePage() {
  const containerRef = useScrollReveal();

  return (
    <>
      <div className="grain-overlay" />
      <main ref={containerRef} className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-[700px] w-[700px] rounded-full bg-[hsl(24_85%_50%/0.06)] blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[hsl(35_20%_88%/0.5)] blur-[100px]" />
          <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-[hsl(24_60%_88%/0.4)] blur-[80px]" />
        </div>

        <header className="relative z-10 px-8 pt-8">
          <nav className="mx-auto flex max-w-6xl items-center justify-between">
            <div className="group flex items-center gap-3 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(24_85%_42%)] text-[hsl(30_15%_97%)] transition-transform duration-300 group-hover:scale-110">
                <span className="font-serif text-lg font-medium italic">L</span>
              </div>
              <span className="font-serif text-2xl font-medium tracking-tight">LinkNest</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#features" className="hidden text-sm font-medium text-[hsl(25_10%_45%)] transition-colors hover:text-[hsl(25_25%_10%)] md:block link-underline">
                Features
              </Link>
              <Link href="#how-it-works" className="hidden text-sm font-medium text-[hsl(25_10%_45%)] transition-colors hover:text-[hsl(25_25%_10%)] md:block link-underline">
                How it works
              </Link>
              <Link href="/studio">
                <Button className="group overflow-hidden rounded-full bg-[hsl(25_25%_10%)] px-6 py-2.5 text-sm hover:bg-[hsl(25_25%_15%)]">
                  <span className="relative z-10">Open studio</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        <section className="relative px-4 sm:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(24_85%_50%/0.15)] bg-[hsl(24_85%_50%/0.06)] px-4 py-1.5 animate-fade-in-up">
                <Sparkles className="h-3.5 w-3.5 text-[hsl(24_85%_42%)]" />
                <span className="text-xs font-medium text-[hsl(24_85%_35%)]">Create your digital identity</span>
              </div>

              <h1 className="animate-fade-in-up stagger-1 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[hsl(25_25%_10%)] md:text-6xl lg:text-7xl">
                <span className="block">Your links,</span>
                <span className="editorial-mark block text-[hsl(24_85%_42%)]">your story,</span>
                <span className="block">your space</span>
              </h1>
              
              <p className="mx-auto max-w-xl animate-fade-in-up stagger-2 text-lg leading-relaxed text-[hsl(25_10%_45%)]">
                Customize your digital presence with refined aesthetics, 
                lightweight analytics, and pages that feel unmistakably yours.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 animate-fade-in-up stagger-3">
                <Link href="/login">
                  <Button size="lg" className="group overflow-hidden rounded-full bg-[hsl(24_85%_42%)] px-8 py-6 text-base hover:bg-[hsl(24_85%_35%)] hover:shadow-lg hover:shadow-[hsl(24_85%_50%/0.2)] transition-all duration-300">
                    <span className="relative z-10">Get started</span>
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="rounded-full border-2 px-8 py-6 text-base transition-all duration-300 hover:border-[hsl(24_85%_50%/0.4)] hover:bg-[hsl(24_85%_50%/0.05)]">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

<section className="relative px-4 sm:px-8 pb-16 sm:pb-24">
          <div className="mx-auto max-w-5xl">
            <div className="relative animate-fade-in-up stagger-4">
              <div className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-2xl shadow-[hsl(25_10%_10%/0.1)]">
                <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl bg-[hsl(30_15%_97%)] sm:flex-row">
                  <aside className="hidden w-[180px] flex-shrink-0 border-r border-[hsl(25_10%_45%/0.06)] p-3 sm:block">
                    <div className="mb-6 flex items-center gap-2 px-2">
                      <div className="h-8 w-8 rounded-lg bg-[hsl(24_85%_42%)] flex items-center justify-center">
                        <span className="font-serif text-sm font-medium italic text-[hsl(30_15%_97%)]">L</span>
                      </div>
                      <span className="font-serif text-base">LinkNest</span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { icon: "◈", label: "Dashboard", active: true },
                        { icon: "◉", label: "Links", active: false },
                        { icon: "◎", label: "Theme", active: false },
                        { icon: "◔", label: "Profile", active: false },
                        { icon: "⚙", label: "Settings", active: false }
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                            item.active
                              ? "bg-[hsl(24_85%_50%/0.1)] text-[hsl(24_85%_42%)]"
                              : "text-[hsl(25_10%_45%)]"
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </aside>

                  <main className="flex-1 p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-lg sm:text-xl">Dashboard</h3>
                        <span className="flex items-center gap-1.5 rounded-full bg-[hsl(150_60%_45%/0.12)] px-2.5 py-1">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(150_60%_40%)]" />
                          <span className="text-[10px] font-medium text-[hsl(150_60%_35%)]">Live</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg border border-[hsl(25_10%_45%/0.1)] bg-white px-2.5 py-1.5">
                          <span className="text-[10px] text-[hsl(25_10%_45%)]">/yourname</span>
                        </div>
                        <div className="rounded-lg bg-[hsl(24_85%_42%)] px-3 py-1.5 text-[10px] font-medium text-[hsl(30_15%_97%)]">
                          Publish
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                      {[
                        { label: "Total Views", value: "0", trend: "", color: "" },
                        { label: "Total Clicks", value: "0", trend: "", color: "" },
                        { label: "Top Link", value: "-", trend: "", color: "" },
                        { label: "Avg. CTR", value: "0%", trend: "", color: "" }
                      ].map((stat, i) => (
                        <div key={i} className="rounded-xl bg-white p-4 shadow-sm">
                          <div className="mb-1 text-[10px] uppercase tracking-wider text-[hsl(25_10%_45%)]">{stat.label}</div>
                          <div className="font-serif text-xl font-medium">{stat.value}</div>
                          {stat.trend && <div className={`mt-1 text-[10px] ${stat.color}`}>{stat.trend}</div>}
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium">Views (7 days)</h4>
                      </div>
                      <div className="flex items-end gap-1.5 h-20">
                        {[0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-[hsl(24_85%_50%/0.2)]"
                            style={{ height: '10%' }}
                          />
                        ))}
                      </div>
                      <div className="mt-2 flex justify-between text-[9px] text-[hsl(25_10%_45%)]">
                        <span>Day 1</span>
                        <span>Day 7</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h4 className="mb-3 text-xs font-medium">Your Links</h4>
                        <div className="space-y-2">
                          <p className="text-[10px] text-[hsl(25_10%_45%)]">No links yet. Add your first link in the studio.</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h4 className="mb-3 text-xs font-medium">Traffic Sources</h4>
                        <div className="space-y-2">
                          <p className="text-[10px] text-[hsl(25_10%_45%)]">No traffic yet. Share your page to get started.</p>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 animate-float">
                <div className="rounded-2xl border border-[hsl(24_85%_50%/0.2)] bg-white/90 backdrop-blur-sm px-5 py-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.15)]">
                      <BarChart3 className="h-5 w-5 text-[hsl(24_85%_42%)]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Analytics ready</div>
                      <div className="text-xs text-[hsl(25_10%_45%)]">Track your growth</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 top-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: "1s" }}>
                <div className="rounded-2xl border border-[hsl(25_10%_45%/0.1)] bg-white/90 backdrop-blur-sm px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.15)]">
                      <Sparkles className="h-4 w-4 text-[hsl(24_85%_42%)]" />
                    </div>
                    <div className="text-xs font-medium">6 themes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="relative px-4 sm:px-8 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 sm:mb-16 text-center animate-reveal">
              <span className="mb-4 inline-block text-xs font-medium uppercase tracking-widest text-[hsl(24_85%_42%)]">Features</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium">Crafted for creators</h2>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <Card className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-0 bg-white p-6 sm:p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-reveal" style={{ transitionDelay: "0ms" }}>
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-700 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(24_85%_50%/0.1)] transition-colors duration-300 group-hover:bg-[hsl(24_85%_50%/0.15)] group-hover:scale-110">
                    <Paintbrush className="h-7 w-7 text-[hsl(24_85%_42%)]" />
                  </div>
                  <h3 className="mb-3 font-serif text-2xl font-medium">Theme presets</h3>
                  <p className="leading-relaxed text-[hsl(25_10%_45%)]">
                    Switch between bold, elegant, and editorial creator looks. Every detail considered.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[hsl(24_85%_42%)]">
                  <span>Explore themes</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Card>

              <Card className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-0 bg-white p-6 sm:p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-reveal" style={{ transitionDelay: "100ms" }}>
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-700 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(24_85%_50%/0.1)] transition-colors duration-300 group-hover:bg-[hsl(24_85%_50%/0.15)] group-hover:scale-110">
                    <BarChart3 className="h-7 w-7 text-[hsl(24_85%_42%)]" />
                  </div>
                  <h3 className="mb-3 font-serif text-2xl font-medium">Analytics</h3>
                  <p className="leading-relaxed text-[hsl(25_10%_45%)]">
                    Track visits and link clicks with simulated analytics while validating your product flow.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[hsl(24_85%_42%)]">
                  <span>View metrics</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Card>

              <Card className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border-0 bg-white p-6 sm:p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-reveal" style={{ transitionDelay: "200ms" }}>
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[hsl(24_85%_50%/0.08)] transition-transform duration-700 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(24_85%_50%/0.1)] transition-colors duration-300 group-hover:bg-[hsl(24_85%_50%/0.15)] group-hover:scale-110">
                    <Smartphone className="h-7 w-7 text-[hsl(24_85%_42%)]" />
                  </div>
                  <h3 className="mb-3 font-serif text-2xl font-medium">Mobile-first</h3>
                  <p className="leading-relaxed text-[hsl(25_10%_45%)]">
                    Preview a clean public page optimized for creator traffic from social platforms.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-[hsl(24_85%_42%)]">
                  <span>See preview</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="relative px-4 sm:px-8 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 sm:mb-16 text-center animate-reveal">
              <span className="mb-4 inline-block text-xs font-medium uppercase tracking-widest text-[hsl(24_85%_42%)]">Simple process</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium">How it works</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="relative text-center animate-reveal" style={{ transitionDelay: "0ms" }}>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.1)]">
                  <Link2 className="h-8 w-8 text-[hsl(24_85%_42%)]" />
                </div>
                <div className="mb-4 font-serif text-xl font-medium">Add your links</div>
                <p className="text-sm leading-relaxed text-[hsl(25_10%_45%)]">
                  Paste in your links, social profiles, and content. Organize them in any order you like.
                </p>
                <div className="absolute -right-4 top-8 hidden text-[hsl(24_85%_50%/0.3)] md:block">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>

              <div className="relative text-center animate-reveal" style={{ transitionDelay: "150ms" }}>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.1)]">
                  <Settings className="h-8 w-8 text-[hsl(24_85%_42%)]" />
                </div>
                <div className="mb-4 font-serif text-xl font-medium">Customize themes</div>
                <p className="text-sm leading-relaxed text-[hsl(25_10%_45%)]">
                  Choose from curated themes or fine-tune colors, fonts, and layouts to match your brand.
                </p>
                <div className="absolute -right-4 top-8 hidden text-[hsl(24_85%_50%/0.3)] md:block">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>

              <div className="relative text-center animate-reveal" style={{ transitionDelay: "300ms" }}>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.1)]">
                  <Sparkles className="h-8 w-8 text-[hsl(24_85%_42%)]" />
                </div>
                <div className="mb-4 font-serif text-xl font-medium">Share your page</div>
                <p className="text-sm leading-relaxed text-[hsl(25_10%_45%)]">
                  Get your unique LinkNest URL and share it everywhere. Track your performance with analytics.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="relative px-4 sm:px-8 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 sm:mb-16 text-center animate-reveal">
              <span className="mb-4 inline-block text-xs font-medium uppercase tracking-widest text-[hsl(24_85%_42%)]">Testimonials</span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium">Loved by creators</h2>
            </div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <Card className="animate-reveal-scale rounded-2xl sm:rounded-3xl border-0 bg-white p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl" style={{ transitionDelay: "0ms" }}>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[hsl(24_85%_50%)] text-[hsl(24_85%_50%)]" />
                  ))}
                </div>
                <Quote className="mb-4 h-6 w-6 text-[hsl(24_85%_50%/0.3)]" />
                <p className="mb-6 leading-relaxed text-[hsl(25_10%_45%)]">
                  &ldquo;LinkNest transformed how I share my content. The elegant design makes my page feel premium without any coding.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.15)] text-sm font-medium text-[hsl(24_85%_42%)]">
                    SK
                  </div>
                  <div>
                    <div className="font-medium">Sarah Kim</div>
                    <div className="text-xs text-[hsl(25_10%_45%)]">Content Creator</div>
                  </div>
                </div>
              </Card>

              <Card className="animate-reveal-scale rounded-2xl sm:rounded-3xl border-0 bg-white p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl" style={{ transitionDelay: "100ms" }}>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[hsl(24_85%_50%)] text-[hsl(24_85%_50%)]" />
                  ))}
                </div>
                <Quote className="mb-4 h-6 w-6 text-[hsl(24_85%_50%/0.3)]" />
                <p className="mb-6 leading-relaxed text-[hsl(25_10%_45%)]">
                  &ldquo;The analytics feature is a game-changer. I finally understand what content resonates with my audience.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.15)] text-sm font-medium text-[hsl(24_85%_42%)]">
                    MR
                  </div>
                  <div>
                    <div className="font-medium">Marcus Rodriguez</div>
                    <div className="text-xs text-[hsl(25_10%_45%)]">Digital Marketer</div>
                  </div>
                </div>
              </Card>

              <Card className="animate-reveal-scale rounded-2xl sm:rounded-3xl border-0 bg-white p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-xl" style={{ transitionDelay: "200ms" }}>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[hsl(24_85%_50%)] text-[hsl(24_85%_50%)]" />
                  ))}
                </div>
                <Quote className="mb-4 h-6 w-6 text-[hsl(24_85%_50%/0.3)]" />
                <p className="mb-6 leading-relaxed text-[hsl(25_10%_45%)]">
                  &ldquo;So much better than other link-in-bio tools. The themes are beautiful and the page loads instantly.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(24_85%_50%/0.15)] text-sm font-medium text-[hsl(24_85%_42%)]">
                    JL
                  </div>
                  <div>
                    <div className="font-medium">Jessica Liu</div>
                    <div className="text-xs text-[hsl(25_10%_45%)]">UX Designer</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative px-4 sm:px-8 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[hsl(25_25%_10%)] p-8 sm:p-12 text-center md:p-16 animate-reveal">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[hsl(24_85%_50%)] blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-[hsl(24_85%_60%)] blur-[80px]" />
              </div>
              
              <div className="relative">
                <span className="editorial-mark text-5xl sm:text-6xl text-[hsl(24_85%_50%/0.3)] md:text-8xl">&ldquo;</span>
                <blockquote className="mx-auto mb-6 sm:mb-8 font-serif text-2xl sm:text-3xl font-medium leading-tight text-[hsl(30_15%_97%)] md:text-4xl lg:text-5xl">
                  Your links, your story, your space on the internet.
                </blockquote>
                <Link href="/studio">
                  <Button size="lg" className="group rounded-full bg-[hsl(24_85%_50%)] px-8 sm:px-10 py-5 sm:py-6 text-base text-[hsl(30_15%_97%)] hover:bg-[hsl(24_85%_40%)] hover:shadow-lg hover:shadow-[hsl(24_85%_50%/0.3)] transition-all duration-300">
                    <span className="relative z-10">Create your page</span>
                    <ArrowRight className="ml-2 sm:ml-3 h-4 sm:h-5 w-4 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[hsl(25_10%_45%/0.1)] px-4 sm:px-8 py-8 sm:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(24_85%_42%)] text-[hsl(30_15%_97%)]">
                  <span className="font-serif text-sm font-medium italic">L</span>
                </div>
                <span className="font-serif text-lg">LinkNest</span>
              </div>
              <p className="text-sm text-[hsl(25_10%_45%)]">
                A creator-first link-in-bio platform
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
