# Muchnik Elder Law — SEO Intelligence Platform

## Project Overview

A dual-portal SEO tracking and analytics platform for a multi-location elder law practice. The platform serves two audiences:

1. **Admin Dashboard** — Full-featured SEO intelligence for the marketing agency (internal use)
2. **Client Portal** — Simplified, visually digestible performance view for the attorney (Kirill Muchnik)

## Business Context

**Client:** Muchnik Elder Law  
**Practice Areas:** Elder law, estate planning, Medicaid planning, guardianship, asset protection  
**Service Locations (3):**

| Location | Address | Radius | Market Character |
|----------|---------|--------|-----------------|
| Manhattan (Financial District) | 11 Broadway, Suite 615, New York, NY 10004 | ~5 miles | Dense urban, high-net-worth, estate tax & asset protection focus |
| Staten Island | 900 South Avenue, Executive Suites, Staten Island, NY 10314 | ~10-15 miles | Suburban bridge market between NY and NJ |
| Morris County (Randolph, NJ) | 10 W. Hanover Avenue, Suite 111, Randolph, NJ 07869 | ~15-20 miles | Suburban NJ, community-focused, Medicaid & LTC planning |

**Key Competitors to Track:**
- Manhattan: Littman Krooks, Morgan Legal Group, Ettinger Law Firm
- Morris County: Goldberg Law Group, Macri & Associates
- Staten Island: Research and identify top 3 competitors during setup

**Monthly Recurring SEO Budget:** $1,250/month (SEO + Video Content)

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 15 (App Router) | Separate repo from client website |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS 4 | Custom design system — NOT generic |
| Components | shadcn/ui | Customized with liquid glass aesthetic |
| Charts | Recharts | Primary charting — clean, composable |
| Database | NeonDB (PostgreSQL) | Serverless Postgres |
| ORM | Drizzle ORM | Type-safe, lightweight |
| Auth | NextAuth.js v5 (Auth.js) | Two roles: admin, client |
| Deployment | Vercel | Separate project from website |
| Storage | Vercel Blob | Report exports, PDF snapshots |
| Cron | Vercel Cron Functions | Scheduled data collection |

## External API Integrations

| API | Purpose | Cost |
|-----|---------|------|
| Google Search Console | Keyword rankings, impressions, clicks, CTR | Free |
| Google Business Profile | Local metrics per location (views, calls, directions) | Free |
| DataForSEO | SERP tracking, competitor monitoring, local pack positions | ~$50-80/month |
| Fathom Analytics | Website traffic (privacy-focused) | Already paid |
| YouTube Data API v3 | Video performance metrics | Free |
| Bunny.net | Video hosting stats | Already paid |

## Repository Structure

```
muchnik-seo-platform/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── keywords/
│   │   │   │   └── page.tsx
│   │   │   ├── content/
│   │   │   │   └── page.tsx
│   │   │   ├── competitors/
│   │   │   │   └── page.tsx
│   │   │   ├── technical/
│   │   │   │   └── page.tsx
│   │   │   ├── locations/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (portal)/
│   │   │   ├── overview/
│   │   │   │   └── page.tsx
│   │   │   ├── locations/
│   │   │   │   └── page.tsx
│   │   │   ├── content/
│   │   │   │   └── page.tsx
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── cron/
│   │   │   │   ├── collect-gsc/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── collect-gbp/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── collect-rankings/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── collect-fathom/
│   │   │   │   │   └── route.ts
│   │   │   │   └── collect-videos/
│   │   │   │       └── route.ts
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── reports/
│   │   │       └── generate/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Redirect to login or dashboard
│   ├── components/
│   │   ├── ui/                         # shadcn/ui (customized)
│   │   ├── charts/                     # Reusable chart components
│   │   │   ├── RankingTrend.tsx
│   │   │   ├── TrafficOverview.tsx
│   │   │   ├── LocationComparison.tsx
│   │   │   ├── KeywordDistribution.tsx
│   │   │   ├── CompetitorRadar.tsx
│   │   │   └── HealthScore.tsx
│   │   ├── admin/                      # Admin-specific components
│   │   ├── portal/                     # Client portal components
│   │   └── shared/                     # Shared components
│   │       ├── LocationCard.tsx
│   │       ├── MetricCard.tsx
│   │       ├── TrendIndicator.tsx
│   │       └── DateRangePicker.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts              # Drizzle schema
│   │   │   ├── index.ts               # DB connection
│   │   │   └── migrations/
│   │   ├── api/
│   │   │   ├── google-search-console.ts
│   │   │   ├── google-business.ts
│   │   │   ├── dataforseo.ts
│   │   │   ├── fathom.ts
│   │   │   ├── youtube.ts
│   │   │   └── bunny.ts
│   │   ├── auth.ts                    # Auth configuration
│   │   ├── utils.ts
│   │   └── constants.ts               # Locations, keywords, config
│   ├── hooks/
│   │   ├── useLocationData.ts
│   │   ├── useKeywordRankings.ts
│   │   └── useDateRange.ts
│   └── types/
│       └── index.ts
├── public/
│   └── fonts/                          # Custom fonts
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── .env.local                          # API keys (never committed)
├── .env.example                        # Template for env vars
├── vercel.json                         # Cron job configuration
└── package.json
```

## Build Order (Recommended Phases)

**Phase 1:** Project scaffold, auth, database schema, design system  
**Phase 2:** Data pipeline — API integrations and cron jobs  
**Phase 3:** Admin dashboard — all views and charts  
**Phase 4:** Client portal — simplified views  
**Phase 5:** Report generation, alerts, goal tracking  
**Phase 6:** Polish, testing, deployment

## Related Documentation

Read these files in order before starting:

1. `00_PROJECT_OVERVIEW.md` — You are here
2. `01_SETUP_AND_ENV.md` — Environment variables, API key setup instructions
3. `02_DATABASE_SCHEMA.md` — Full NeonDB/Drizzle schema
4. `03_DESIGN_SYSTEM.md` — Visual design language, colors, typography, component customization
5. `04_ADMIN_DASHBOARD.md` — Internal dashboard feature specs
6. `05_CLIENT_PORTAL.md` — Client-facing portal feature specs
7. `06_DATA_PIPELINE.md` — API integrations, cron jobs, data flow architecture
8. `07_AUTH_AND_SECURITY.md` — Authentication, roles, route protection
