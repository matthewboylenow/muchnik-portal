# Data Pipeline — API Integrations & Cron Jobs

## Architecture Overview

Data flows into the platform via scheduled cron jobs that hit external APIs and store results in NeonDB. Each cron job is a Vercel Serverless Function triggered by Vercel Cron.

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────┐
│ External APIs    │────▶│ Cron Functions    │────▶│ NeonDB   │
│ (GSC, GBP, etc) │     │ /api/cron/*       │     │ Tables   │
└─────────────────┘     └──────────────────┘     └──────────┘
                                                       │
                                                       ▼
                                              ┌──────────────┐
                                              │ Dashboard UI  │
                                              │ (SSR + Client)│
                                              └──────────────┘
```

**Critical:** All cron endpoints must verify the `CRON_SECRET` header to prevent unauthorized access:

```typescript
// src/app/api/cron/utils.ts
export function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}
```

Vercel automatically sends this header for configured cron jobs.

---

## Integration 1: Google Search Console

**File:** `src/lib/api/google-search-console.ts`  
**Cron:** `/api/cron/collect-gsc` — Daily at 6 AM UTC  
**Table:** `searchConsoleData`

### Authentication

Uses OAuth2 with a stored refresh token (no user interaction needed after initial setup):

```typescript
import { google } from 'googleapis';

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

auth.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const searchConsole = google.searchconsole({ version: 'v1', auth });
```

### Data Collection Logic

GSC data has a ~2-3 day lag. Always fetch data for 3 days ago.

```typescript
// Query for each location's URL patterns
const locationUrlPatterns = {
  manhattan: '/manhattan/',      // or whatever the URL structure is
  'staten-island': '/staten-island/',
  'morris-county': '/new-jersey/',
};

// For each location, query GSC:
const response = await searchConsole.searchanalytics.query({
  siteUrl: process.env.GSC_SITE_URL,
  requestBody: {
    startDate: '2026-02-09',  // 3 days ago
    endDate: '2026-02-09',
    dimensions: ['query', 'page'],
    dimensionFilterGroups: [{
      filters: [{
        dimension: 'page',
        operator: 'contains',
        expression: locationUrlPatterns[locationSlug],
      }],
    }],
    rowLimit: 1000,
  },
});

// Store each row: query, page, clicks, impressions, ctr, position
// Map page URL to locationId based on URL pattern
```

### What to Store

For each row returned:
- `query` — the search term
- `page` — the URL that appeared
- `clicks`, `impressions`, `ctr`, `position` — directly from API
- `locationId` — map from the page URL pattern to our locations table

---

## Integration 2: Google Business Profile

**File:** `src/lib/api/google-business.ts`  
**Cron:** `/api/cron/collect-gbp` — Daily at 7 AM UTC  
**Table:** `gbpMetrics`

### Authentication

Same OAuth2 credentials as GSC.

```typescript
import { google } from 'googleapis';

const mybusiness = google.mybusinessbusinessinformation({ version: 'v1', auth });
```

### Data Collection

**Note:** The Google Business Profile API has changed significantly. As of 2025, the Business Profile Performance API is the correct endpoint for metrics:

```typescript
// Use the Business Profile Performance API
// Endpoint: https://businessprofileperformance.googleapis.com/v1/

// Fetch daily metrics for each location
// Metrics available:
// - QUERIES_DIRECT, QUERIES_INDIRECT (discovery)
// - BUSINESS_IMPRESSIONS_DESKTOP_MAPS, BUSINESS_IMPRESSIONS_DESKTOP_SEARCH
// - BUSINESS_IMPRESSIONS_MOBILE_MAPS, BUSINESS_IMPRESSIONS_MOBILE_SEARCH
// - CALL_CLICKS, WEBSITE_CLICKS, BUSINESS_DIRECTION_REQUESTS

// For each location:
const locationName = `locations/${gbpLocationId}`;
const metrics = await fetch(
  `https://businessprofileperformance.googleapis.com/v1/${locationName}:getDailyMetricsTimeSeries?dailyMetric=QUERIES_DIRECT&dailyMetric=QUERIES_INDIRECT&dailyMetric=CALL_CLICKS&dailyMetric=WEBSITE_CLICKS&dailyMetric=BUSINESS_DIRECTION_REQUESTS&dailyRange.startDate.year=2026&dailyRange.startDate.month=2&dailyRange.startDate.day=9&dailyRange.endDate.year=2026&dailyRange.endDate.month=2&dailyRange.endDate.day=9`,
  { headers: { Authorization: `Bearer ${accessToken}` } }
);
```

**Important:** The GBP API is in flux. Claude Code should check the latest Google documentation when implementing. The core data points to capture:
- Direct vs. discovery searches
- Views on Maps vs. Search
- Actions: website clicks, phone calls, direction requests
- Photo views

Store one row per location per day in `gbpMetrics`.

---

## Integration 3: DataForSEO — Rank Tracking

**File:** `src/lib/api/dataforseo.ts`  
**Cron:** `/api/cron/collect-rankings` — Weekly on Mondays at 8 AM UTC  
**Tables:** `keywordRankings`, `competitorRankings`

### Authentication

DataForSEO uses HTTP Basic Auth:

```typescript
const credentials = Buffer.from(
  `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
).toString('base64');

const headers = {
  'Authorization': `Basic ${credentials}`,
  'Content-Type': 'application/json',
};
```

### SERP API — Keyword Position Tracking

For each keyword, check its position in Google results for the specified location:

```typescript
// POST https://api.dataforseo.com/v3/serp/google/organic/live/regular

const tasks = keywords.map((kw) => ({
  keyword: kw.keyword,
  location_code: getLocationCode(kw.locationSlug),
  language_code: 'en',
  device: 'desktop',
  os: 'windows',
  depth: 100,  // Check top 100 results
}));

// Location codes for our markets:
// Manhattan/NYC area: 1023191 (New York, NY)
// Staten Island: 1023191 (same metro, or use 9073488 for more specific)
// Morris County/Randolph NJ: 1022412 (Morristown, NJ is nearest) or use GPS coordinates

// IMPORTANT: DataForSEO charges per task. Bundle efficiently.
// Send up to 100 tasks per POST request to minimize API calls.
```

### Parsing SERP Results

For each keyword result:
1. Find `muchnikelderlaw.com` in organic results → store `position` and `url`
2. Check `local_pack` results → if present, find our listing → store `localPackPosition`
3. Check if we have a `featured_snippet` → store boolean
4. For each tracked competitor, find their domain in results → store in `competitorRankings`

```typescript
// Pseudocode for result parsing
for (const result of serpResults) {
  // Our ranking
  const ourResult = result.items?.find(item => 
    item.url?.includes('muchnikelderlaw.com')
  );
  
  // Local pack
  const localPack = result.items?.find(item => 
    item.type === 'local_pack'
  );
  const ourLocalPackEntry = localPack?.items?.find(entry =>
    entry.domain?.includes('muchnikelderlaw.com')
  );
  
  // Store keyword ranking
  await db.insert(keywordRankings).values({
    keywordId: keyword.id,
    locationId: keyword.locationId,
    recordedDate: today,
    position: ourResult?.rank_absolute || null,
    url: ourResult?.url || null,
    localPackPosition: ourLocalPackEntry?.rank_in_group || null,
    featuredSnippet: ourResult?.is_featured_snippet || false,
  });
  
  // Store competitor rankings
  for (const competitor of competitors) {
    const compResult = result.items?.find(item =>
      item.url?.includes(competitor.domain)
    );
    if (compResult) {
      await db.insert(competitorRankings).values({
        competitorId: competitor.id,
        keywordId: keyword.id,
        recordedDate: today,
        position: compResult.rank_absolute,
        url: compResult.url,
      });
    }
  }
}
```

### Cost Optimization

- ~150 keywords × $0.01/task = ~$1.50 per weekly check
- Monthly cost: ~$6-8 for rank tracking alone
- Run weekly (Mondays) — daily rank checks are unnecessary and expensive
- Batch all keywords into minimum API calls (100 per request)
- Store `previous_position` by querying last week's data before inserting new data

---

## Integration 4: Fathom Analytics

**File:** `src/lib/api/fathom.ts`  
**Cron:** `/api/cron/collect-fathom` — Daily at 9 AM UTC  
**Table:** `trafficData`

### Authentication

```typescript
const headers = {
  'Authorization': `Bearer ${process.env.FATHOM_API_KEY}`,
};
```

### Data Collection

```typescript
// Fathom API v1
// GET https://api.usefathom.com/v1/aggregations

// Sitewide traffic
const sitewide = await fetch(
  `https://api.usefathom.com/v1/aggregations?entity_id=${SITE_ID}&entity=pageview&aggregates=visits,uniques,avg_duration,bounce_rate&date_from=${yesterday}&date_to=${yesterday}`,
  { headers }
);

// Per-location traffic (filter by URL path)
const locationPaths = {
  manhattan: '/manhattan',
  'staten-island': '/staten-island',
  'morris-county': '/new-jersey',
};

for (const [slug, path] of Object.entries(locationPaths)) {
  const locationData = await fetch(
    `https://api.usefathom.com/v1/aggregations?entity_id=${SITE_ID}&entity=pageview&aggregates=visits,uniques,avg_duration,bounce_rate&date_from=${yesterday}&date_to=${yesterday}&filters=[{"property":"pathname","operator":"is like","value":"${path}*"}]`,
    { headers }
  );
  // Store in trafficData with locationId
}

// Top pages
const topPages = await fetch(
  `https://api.usefathom.com/v1/aggregations?entity_id=${SITE_ID}&entity=pageview&aggregates=visits&field_grouping=pathname&date_from=${yesterday}&date_to=${yesterday}&sort_by=visits:desc&limit=20`,
  { headers }
);
// Store as JSONB in trafficData.topPages
```

### What to Store

One row per location per day + one sitewide row (locationId = null):
- `pageviews`, `uniqueVisitors`, `avgDuration`, `bounceRate`
- `topPages` (JSONB array of {path, views})
- `topReferrers` (JSONB array of {source, visits})

---

## Integration 5: YouTube Data API

**File:** `src/lib/api/youtube.ts`  
**Cron:** `/api/cron/collect-videos` — Weekly on Mondays at 10 AM UTC  
**Table:** `videoMetrics`

### Authentication

```typescript
// YouTube uses a simple API key (not OAuth)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
```

### Data Collection

```typescript
// Step 1: Get all videos from channel
const channelVideos = await fetch(
  `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=id&type=video&order=date&maxResults=50`
);

// Step 2: Get statistics for each video
const videoIds = channelVideos.items.map(v => v.id.videoId).join(',');
const videoStats = await fetch(
  `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=statistics,contentDetails`
);

// Step 3: Store metrics per video
for (const video of videoStats.items) {
  await db.insert(videoMetrics).values({
    contentId: mapVideoToContent(video.id), // Match to content_pieces
    platform: 'youtube',
    externalId: video.id,
    recordedDate: today,
    views: parseInt(video.statistics.viewCount),
    likes: parseInt(video.statistics.likeCount),
    comments: parseInt(video.statistics.commentCount),
  });
}
```

---

## Integration 6: Bunny.net Stream

**File:** `src/lib/api/bunny.ts`  
**Cron:** Runs alongside YouTube collection  
**Table:** `videoMetrics`

### Authentication

```typescript
const headers = {
  'AccessKey': process.env.BUNNY_API_KEY,
};
```

### Data Collection

```typescript
// Get video list from library
const videos = await fetch(
  `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos?page=1&itemsPerPage=100`,
  { headers }
);

// Each video has: views, averageWatchTime
for (const video of videos.items) {
  await db.insert(videoMetrics).values({
    contentId: mapBunnyToContent(video.guid),
    platform: 'bunny',
    externalId: video.guid,
    recordedDate: today,
    views: video.views,
    avgViewDuration: video.averageWatchTime,
  });
}
```

---

## Alert Generation

Run after each data collection cron job. Check for notable changes and create alerts:

```typescript
// src/lib/alerts.ts

export async function generateAlerts() {
  // 1. Rank drops > 5 positions
  const significantDrops = await findRankDrops(5);
  for (const drop of significantDrops) {
    await createAlert({
      title: `Rank drop: "${drop.keyword}"`,
      message: `${drop.locationName}: "${drop.keyword}" dropped from #${drop.previousPosition} to #${drop.currentPosition}`,
      severity: drop.currentPosition > 20 ? 'critical' : 'warning',
      locationId: drop.locationId,
      relatedKeywordId: drop.keywordId,
      visibleToClient: false,  // Don't worry the client
    });
  }

  // 2. Rank improvements > 5 positions
  const significantGains = await findRankGains(5);
  for (const gain of significantGains) {
    await createAlert({
      title: `Rank improvement: "${gain.keyword}"`,
      message: `${gain.locationName}: "${gain.keyword}" improved from #${gain.previousPosition} to #${gain.currentPosition}`,
      severity: 'info',
      locationId: gain.locationId,
      relatedKeywordId: gain.keywordId,
      visibleToClient: true,  // Celebrate with client!
    });
  }

  // 3. New first page rankings
  const newFirstPage = await findNewFirstPageRankings();
  // visibleToClient: true

  // 4. Lost first page rankings
  const lostFirstPage = await findLostFirstPageRankings();
  // visibleToClient: false

  // 5. New reviews detected (compare review count)
  // visibleToClient: true for positive reviews

  // 6. GBP action spikes (> 50% increase vs 30-day average)
  // visibleToClient: true

  // 7. Competitor movements (they entered top 3 for our keywords)
  // visibleToClient: false

  // 8. Traffic anomalies (> 30% drop vs 7-day average)
  // visibleToClient: false
}
```

---

## Monthly Summary Generation

**Cron:** 1st of each month at 12 PM UTC (add to vercel.json)

Queries the past month's data and generates a plain-English summary for the client portal:

```typescript
export async function generateMonthlySummary(month: Date) {
  const data = await getMonthlyAggregates(month);
  
  // Compute per-location summaries
  for (const location of locations) {
    const metrics = {
      trafficChange: calculatePercentChange(data.traffic, previousMonth),
      avgRankChange: calculateAvgRankDelta(data.rankings),
      gbpActionsTotal: sumGbpActions(data.gbp),
      newReviews: countNewReviews(data.reviews),
      avgRating: calculateAvgRating(data.reviews),
      topKeyword: findBestRankingKeyword(data.rankings),
      biggestWin: findLargestRankImprovement(data.rankings),
    };

    // Generate natural language summary
    const summaryText = buildSummaryText(location, metrics);
    
    await db.insert(monthlySummaries).values({
      locationId: location.id,
      month: startOfMonth,
      summaryText,
      metrics,
      highlights: extractHighlights(metrics),
      recommendations: generateRecommendations(metrics),
    });
  }
  
  // Generate overall summary (locationId = null)
  // ...
}
```

---

## Error Handling & Resilience

Every cron job should:

1. **Log start/end times** for debugging
2. **Catch and log API errors** without crashing the entire job
3. **Retry failed API calls** up to 3 times with exponential backoff
4. **Store partial results** — if one location fails, still save the others
5. **Create an alert** on repeated failures: "GSC data collection failed for 3 consecutive days"
6. **Respect rate limits** — especially DataForSEO (check headers for remaining quota)

```typescript
// Standard cron job wrapper
export async function cronHandler(
  request: Request,
  collectorFn: () => Promise<void>,
  jobName: string
) {
  if (!verifyCronSecret(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  try {
    await collectorFn();
    console.log(`[${jobName}] Completed in ${Date.now() - startTime}ms`);
    return Response.json({ success: true, duration: Date.now() - startTime });
  } catch (error) {
    console.error(`[${jobName}] Failed:`, error);
    await createAlert({
      title: `Data collection failed: ${jobName}`,
      message: error instanceof Error ? error.message : 'Unknown error',
      severity: 'critical',
      visibleToClient: false,
    });
    return Response.json({ error: 'Collection failed' }, { status: 500 });
  }
}
```

---

## Data Retention

- **Keyword rankings:** Keep indefinitely (small rows, valuable history)
- **GSC data:** Keep 12 months rolling (can be large volume)
- **GBP metrics:** Keep indefinitely
- **Traffic data:** Keep 12 months rolling
- **Video metrics:** Keep indefinitely
- **Alerts:** Keep 6 months, auto-dismiss old ones

Implement a monthly cleanup cron that purges data beyond retention windows.
