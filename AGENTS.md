# LinkNest - AI Agent Guidelines

## Project Overview
LinkNest is a Next.js link-in-bio application for creators with local-first storage, theme customization, and simulated analytics.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + CSS variables
- **Components**: shadcn/ui patterns (CVA)
- **State**: React hooks (useState/useEffect)
- **Storage**: LocalStorage via `lib/storage.ts`
- **Icons**: Lucide React

## Key Files
```
app/
  page.tsx           # Landing page
  studio/page.tsx    # Dashboard
  [username]/page.tsx # Public profile
components/
  studio-shell.tsx   # Main dashboard component
  public-profile.tsx # Public profile display
lib/
  types.ts           # TypeScript types
  storage.ts         # LocalStorage persistence
  mock-data.ts       # Default data & themes
  utils.ts           # Utility functions (cn helper)
```

## Design System
- **Fonts**: Cormorant Garamond (headlines), DM Sans (body), JetBrains Mono (code)
- **Colors**: Warm cream background, terracotta accent (#c45d3e)
- **Animations**: CSS fade/scale transitions, staggered reveals

## Commands
```bash
npm run dev    # Development server
npm run build  # Production build
```

## Design Guidelines
When implementing UI changes, follow the Neo-Editorial aesthetic:
- Use serif fonts for headlines (font-serif class)
- Warm, paper-like backgrounds
- Terracotta/burnt orange accents
- Grain texture overlay
- Staggered entrance animations
- Hover lift effects on cards

## Adding New Features
1. Define types in `lib/types.ts`
2. Add storage logic in `lib/storage.ts`
3. Create components with client directive ("use client")
4. Follow existing patterns for consistency
