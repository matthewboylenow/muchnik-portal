# Database Schema

## Overview

PostgreSQL on NeonDB, managed via Drizzle ORM. The schema is designed for time-series SEO data with efficient querying by location and date range.

## Schema Definition (Drizzle ORM)

Implement this in `src/lib/db/schema.ts`:

```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  jsonb,
  uniqueIndex,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum('user_role', ['admin', 'client']);
export const locationSlugEnum = pgEnum('location_slug', ['manhattan', 'staten-island', 'morris-county']);
export const keywordCategoryEnum = pgEnum('keyword_category', [
  'medicaid-planning',
  'estate-planning',
  'asset-protection',
  'guardianship',
  'elder-law-general',
  'long-term-care',
  'veterans-benefits',
  'trust-administration',
  'probate',
  'special-needs',
]);
export const contentTypeEnum = pgEnum('content_type', ['blog', 'service-page', 'video', 'resource']);
export const alertSeverityEnum = pgEnum('alert_severity', ['info', 'warning', 'critical']);
export const goalStatusEnum = pgEnum('goal_status', ['active', 'achieved', 'missed', 'paused']);

// ============================================
// USERS & AUTH
// ============================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('client'),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// LOCATIONS
// ============================================

export const locations = pgTable('locations', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: locationSlugEnum('slug').notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  shortName: varchar('short_name', { length: 50 }).notNull(),  // "Manhattan", "Staten Island", "Morris County"
  address: varchar('address', { length: 500 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),             // "NY" or "NJ"
  zip: varchar('zip', { length: 10 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  radiusMiles: integer('radius_miles').notNull(),                // 5, 15, 20
  gbpLocationId: varchar('gbp_location_id', { length: 255 }),   // Google Business Profile ID
  marketCharacter: text('market_character'),                      // Description of market type
  colorHex: varchar('color_hex', { length: 7 }).notNull(),      // For charts: each location gets a color
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// KEYWORDS
// ============================================

export const keywords = pgTable('keywords', {
  id: uuid('id').defaultRandom().primaryKey(),
  keyword: varchar('keyword', { length: 500 }).notNull(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  category: keywordCategoryEnum('category').notNull(),
  isPrimary: boolean('is_primary').notNull().default(false),     // Primary vs secondary keyword
  monthlySearchVolume: integer('monthly_search_volume'),
  difficulty: integer('difficulty'),                               // 0-100
  cpcEstimate: decimal('cpc_estimate', { precision: 6, scale: 2 }),
  targetPosition: integer('target_position'),                     // Goal rank
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('keyword_location_idx').on(table.keyword, table.locationId),
  index('keyword_category_idx').on(table.category),
]);

// ============================================
// KEYWORD RANKINGS (time-series)
// ============================================

export const keywordRankings = pgTable('keyword_rankings', {
  id: uuid('id').defaultRandom().primaryKey(),
  keywordId: uuid('keyword_id').references(() => keywords.id).notNull(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  recordedDate: date('recorded_date').notNull(),
  position: integer('position'),                                   // null = not ranking
  previousPosition: integer('previous_position'),
  url: varchar('url', { length: 1000 }),                          // Which page is ranking
  localPackPosition: integer('local_pack_position'),              // Position in map pack (1-3, null = not in pack)
  featuredSnippet: boolean('featured_snippet').default(false),
  searchVolume: integer('search_volume'),                         // Snapshot at time of check
  estimatedTraffic: decimal('estimated_traffic', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('ranking_keyword_date_idx').on(table.keywordId, table.recordedDate),
  index('ranking_location_date_idx').on(table.locationId, table.recordedDate),
  index('ranking_date_idx').on(table.recordedDate),
]);

// ============================================
// COMPETITORS
// ============================================

export const competitors = pgTable('competitors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  domain: varchar('domain', { length: 255 }).notNull(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const competitorRankings = pgTable('competitor_rankings', {
  id: uuid('id').defaultRandom().primaryKey(),
  competitorId: uuid('competitor_id').references(() => competitors.id).notNull(),
  keywordId: uuid('keyword_id').references(() => keywords.id).notNull(),
  recordedDate: date('recorded_date').notNull(),
  position: integer('position'),
  url: varchar('url', { length: 1000 }),
  localPackPosition: integer('local_pack_position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('comp_ranking_idx').on(table.competitorId, table.keywordId, table.recordedDate),
]);

// ============================================
// GOOGLE SEARCH CONSOLE DATA
// ============================================

export const searchConsoleData = pgTable('search_console_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  recordedDate: date('recorded_date').notNull(),
  query: varchar('query', { length: 1000 }).notNull(),
  page: varchar('page', { length: 1000 }).notNull(),
  locationId: uuid('location_id').references(() => locations.id),  // Mapped by page URL
  clicks: integer('clicks').notNull().default(0),
  impressions: integer('impressions').notNull().default(0),
  ctr: decimal('ctr', { precision: 6, scale: 4 }),
  position: decimal('position', { precision: 6, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('gsc_date_query_page_idx').on(table.recordedDate, table.query, table.page),
  index('gsc_date_idx').on(table.recordedDate),
  index('gsc_location_idx').on(table.locationId),
]);

// ============================================
// GOOGLE BUSINESS PROFILE METRICS
// ============================================

export const gbpMetrics = pgTable('gbp_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  recordedDate: date('recorded_date').notNull(),
  searchesTotal: integer('searches_total').default(0),
  searchesDirect: integer('searches_direct').default(0),          // Searched for business name
  searchesDiscovery: integer('searches_discovery').default(0),    // Searched for category/service
  viewsTotal: integer('views_total').default(0),
  viewsMaps: integer('views_maps').default(0),
  viewsSearch: integer('views_search').default(0),
  actionsTotal: integer('actions_total').default(0),
  actionsWebsite: integer('actions_website').default(0),
  actionsPhone: integer('actions_phone').default(0),
  actionsDirections: integer('actions_directions').default(0),
  photosViews: integer('photos_views').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('gbp_location_date_idx').on(table.locationId, table.recordedDate),
]);

// ============================================
// WEBSITE TRAFFIC (from Fathom)
// ============================================

export const trafficData = pgTable('traffic_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  recordedDate: date('recorded_date').notNull(),
  locationId: uuid('location_id').references(() => locations.id), // null = sitewide
  pageviews: integer('pageviews').notNull().default(0),
  uniqueVisitors: integer('unique_visitors').notNull().default(0),
  avgDuration: integer('avg_duration'),                            // seconds
  bounceRate: decimal('bounce_rate', { precision: 5, scale: 2 }),
  topPages: jsonb('top_pages'),                                    // [{path, views}]
  topReferrers: jsonb('top_referrers'),                            // [{source, visits}]
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('traffic_date_location_idx').on(table.recordedDate, table.locationId),
]);

// ============================================
// CONTENT TRACKING
// ============================================

export const contentPieces = pgTable('content_pieces', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull(),
  url: varchar('url', { length: 1000 }).notNull(),
  type: contentTypeEnum('type').notNull(),
  locationId: uuid('location_id').references(() => locations.id),
  targetKeywordId: uuid('target_keyword_id').references(() => keywords.id),
  publishedAt: timestamp('published_at'),
  wordCount: integer('word_count'),
  status: varchar('status', { length: 50 }).notNull().default('published'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contentPerformance = pgTable('content_performance', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentId: uuid('content_id').references(() => contentPieces.id).notNull(),
  recordedDate: date('recorded_date').notNull(),
  pageviews: integer('pageviews').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
  avgTimeOnPage: integer('avg_time_on_page'),                    // seconds
  bounceRate: decimal('bounce_rate', { precision: 5, scale: 2 }),
  formSubmissions: integer('form_submissions').default(0),        // Consultation requests
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('content_perf_idx').on(table.contentId, table.recordedDate),
]);

// ============================================
// VIDEO TRACKING
// ============================================

export const videoMetrics = pgTable('video_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentId: uuid('content_id').references(() => contentPieces.id), // Links to content_pieces
  platform: varchar('platform', { length: 50 }).notNull(),         // 'youtube' | 'bunny'
  externalId: varchar('external_id', { length: 255 }).notNull(),   // YouTube video ID or Bunny GUID
  recordedDate: date('recorded_date').notNull(),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  avgViewDuration: integer('avg_view_duration'),                   // seconds
  completionRate: decimal('completion_rate', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('video_metric_idx').on(table.externalId, table.platform, table.recordedDate),
]);

// ============================================
// REVIEWS
// ============================================

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),        // 'google', 'avvo', 'yelp', etc.
  reviewerName: varchar('reviewer_name', { length: 255 }),
  rating: integer('rating').notNull(),                             // 1-5
  reviewText: text('review_text'),
  reviewDate: date('review_date').notNull(),
  responded: boolean('responded').default(false),
  responseText: text('response_text'),
  externalId: varchar('external_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// CITATIONS / DIRECTORY LISTINGS
// ============================================

export const citations = pgTable('citations', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id').references(() => locations.id).notNull(),
  directoryName: varchar('directory_name', { length: 255 }).notNull(),
  directoryUrl: varchar('directory_url', { length: 1000 }),
  listingUrl: varchar('listing_url', { length: 1000 }),
  napConsistent: boolean('nap_consistent').default(true),         // Name/Address/Phone matches
  submittedAt: date('submitted_at'),
  lastVerifiedAt: date('last_verified_at'),
  status: varchar('status', { length: 50 }).default('active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================
// GOALS & TARGETS
// ============================================

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  locationId: uuid('location_id').references(() => locations.id), // null = sitewide
  keywordId: uuid('keyword_id').references(() => keywords.id),    // For keyword-specific goals
  targetValue: integer('target_value').notNull(),                  // e.g., position 3
  currentValue: integer('current_value'),
  metricType: varchar('metric_type', { length: 100 }).notNull(),  // 'rank', 'traffic', 'reviews', 'conversions'
  targetDate: date('target_date'),
  status: goalStatusEnum('status').notNull().default('active'),
  achievedAt: timestamp('achieved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================
// ALERTS & NOTIFICATIONS
// ============================================

export const alerts = pgTable('alerts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  message: text('message').notNull(),
  severity: alertSeverityEnum('severity').notNull(),
  locationId: uuid('location_id').references(() => locations.id),
  relatedKeywordId: uuid('related_keyword_id').references(() => keywords.id),
  relatedCompetitorId: uuid('related_competitor_id').references(() => competitors.id),
  isRead: boolean('is_read').default(false),
  isDismissed: boolean('is_dismissed').default(false),
  visibleToClient: boolean('visible_to_client').default(false),  // Show in client portal?
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('alert_read_idx').on(table.isRead),
  index('alert_created_idx').on(table.createdAt),
]);

// ============================================
// MONTHLY SUMMARIES (pre-computed for portal)
// ============================================

export const monthlySummaries = pgTable('monthly_summaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  locationId: uuid('location_id').references(() => locations.id),  // null = overall
  month: date('month').notNull(),                                   // First day of month
  summaryText: text('summary_text').notNull(),                     // Plain English summary
  metrics: jsonb('metrics').notNull(),                              // {traffic, rankings, reviews, etc.}
  highlights: jsonb('highlights'),                                  // [{type, message}]
  recommendations: jsonb('recommendations'),                        // [{priority, action}]
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('summary_month_location_idx').on(table.month, table.locationId),
]);

// ============================================
// TECHNICAL SEO AUDITS
// ============================================

export const technicalAudits = pgTable('technical_audits', {
  id: uuid('id').defaultRandom().primaryKey(),
  auditDate: date('audit_date').notNull(),
  coreWebVitals: jsonb('core_web_vitals'),                         // {lcp, fid, cls} per page
  indexingStatus: jsonb('indexing_status'),                         // {indexed, errors, warnings}
  schemaValidation: jsonb('schema_validation'),                    // {valid, errors per page}
  brokenLinks: jsonb('broken_links'),                              // [{url, statusCode}]
  overallScore: integer('overall_score'),                           // 0-100
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

## Seed Data

Create `src/lib/db/seed.ts` to populate the initial locations, keywords, competitors, and users:

### Locations Seed

```typescript
const locationsSeed = [
  {
    slug: 'manhattan',
    name: 'Manhattan - Financial District',
    shortName: 'Manhattan',
    address: '11 Broadway, Suite 615',
    city: 'New York',
    state: 'NY',
    zip: '10004',
    phone: '(212) 597-2427',
    latitude: '40.7054',
    longitude: '-74.0134',
    radiusMiles: 5,
    marketCharacter: 'Dense urban, high-net-worth. Focus on estate tax planning, asset protection, business succession.',
    colorHex: '#6366F1',  // Indigo
  },
  {
    slug: 'staten-island',
    name: 'Staten Island',
    shortName: 'Staten Island',
    address: '900 South Avenue, Executive Suites',
    city: 'Staten Island',
    state: 'NY',
    zip: '10314',
    phone: '(718) 442-7004',
    latitude: '40.5834',
    longitude: '-74.1496',
    radiusMiles: 15,
    marketCharacter: 'Suburban bridge market between NY and NJ. Family-focused elder law and Medicaid planning.',
    colorHex: '#06B6D4',  // Cyan
  },
  {
    slug: 'morris-county',
    name: 'Morris County - Randolph, NJ',
    shortName: 'Morris County',
    address: '10 W. Hanover Avenue, Suite 111',
    city: 'Randolph',
    state: 'NJ',
    zip: '07869',
    phone: '(201) 582-8014',
    latitude: '40.8484',
    longitude: '-74.5765',
    radiusMiles: 20,
    marketCharacter: 'Suburban NJ corridor. Community-focused Medicaid planning, long-term care, guardianship.',
    colorHex: '#10B981',  // Emerald
  },
];
```

### Keywords Seed (initial tracking list — expand as needed)

```typescript
// 15-20 keywords per location, categorized
const keywordsSeed = {
  manhattan: [
    // Primary
    { keyword: 'elder law attorney manhattan', category: 'elder-law-general', isPrimary: true },
    { keyword: 'estate planning attorney nyc', category: 'estate-planning', isPrimary: true },
    { keyword: 'medicaid planning new york', category: 'medicaid-planning', isPrimary: true },
    { keyword: 'asset protection attorney manhattan', category: 'asset-protection', isPrimary: true },
    { keyword: 'estate tax planning new york', category: 'estate-planning', isPrimary: true },
    // Secondary
    { keyword: 'elder law attorney financial district', category: 'elder-law-general', isPrimary: false },
    { keyword: 'medicaid attorney manhattan', category: 'medicaid-planning', isPrimary: false },
    { keyword: 'trust attorney nyc', category: 'trust-administration', isPrimary: false },
    { keyword: 'probate attorney manhattan', category: 'probate', isPrimary: false },
    { keyword: 'guardianship attorney new york', category: 'guardianship', isPrimary: false },
    { keyword: 'business succession planning manhattan', category: 'asset-protection', isPrimary: false },
    { keyword: 'power of attorney lawyer nyc', category: 'estate-planning', isPrimary: false },
    { keyword: 'estate planning attorney financial district', category: 'estate-planning', isPrimary: false },
    { keyword: 'veterans benefits attorney nyc', category: 'veterans-benefits', isPrimary: false },
    { keyword: 'special needs trust attorney new york', category: 'special-needs', isPrimary: false },
  ],
  'staten-island': [
    { keyword: 'elder law attorney staten island', category: 'elder-law-general', isPrimary: true },
    { keyword: 'estate planning attorney staten island', category: 'estate-planning', isPrimary: true },
    { keyword: 'medicaid planning staten island', category: 'medicaid-planning', isPrimary: true },
    { keyword: 'nursing home planning staten island', category: 'long-term-care', isPrimary: true },
    { keyword: 'elder law lawyer staten island ny', category: 'elder-law-general', isPrimary: false },
    { keyword: 'medicaid attorney staten island', category: 'medicaid-planning', isPrimary: false },
    { keyword: 'guardianship attorney staten island', category: 'guardianship', isPrimary: false },
    { keyword: 'trust attorney staten island', category: 'trust-administration', isPrimary: false },
    { keyword: 'probate lawyer staten island', category: 'probate', isPrimary: false },
    { keyword: 'long term care attorney staten island', category: 'long-term-care', isPrimary: false },
    { keyword: 'asset protection staten island', category: 'asset-protection', isPrimary: false },
    { keyword: 'power of attorney staten island ny', category: 'estate-planning', isPrimary: false },
  ],
  'morris-county': [
    { keyword: 'elder law attorney morris county', category: 'elder-law-general', isPrimary: true },
    { keyword: 'medicaid planning randolph nj', category: 'medicaid-planning', isPrimary: true },
    { keyword: 'nursing home planning new jersey', category: 'long-term-care', isPrimary: true },
    { keyword: 'elder law attorney randolph nj', category: 'elder-law-general', isPrimary: true },
    { keyword: 'estate planning morris county nj', category: 'estate-planning', isPrimary: true },
    { keyword: 'guardianship attorney morris county', category: 'guardianship', isPrimary: false },
    { keyword: 'medicaid attorney morristown nj', category: 'medicaid-planning', isPrimary: false },
    { keyword: 'elder law parsippany nj', category: 'elder-law-general', isPrimary: false },
    { keyword: 'long term care planning morris county', category: 'long-term-care', isPrimary: false },
    { keyword: 'protect home from nursing home nj', category: 'medicaid-planning', isPrimary: false },
    { keyword: 'elder law attorney denville nj', category: 'elder-law-general', isPrimary: false },
    { keyword: 'estate planning attorney randolph nj', category: 'estate-planning', isPrimary: false },
    { keyword: 'nj medicaid application help', category: 'medicaid-planning', isPrimary: false },
    { keyword: 'assisted living costs morris county', category: 'long-term-care', isPrimary: false },
    { keyword: 'special needs trust nj', category: 'special-needs', isPrimary: false },
  ],
};
```

### Competitors Seed

```typescript
const competitorsSeed = [
  // Manhattan
  { name: 'Littman Krooks LLP', domain: 'littmankrooks.com', location: 'manhattan' },
  { name: 'Morgan Legal Group', domain: 'morganlegalny.com', location: 'manhattan' },
  { name: 'Ettinger Law Firm', domain: 'trustsestateslaw.com', location: 'manhattan' },
  // Morris County
  { name: 'Goldberg Law Group', domain: 'goldberglawgroup.com', location: 'morris-county' },
  { name: 'Macri & Associates', domain: 'macrilaw.com', location: 'morris-county' },
  // Staten Island — identify during initial research
  // Placeholder for now
];
```

## Key Queries to Optimize For

The app will frequently run these query patterns — ensure proper indexes:

1. **Rankings over time for a location:** Filter by `locationId` + date range, ordered by date
2. **Current position for all keywords in a location:** Latest `recordedDate` grouped by keyword
3. **Location comparison:** Same keyword across all 3 locations
4. **Competitor vs. us:** Join keyword_rankings with competitor_rankings on keyword + date
5. **Monthly aggregates:** GROUP BY month for traffic, GBP metrics, rankings improvement
6. **Content performance attribution:** Join content_pieces → content_performance → form submissions
