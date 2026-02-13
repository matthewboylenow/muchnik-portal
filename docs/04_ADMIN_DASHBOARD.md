# Admin Dashboard — Feature Specifications

## Overview

The admin dashboard is the agency's internal SEO command center. It shows everything: keyword rankings, traffic, competitor intelligence, content performance, technical health, and client reporting tools. Only users with `role: admin` can access routes under `/(admin)/`.

## Global Controls (Present on Every Page)

### Date Range Picker
- Default: Last 30 days
- Presets: 7d, 30d, 90d, 6m, 12m, Custom
- Affects all data on the current page
- Persisted in URL params for shareable views
- Uses shadcn Calendar component (customized with glass styling)

### Location Filter
- Dropdown or segmented control with 3 locations + "All"
- Each location option shows its colored dot indicator
- Default: "All" (shows combined or comparative data)
- When a specific location is selected, the page accent shifts to that location's color

## Page: Dashboard (`/admin/dashboard`)

The overview page. At a glance, understand the health of all 3 locations.

### Top Row — Health Scores (3 cards)

One `LocationCard` per location. Each shows:
- **SEO Health Score:** 0-100, displayed as a radial progress circle with location color. Computed from: average keyword position trend (40%), traffic trend (25%), GBP engagement (20%), review velocity (15%)
- **Key Metrics Grid (2x2):**
  - Avg keyword position (with trend arrow)
  - Organic traffic this period (with % change)
  - GBP actions (total: calls + directions + website clicks)
  - Reviews count + avg rating
- Click any card → navigates to `/admin/locations/[slug]`

### Middle Row — Keyword Rankings Overview

**Chart: Multi-Location Rank Trend** (large, full-width)
- Line chart showing average keyword position over time for all 3 locations
- Y-axis inverted (1 at top, 100 at bottom) — lower position = higher on chart
- 3 lines, one per location, using location colors
- Area fill under each line (gradient, subtle)
- Hover tooltip shows exact position per location on that date

**Quick Stats Bar** (below chart):
- Total keywords tracked: [number]
- Keywords in Top 3: [number] ([% change])
- Keywords in Top 10: [number] ([% change])
- Keywords improved: [number] | Declined: [number] | Unchanged: [number]

### Bottom Row — Activity Feed + Alerts

**Left Column (60%): Recent Alerts**
- List of alert items, sorted by newest first
- Each alert: severity icon (info/warning/critical) + title + timestamp
- Critical alerts highlighted with subtle red glow border
- Examples: "Manhattan: 'elder law attorney manhattan' dropped from #4 to #12", "New review on Morris County GBP (4 stars)", "Littman Krooks published new blog on Medicaid planning"

**Right Column (40%): Quick Actions**
- Button: "Generate Monthly Report"
- Button: "Run Manual Rank Check"
- Recent content published (last 3 blog posts/videos with dates)
- Upcoming content calendar items (next 2 planned pieces)

---

## Page: Keywords (`/admin/keywords`)

Deep dive into keyword rankings across all locations.

### Keyword Table

Full-featured data table with:

| Column | Type | Notes |
|--------|------|-------|
| Keyword | Text + category badge | Clickable → shows trend chart |
| Location | Location color dot + name | Filterable |
| Current Rank | RankBadge component | Color-coded position |
| Previous Rank | Smaller text | Last check |
| Change | TrendIndicator | Arrows + delta |
| Local Pack | Position or "—" | Map pack presence |
| Search Volume | Number | Monthly est. |
| URL Ranking | Truncated URL | Which page ranks |
| Actions | Icon buttons | View trend, edit, deactivate |

**Features:**
- Sort by any column
- Filter by: location, category, rank range (top 3, top 10, top 20, 20+, not ranking)
- Search/filter by keyword text
- Bulk actions: add to goal tracking, export CSV
- Pagination: 25 per page

### Keyword Trend Modal/Drawer

When clicking a keyword row:
- Slide-out drawer from the right (glass background)
- Line chart showing this keyword's position over time
- If tracked for competitors, overlay competitor lines (dashed)
- Below chart: table of all rank history entries
- "Set Goal" button: set a target position and date
- "View SERP" link: opens DataForSEO SERP preview or Google search

### Add Keywords

