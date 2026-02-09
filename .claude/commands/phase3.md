Phase 3: Infrastructure — Task Runner

Before starting any task:
1. If Phase 2 is uncommitted, commit it first
2. Read `src/lib/supabase.ts` — null-safe client stub to extend
3. Read `src/stores/progressStore.ts` — Zustand persist store to sync
4. Read `src/stores/gameStore.ts` — phase machine

Phase 3 checklist (sequential — dependencies between tasks):
1. Supabase project setup (auth, database, storage) — free tier only
2. Database schema: profiles, progress, games tables with RLS policies
3. Auth flow: parent email/password (Supabase Auth)
4. Progress sync: Zustand persist -> Supabase (offline-first, retry queue)
5. Vercel deployment with Cape Town edge region
6. QR code generation for workbook pages (URL scheme: ?qr=NL-NUM-C5)
7. Offline caching verification (airplane mode test)
8. Signed JWT for premium QR content

Key constraints:
- Static export (`output: 'export'`) = NO API routes. Use Supabase client-side SDK.
- POPIA compliant: explicit consent, data belongs to parents, right to deletion
- Offline-first: games MUST work without Supabase connection at all
- Zustand persist (localStorage) is source of truth; Supabase is sync target
- Supabase free tier limits: 500MB database, 1GB storage, 50K auth users

Ask which task to start with, or suggest starting from task 1.
