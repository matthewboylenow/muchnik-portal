# Setup & Environment Configuration

## Prerequisites

- Node.js 18+ (GitHub Codespaces has this)
- pnpm (preferred) or npm
- GitHub account with Codespaces access
- Vercel account
- NeonDB account
- Google Cloud Console account
- DataForSEO account

## Environment Variables

Create `.env.local` with the following. Every variable is required unless marked optional.

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
# Get from: NeonDB dashboard → Connection Details → Connection String

# ============================================
# AUTH
# ============================================
NEXTAUTH_URL="http://localhost:3000"
# Production: https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
# Generate: Run `openssl rand -base64 32` in terminal

# Admin credentials (seed these on first deploy)
ADMIN_EMAIL="matthew@yourdomain.com"
ADMIN_PASSWORD_HASH=""
# Generate hash during setup script

# Client credentials
CLIENT_EMAIL="kmuchnik@muchnikelderlaw.com"
CLIENT_PASSWORD_HASH=""

# ============================================
# GOOGLE APIs
# ============================================
GOOGLE_CLIENT_ID="your-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-oauth-client-secret"
GOOGLE_REFRESH_TOKEN="your-refresh-token"
# Setup instructions below — Section: Google API Setup

# Google Search Console
GSC_SITE_URL="sc-domain:muchnikelderlaw.com"
# or "https://www.muchnikelderlaw.com/"

# Google Business Profile location IDs
GBP_ACCOUNT_ID="accounts/123456789"
GBP_LOCATION_MANHATTAN="locations/manhattan-id"
GBP_LOCATION_STATEN_ISLAND="locations/staten-island-id"
GBP_LOCATION_MORRIS_COUNTY="locations/morris-county-id"

# ============================================
# DataForSEO
# ============================================
DATAFORSEO_LOGIN="your-login-email"
DATAFORSEO_PASSWORD="your-api-password"
# Get from: https://app.dataforseo.com/api-access

# ============================================
# FATHOM ANALYTICS
# ============================================
FATHOM_API_KEY="your-fathom-api-key"
FATHOM_SITE_ID="your-site-id"
# Get from: Fathom dashboard → Settings → API

# ============================================
# YOUTUBE
# ============================================
YOUTUBE_API_KEY="your-youtube-api-key"
YOUTUBE_CHANNEL_ID="your-channel-id"
# Get from: Google Cloud Console → YouTube Data API v3

# ============================================
# BUNNY.NET (optional — if video hosting active)
# ============================================
BUNNY_API_KEY="your-bunny-api-key"
BUNNY_LIBRARY_ID="your-video-library-id"
# Get from: Bunny.net dashboard → API Keys

# ============================================
# VERCEL BLOB (optional — for report exports)
# ============================================
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
# Auto-configured when linking Vercel Blob store

# ============================================
# CRON SECURITY
# ============================================
CRON_SECRET="generate-another-random-secret"
# Used to authenticate cron job API calls
# Generate: Run `openssl rand -base64 32` in terminal

# ============================================
# APP CONFIG
# ============================================
NEXT_PUBLIC_APP_NAME="Muchnik SEO Intelligence"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## API Setup Instructions

### Google Cloud Console (Search Console + GBP + YouTube)

All three Google APIs use the same GCP project. Do this once:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Muchnik SEO Platform"
3. Enable these APIs:
   - **Google Search Console API** (Search Console → search "Search Console API")
   - **My Business Business Information API** (for GBP data)
   - **My Business Account Management API**
   - **YouTube Data API v3**
4. Create OAuth 2.0 credentials:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` and your production URL
   - Download the JSON — this gives you `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
5. Get a refresh token:
   - Use the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Settings gear → Check "Use your own OAuth credentials" → Enter your Client ID and Secret
   - Step 1: Select scopes:
     - `https://www.googleapis.com/auth/webmasters.readonly` (Search Console)
     - `https://www.googleapis.com/auth/business.manage` (GBP)
   - Step 2: Exchange authorization code for tokens
   - Copy the **Refresh Token** — this is `GOOGLE_REFRESH_TOKEN`
