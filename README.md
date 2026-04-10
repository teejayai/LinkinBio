# LinkNest

Local-first scaffold for a link-in-bio product built from the provided PRD.

## Included

- Next.js App Router + TypeScript + Tailwind CSS
- shadcn-style UI primitives
- Landing page at `/`
- Creator studio at `/studio`
- Public profile route at `/{username}`
- Local persistence with `localStorage`
- Simulated link click and visit analytics
- Theme presets and mobile-first preview

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes

- This v1 uses browser-local mock data to match the PRD.
- The public username page reads the same local state, so it works as a prototype in the same browser.
- A production version would replace `lib/storage.ts` with a real database and server-side analytics pipeline.
