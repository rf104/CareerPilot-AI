# CareerPilot AI — Codebase Analysis & Roadmap

_Analysis date: 2026-09-29 · Branch: `master` · ~5,700 lines of JS/JSX/CSS_

## 1. Summary

CareerPilot AI is a **frontend-only prototype** built with Next.js 16 (App Router), React 19 and Tailwind CSS 4. It has a polished glass-morphism UI, a marketing landing page, auth screens, and a full dashboard. **Nothing is real yet.** There is no backend, no database and no AI. Every feature is backed by `localStorage` and seed data in `app/lib/mockData.js`.

## 2. Current Notable Work

| Area | Route / File | Status |
|---|---|---|
| Landing page | `app/page.js` + `components/*Section.jsx` (Hero, Features, HowItWorks, Stats, Testimonials, CTA, Navbar, Footer) | Complete (static marketing) |
| Auth UI | `(auth)/login`, `(auth)/register`, `lib/useAuth.js` | UI and validation done. Auth is mocked: any credentials are accepted and the user is stored in `localStorage` |
| Dashboard shell | `(dashboard)/layout.js`, `Sidebar.jsx`, `TopBar.jsx` | Done: collapsible sidebar, responsive, auth guard, user menu |
| Dashboard home | `(dashboard)/dashboard` | Done: greeting, animated stat cards, quick actions, recent applications |
| Resume manager | `(dashboard)/resume` | UI done: drag-and-drop, progress bar, list, detail view. **Upload is faked**: the file is never read, and every upload gets the same hard-coded skills (`MOCK_UPLOAD_SKILLS`) |
| Application tracker | `(dashboard)/applications` | Most complete feature: full CRUD, status filter chips, search, table/card toggle, persisted in `localStorage` |
| AI match | `(dashboard)/ai-match` | UI done: score ring, breakdown bars, matched/missing skills, recommendations. **Result is fake**: a 2.5s delay, then `MOCK_AI_MATCH` with ±5 random noise |
| Interview coach | `(dashboard)/interview-coach` | "Coming soon" placeholder only |
| Settings | `(dashboard)/settings` | UI done. Profile edit works locally. Password change and account deletion are no-ops. Dark mode toggle is cosmetic (theme is always dark) |
| Design system | `app/globals.css` (818 lines) | Solid: glass cards, animations, gradients, progress rings |
| Data layer | `app/lib/mockData.js` | Good seam: CRUD helpers isolate storage from UI, so swapping to an API is feasible |

**Strengths**
- Consistent, high-quality visual design and micro-animations.
- Clean route grouping (`(auth)`, `(dashboard)`).
- A storage abstraction that is easy to replace.
- Minimal dependencies (3 runtime).

**Weaknesses / risks**
- No real auth, so the "protected" routes are protected only client-side.
- Pages are large single files (the applications page is 532 lines, ai-match 471) with inline SVG icons repeated across files.
- Every dashboard page is `"use client"`, and there is no server-side data fetching.
- No tests, TypeScript, linting config, error boundaries, or `loading.js`/`error.js` files.
- Project name in `package.json` is still `careerpilot-temp`.
- Sidebar/layout margin is managed with JS resize events instead of CSS.
- Accessibility has not been audited (modals, focus traps, aria labels, colour contrast on slate-500 text).
- Social login buttons and the global search bar are placeholders.

## 3. What We Should Add

### Priority 1 — Make it real (MVP backend)
1. **Real authentication**: Auth.js (NextAuth), Clerk, or Supabase Auth. Add Google/GitHub OAuth, server-side session checks, and Next.js `middleware.js` route protection.
2. **Database + API**: Postgres (Supabase/Neon) with Prisma or Drizzle. Models: User, Resume, Application, MatchResult. Expose them through Route Handlers or Server Actions, and replace `mockData.js` helpers one by one.
3. **File storage**: S3, Supabase Storage or UploadThing for resume PDFs, with size and type validation.
4. **Real resume parsing**: extract PDF text (`pdf-parse` / `pdfjs-dist`), then use an LLM to return structured JSON (skills, experience, education).
5. **Real AI match**: send the resume and job description to an LLM (Claude API) for a structured score, breakdown, skill gaps and recommendations. Optionally add embeddings for semantic similarity. Cache results per resume/job pair.
6. **Secrets and config**: `.env.example`, environment validation (zod), and rate-limiting on AI endpoints.

### Priority 2 — Complete the product
7. **Interview Coach (V2)**: generate role-specific questions, accept text answers, return AI feedback and scores, and store session history with progress charts.
8. **Kanban board** for applications (drag between status columns), plus follow-up reminders and interview dates.
9. **Resume tools**: multiple versions, tailored-resume suggestions per job, ATS-keyword checker, export to PDF.
10. **Job URL import**: paste a link, then scrape or parse it into the application form.
11. **Cover letter generator** based on resume and job description.
12. **Dashboard analytics**: response rate, funnel chart, applications per week, and skill-gap trends over time (real data instead of static cards).
13. **Working settings**: real password change, account deletion with data purge, email/reminder notifications, and light/dark theme toggle that actually works.
14. **Notifications**: wire up the bell icon (in-app plus email via Resend).

### Priority 3 — Quality & engineering
15. **TypeScript migration** (`jsconfig.json` is already present), plus ESLint and Prettier.
16. **Testing**: Vitest/RTL for components and helpers, Playwright for core flows (register → upload → match → track).
17. **Refactor**: extract shared UI (Modal, Toast, Badge, StatCard, ProgressRing, Icon set) into `components/ui`, and split the large pages into feature components and hooks.
18. **UX states**: `loading.js`, `error.js`, `not-found.js`, empty states, skeletons, and optimistic updates.
19. **Accessibility pass**: keyboard navigation, focus management in modals, aria attributes, contrast fixes, reduced-motion support.
20. **SEO/metadata**: Open Graph tags, sitemap, robots, and a per-page `metadata` export.
21. **CI/CD**: GitHub Actions (lint, test, build) and deployment on Vercel with preview environments.
22. **Observability & privacy**: error tracking (Sentry), analytics, and a privacy policy, terms and data-export/delete flow, since resumes contain personal data.
23. **Housekeeping**: rename the package, add a `LICENSE`, and update the README so it says clearly what is mocked and what is real.

## 4. Suggested Order of Work

1. Rename the package, add `.env.example`, and set up the database schema.
2. Real auth and middleware.
3. Move applications CRUD to the API (lowest risk, the UI is already complete).
4. Resume upload, storage and parsing.
5. LLM-based match analysis.
6. Interview Coach, then the Kanban board and analytics.
7. Tests, CI and accessibility, running in parallel from step 3 onwards.