- Button opens modal
- Fields: keyword text, location (dropdown), category (dropdown), primary (toggle)
- Bulk add: textarea for pasting multiple keywords (one per line, all assigned to selected location)

---

## Page: Content (`/admin/content`)

Track performance of all blog posts, service pages, and videos.

### Content Table

| Column | Type |
|--------|------|
| Title | Text, clickable |
| Type | Badge (blog, service-page, video, resource) |
| Location | Color dot + name |
| Published | Date |
| Pageviews (period) | Number + trend |
| Avg Time on Page | Duration |
| Form Submissions | Number |
| Target Keyword | Text + current rank |
| Status | Published, Draft, Needs Update |

### Content Detail View

When clicking a content piece:
- Traffic chart over time (area chart)
- Keyword rankings that include this URL
- Engagement metrics: time on page, bounce rate, scroll depth
- Form submission attribution
- If video: embed video metrics (views, completion rate, avg duration)
- "Needs Update" flag if content is older than 6 months and traffic declining

### Content Calendar View

Toggle between table and calendar view:
- Calendar shows published and planned content
- Color-coded by location
- Drag-and-drop to reschedule planned content (stretch goal)
- Based on the 6-month content plan in project docs

---

## Page: Competitors (`/admin/competitors`)

### Competitor Overview

One card per competitor showing:
- Domain name + location association
- Number of overlapping keywords
- Average position vs. our average position
- Recent activity (new content detected, rank changes)

### Head-to-Head Comparison

- Select a competitor from dropdown
- Table showing: keyword | our rank | their rank | gap
- Highlight keywords where they outrank us (red) vs. where we lead (green)
- Chart: radar/spider chart comparing category strengths

### Competitor Alerts Feed

- "Littman Krooks now ranks #2 for 'elder law attorney manhattan'" 
- "Morgan Legal Group published: 'Understanding NY Estate Tax 2025'"
- "Goldberg Law Group gained 3 new Google reviews this week"

---

## Page: Locations (`/admin/locations`)

### Location Overview Grid

3 large `LocationCard` components showing comprehensive metrics per location:
- Google Business Profile metrics (searches, views, actions) with trends
- Top 5 keywords with current positions
- Review summary (count, avg rating, recent review excerpt)
- Citation status (total submitted, NAP consistent %)
- Traffic from Fathom for location-specific pages

### Location Detail (`/admin/locations/[slug]`)

Full deep-dive for a single location:

**Section 1: GBP Performance**
- Line charts: searches over time (direct vs. discovery)
- Bar chart: actions breakdown (website, phone, directions) by week
- Photo views trend

**Section 2: Keyword Performance**
- All keywords for this location with full ranking history
- Category breakdown donut chart
- Keywords in local pack vs. not

**Section 3: Content for This Location**
- All blog posts, service pages, videos targeted at this location
- Performance metrics for each

**Section 4: Reviews**
- All reviews for this location across platforms
- Average rating trend over time
- Response status indicators
- Suggested response drafts (stretch goal: AI-generated via API)

**Section 5: Citations**
- Directory listing table with NAP consistency status
- Last verified dates
- Missing opportunities flagged

---

## Page: Technical (`/admin/technical`)

### Core Web Vitals

- 3 gauge charts: LCP, FID/INP, CLS — one set per location subdirectory
- Color coded: green (good), yellow (needs improvement), red (poor)
- Trend over time for each metric

### Indexing Status

- Total pages indexed vs. submitted
- Recent crawl errors
- Pages with issues (redirect chains, 404s, slow pages)

### Schema Validation

- List of all pages with structured data
- Validation status per page (valid, warnings, errors)
- Last checked date

### Site Performance

- Page load time distribution chart
- Slowest pages table
- Mobile vs. desktop performance comparison

---

## Page: Reports (`/admin/reports`)

### Report Generator

- Select date range
- Select locations to include (all or specific)
- Select sections to include (checkboxes): Rankings, Traffic, GBP, Content, Reviews, Technical, Competitors
- Generate → creates a downloadable PDF report using Vercel Blob storage
- Also generates the plain-English monthly summary for the client portal

### Report History

- List of previously generated reports with download links
- Auto-generated monthly reports (via cron on 1st of each month)

### Goal Management

- Create/edit goals: keyword rank targets, traffic targets, review targets
- Goal progress visualization: progress bars toward target
- Timeline view: when goals were set vs. when achieved/missed
