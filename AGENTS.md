# LinkNest - AI Agent Guidelines

## Project Overview
LinkNest is a Next.js 15 link-in-bio SaaS with Supabase backend, theme customization, and real-time analytics.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + CSS variables
- **Backend**: Supabase (auth + PostgreSQL)
- **Components**: shadcn/ui patterns (CVA)
- **Icons**: Lucide React

## Key Files
```
app/
  page.tsx           # Landing page
  studio/page.tsx    # Dashboard wrapper
  login/page.tsx     # Auth page
  [username]/page.tsx # Public profile
components/
  studio-shell.tsx   # Main dashboard + SetupWizard
  public-profile.tsx # Public profile display
lib/
  supabase.ts        # Supabase client
  supabase-storage.ts # Profile/links CRUD
  types.ts           # TypeScript types
  mock-data.ts       # Theme presets only
```

## Commands
```bash
npm run dev    # Dev server (port 3000)
npm run build  # Production build
```

## Supabase
- Project: `sgkdxitumaaswwallxpv`
- Tables: `profiles`, `links` with RLS policies
- **Migration**: New users get empty username (triggers setup wizard)
- **RLS**: Public profiles readable via `USING (true)`

## Critical Patterns

**Setup Wizard**: Triggers when `username` OR `displayName` is empty (studio-shell.tsx:291-293)
- Always use empty string for new user usernames in DB
- Never use "user_xxx" pattern

**Profile Loading**: `loadProfile(userId)` returns profile from Supabase or falls back to localStorage (demo mode)

**Public Profile**: `getPublicProfile(username)` requires `published = true`

## Design System
- Fonts: Cormorant Garamond (serif), DM Sans (body), JetBrains Mono (mono)
- Accent: Terracotta (#c45d3e)
- Grain texture overlay on all pages

## Adding Features
1. Define types in `lib/types.ts`
2. Add DB logic in `lib/supabase-storage.ts` for Supabase-backed features
3. Create components with "use client"
4. Follow Neo-Editorial aesthetic: warm backgrounds, staggered animations, hover lifts

## Testing
Run Playwright tests to verify features:
```bash
npm install playwright
npx playwright install chromium
node test-features.js  # Basic feature tests
node test-website.js   # Core page tests
```

To run tests:
1. Start dev server: `npm run dev` (or `nohup npm run dev &`)
2. Run tests: `node test-features.js`

Key tests verify:
- Landing/Login/Studio pages load
- Public profiles display correctly
- 404 for non-existent profiles
- Theme presets visible
- Analytics displayed
- External links work
- Mobile/Desktop responsive

## Gotchas & Fixes (History)

**Setup Wizard not triggering**: 
- Root cause: DB trigger used `user_xxx` as default username
- Fix: migration 001 & 002 set username to empty string `''`
- Also fix in `supabase-storage.ts:createProfile()`

**Mock "user" username showing**:
- Fix: `npx supabase db query --linked "UPDATE profiles SET username = '' WHERE username LIKE 'user_%';"`

**Click tracking not working**: 
- Added onClick handler in `public-profile.tsx:160-173` to increment clicks in Supabase

**Profile not found errors (406)**:
- Fix: Use `.maybeSingle()` instead of `.single()` in Supabase queries

## Database Commands
```bash
npx supabase db query --linked "SELECT * FROM profiles;"        # View profiles
npx supabase db query --linked "UPDATE profiles SET username = '' WHERE username = '';"  # Reset usernames
```