6. For YouTube, create a separate **API Key** (not OAuth):
   - APIs & Services → Credentials → Create Credentials → API Key
   - Restrict it to YouTube Data API v3 only
   - This is `YOUTUBE_API_KEY`

### Google Search Console Verification

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Ensure `muchnikelderlaw.com` is verified (domain or URL prefix)
3. The Google account used for OAuth must have access to this property
4. Note the property URL format for `GSC_SITE_URL`

### Google Business Profile Setup

1. Go to [Google Business Profile Manager](https://business.google.com/)
2. Ensure all 3 locations are claimed and verified:
   - 11 Broadway, Suite 615, New York, NY 10004
   - 900 South Avenue, Staten Island, NY 10314
   - 10 W. Hanover Avenue, Suite 111, Randolph, NJ 07869
3. The Google account must be an Owner or Manager of these listings
4. Get location IDs via the API or Business Profile dashboard

### DataForSEO Setup

1. Sign up at [DataForSEO](https://dataforseo.com/)
2. Go to [API Access](https://app.dataforseo.com/api-access)
3. Your login email = `DATAFORSEO_LOGIN`
4. Your API password (NOT your account password) = `DATAFORSEO_PASSWORD`
5. Fund your account — Start with $50. At ~$0.01 per keyword check, tracking 150 keywords weekly costs roughly $24/month
6. APIs we'll use:
   - **SERP API** — for rank tracking
   - **Keywords Data API** — for search volumes
   - **DataForSEO Labs API** — for competitor analysis

### Fathom Analytics API

1. Log into [Fathom Analytics](https://app.usefathom.com/)
2. Go to Settings → API
3. Generate an API key — this is `FATHOM_API_KEY`
4. Your site ID is visible in the dashboard URL or settings — this is `FATHOM_SITE_ID`

### Bunny.net API

1. Log into [Bunny.net](https://bunny.net/)
2. Go to Account → API Keys
3. Copy the API key — this is `BUNNY_API_KEY`
4. Go to Stream → Your Video Library → Settings
5. The Library ID is in the URL — this is `BUNNY_LIBRARY_ID`

## NeonDB Setup

1. Sign up at [Neon](https://neon.tech/)
2. Create a new project: "muchnik-seo-platform"
3. Select the region closest to your Vercel deployment (typically `us-east-1`)
4. Copy the connection string — this is `DATABASE_URL`
5. Enable connection pooling for production (Neon does this via their proxy)

## Vercel Project Setup

1. Create new Vercel project linked to the GitHub repo
2. Framework preset: Next.js
3. Add all environment variables from `.env.local`
4. Set up Vercel Cron Jobs in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/collect-gsc",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/collect-gbp",
      "schedule": "0 7 * * *"
    },
    {
      "path": "/api/cron/collect-rankings",
      "schedule": "0 8 * * 1"
    },
    {
      "path": "/api/cron/collect-fathom",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/collect-videos",
      "schedule": "0 10 * * 1"
    }
  ]
}
```

**Schedule Breakdown:**
- GSC data: Daily at 6 AM UTC (GSC data has ~2 day lag)
- GBP metrics: Daily at 7 AM UTC
- Keyword rankings (DataForSEO): Weekly on Mondays at 8 AM UTC (cost optimization)
- Fathom traffic: Daily at 9 AM UTC
- Video stats: Weekly on Mondays at 10 AM UTC

## Initial Package Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "^5.0.0-beta",
    "drizzle-orm": "^0.36.0",
    "@neondatabase/serverless": "^0.10.0",
    "recharts": "^2.13.0",
    "lucide-react": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "date-fns": "^4.1.0",
    "zod": "^3.23.0",
    "googleapis": "^144.0.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "drizzle-kit": "^0.28.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.4.0"
  }
}
```

## Quickstart Commands

```bash
# Clone and install
git clone <repo-url>
cd muchnik-seo-platform
pnpm install

# Set up environment
cp .env.example .env.local
# Fill in all values per instructions above

# Generate auth secret
openssl rand -base64 32

# Push database schema
pnpm drizzle-kit push

# Seed initial data (locations, users, keyword lists)
pnpm run seed

# Start dev server
pnpm dev
```
