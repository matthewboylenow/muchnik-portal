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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum("user_role", ["admin", "client"]);
export const locationSlugEnum = pgEnum("location_slug", [
  "manhattan",
  "staten-island",
  "morris-county",
]);
export const keywordCategoryEnum = pgEnum("keyword_category", [
  "medicaid-planning",
  "estate-planning",
  "asset-protection",
  "guardianship",
  "elder-law-general",
  "long-term-care",
  "veterans-benefits",
  "trust-administration",
  "probate",
  "special-needs",
]);
export const contentTypeEnum = pgEnum("content_type", [
  "blog",
  "service-page",
  "video",
  "resource",
]);
export const alertSeverityEnum = pgEnum("alert_severity", [
  "info",
  "warning",
  "critical",
]);
export const goalStatusEnum = pgEnum("goal_status", [
  "active",
  "achieved",
  "missed",
  "paused",
]);

// ============================================
// USERS & AUTH
// ============================================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("client"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// LOCATIONS
// ============================================

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: locationSlugEnum("slug").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("short_name", { length: 50 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zip: varchar("zip", { length: 10 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  radiusMiles: integer("radius_miles").notNull(),
  gbpLocationId: varchar("gbp_location_id", { length: 255 }),
  marketCharacter: text("market_character"),
  colorHex: varchar("color_hex", { length: 7 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// KEYWORDS
// ============================================

export const keywords = pgTable(
  "keywords",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    keyword: varchar("keyword", { length: 500 }).notNull(),
    locationId: uuid("location_id")
      .references(() => locations.id)
      .notNull(),
    category: keywordCategoryEnum("category").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
    monthlySearchVolume: integer("monthly_search_volume"),
    difficulty: integer("difficulty"),
    cpcEstimate: decimal("cpc_estimate", { precision: 6, scale: 2 }),
    targetPosition: integer("target_position"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("keyword_location_idx").on(table.keyword, table.locationId),
    index("keyword_category_idx").on(table.category),
  ]
);

// ============================================
// KEYWORD RANKINGS (time-series)
// ============================================

export const keywordRankings = pgTable(
  "keyword_rankings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    keywordId: uuid("keyword_id")
      .references(() => keywords.id)
      .notNull(),
    locationId: uuid("location_id")
      .references(() => locations.id)
      .notNull(),
    recordedDate: date("recorded_date").notNull(),
    position: integer("position"),
    previousPosition: integer("previous_position"),
    url: varchar("url", { length: 1000 }),
    localPackPosition: integer("local_pack_position"),
    featuredSnippet: boolean("featured_snippet").default(false),
    searchVolume: integer("search_volume"),
    estimatedTraffic: decimal("estimated_traffic", {
      precision: 10,
      scale: 2,
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("ranking_keyword_date_idx").on(
      table.keywordId,
      table.recordedDate
    ),
    index("ranking_location_date_idx").on(
      table.locationId,
      table.recordedDate
    ),
    index("ranking_date_idx").on(table.recordedDate),
  ]
);

// ============================================
// COMPETITORS
// ============================================

export const competitors = pgTable("competitors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }).notNull(),
  locationId: uuid("location_id")
    .references(() => locations.id)
    .notNull(),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const competitorRankings = pgTable(
  "competitor_rankings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    competitorId: uuid("competitor_id")
      .references(() => competitors.id)
      .notNull(),
    keywordId: uuid("keyword_id")
      .references(() => keywords.id)
      .notNull(),
    recordedDate: date("recorded_date").notNull(),
    position: integer("position"),
    url: varchar("url", { length: 1000 }),
    localPackPosition: integer("local_pack_position"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("comp_ranking_idx").on(
      table.competitorId,
      table.keywordId,
      table.recordedDate
    ),
  ]
);

// ============================================
// GOOGLE SEARCH CONSOLE DATA
// ============================================

export const searchConsoleData = pgTable(
  "search_console_data",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    recordedDate: date("recorded_date").notNull(),
    query: varchar("query", { length: 1000 }).notNull(),
    page: varchar("page", { length: 1000 }).notNull(),
    locationId: uuid("location_id").references(() => locations.id),
    clicks: integer("clicks").notNull().default(0),
    impressions: integer("impressions").notNull().default(0),
    ctr: decimal("ctr", { precision: 6, scale: 4 }),
    position: decimal("position", { precision: 6, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("gsc_date_query_page_idx").on(
      table.recordedDate,
      table.query,
      table.page
    ),
    index("gsc_date_idx").on(table.recordedDate),
    index("gsc_location_idx").on(table.locationId),
  ]
);

// ============================================
// GOOGLE BUSINESS PROFILE METRICS
// ============================================

export const gbpMetrics = pgTable(
  "gbp_metrics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    locationId: uuid("location_id")
      .references(() => locations.id)
      .notNull(),
    recordedDate: date("recorded_date").notNull(),
    searchesTotal: integer("searches_total").default(0),
    searchesDirect: integer("searches_direct").default(0),
    searchesDiscovery: integer("searches_discovery").default(0),
    viewsTotal: integer("views_total").default(0),
    viewsMaps: integer("views_maps").default(0),
    viewsSearch: integer("views_search").default(0),
    actionsTotal: integer("actions_total").default(0),
    actionsWebsite: integer("actions_website").default(0),
    actionsPhone: integer("actions_phone").default(0),
    actionsDirections: integer("actions_directions").default(0),
    photosViews: integer("photos_views").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("gbp_location_date_idx").on(
      table.locationId,
      table.recordedDate
    ),
  ]
);

// ============================================
// WEBSITE TRAFFIC (from Fathom)
// ============================================

export const trafficData = pgTable(
  "traffic_data",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    recordedDate: date("recorded_date").notNull(),
    locationId: uuid("location_id").references(() => locations.id),
    pageviews: integer("pageviews").notNull().default(0),
    uniqueVisitors: integer("unique_visitors").notNull().default(0),
    avgDuration: integer("avg_duration"),
    bounceRate: decimal("bounce_rate", { precision: 5, scale: 2 }),
    topPages: jsonb("top_pages"),
    topReferrers: jsonb("top_referrers"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("traffic_date_location_idx").on(
      table.recordedDate,
      table.locationId
    ),
  ]
);

// ============================================
// CONTENT TRACKING
// ============================================

export const contentPieces = pgTable("content_pieces", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  type: contentTypeEnum("type").notNull(),
  locationId: uuid("location_id").references(() => locations.id),
  targetKeywordId: uuid("target_keyword_id").references(() => keywords.id),
  publishedAt: timestamp("published_at"),
  wordCount: integer("word_count"),
  status: varchar("status", { length: 50 }).notNull().default("published"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contentPerformance = pgTable(
  "content_performance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contentId: uuid("content_id")
      .references(() => contentPieces.id)
      .notNull(),
    recordedDate: date("recorded_date").notNull(),
    pageviews: integer("pageviews").default(0),
    uniqueVisitors: integer("unique_visitors").default(0),
    avgTimeOnPage: integer("avg_time_on_page"),
    bounceRate: decimal("bounce_rate", { precision: 5, scale: 2 }),
    formSubmissions: integer("form_submissions").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("content_perf_idx").on(table.contentId, table.recordedDate),
  ]
);

// ============================================
// VIDEO TRACKING
// ============================================

export const videoMetrics = pgTable(
  "video_metrics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contentId: uuid("content_id").references(() => contentPieces.id),
    platform: varchar("platform", { length: 50 }).notNull(),
    externalId: varchar("external_id", { length: 255 }).notNull(),
    recordedDate: date("recorded_date").notNull(),
    views: integer("views").default(0),
    likes: integer("likes").default(0),
    comments: integer("comments").default(0),
    avgViewDuration: integer("avg_view_duration"),
    completionRate: decimal("completion_rate", { precision: 5, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("video_metric_idx").on(
      table.externalId,
      table.platform,
      table.recordedDate
    ),
  ]
);

// ============================================
// REVIEWS
// ============================================

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationId: uuid("location_id")
    .references(() => locations.id)
    .notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  reviewerName: varchar("reviewer_name", { length: 255 }),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  reviewDate: date("review_date").notNull(),
  responded: boolean("responded").default(false),
  responseText: text("response_text"),
  externalId: varchar("external_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// CITATIONS / DIRECTORY LISTINGS
// ============================================

export const citations = pgTable("citations", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationId: uuid("location_id")
    .references(() => locations.id)
    .notNull(),
  directoryName: varchar("directory_name", { length: 255 }).notNull(),
  directoryUrl: varchar("directory_url", { length: 1000 }),
  listingUrl: varchar("listing_url", { length: 1000 }),
  napConsistent: boolean("nap_consistent").default(true),
  submittedAt: date("submitted_at"),
  lastVerifiedAt: date("last_verified_at"),
  status: varchar("status", { length: 50 }).default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// GOALS & TARGETS
// ============================================

export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  locationId: uuid("location_id").references(() => locations.id),
  keywordId: uuid("keyword_id").references(() => keywords.id),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value"),
  metricType: varchar("metric_type", { length: 100 }).notNull(),
  targetDate: date("target_date"),
  status: goalStatusEnum("status").notNull().default("active"),
  achievedAt: timestamp("achieved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// ALERTS & NOTIFICATIONS
// ============================================

export const alerts = pgTable(
  "alerts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    message: text("message").notNull(),
    severity: alertSeverityEnum("severity").notNull(),
    locationId: uuid("location_id").references(() => locations.id),
    relatedKeywordId: uuid("related_keyword_id").references(() => keywords.id),
    relatedCompetitorId: uuid("related_competitor_id").references(
      () => competitors.id
    ),
    isRead: boolean("is_read").default(false),
    isDismissed: boolean("is_dismissed").default(false),
    visibleToClient: boolean("visible_to_client").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("alert_read_idx").on(table.isRead),
    index("alert_created_idx").on(table.createdAt),
  ]
);

// ============================================
// MONTHLY SUMMARIES (pre-computed for portal)
// ============================================

export const monthlySummaries = pgTable(
  "monthly_summaries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    locationId: uuid("location_id").references(() => locations.id),
    month: date("month").notNull(),
    summaryText: text("summary_text").notNull(),
    metrics: jsonb("metrics").notNull(),
    highlights: jsonb("highlights"),
    recommendations: jsonb("recommendations"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("summary_month_location_idx").on(
      table.month,
      table.locationId
    ),
  ]
);

// ============================================
// TECHNICAL SEO AUDITS
// ============================================

export const technicalAudits = pgTable("technical_audits", {
  id: uuid("id").defaultRandom().primaryKey(),
  auditDate: date("audit_date").notNull(),
  coreWebVitals: jsonb("core_web_vitals"),
  indexingStatus: jsonb("indexing_status"),
  schemaValidation: jsonb("schema_validation"),
  brokenLinks: jsonb("broken_links"),
  overallScore: integer("overall_score"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

export const locationsRelations = relations(locations, ({ many }) => ({
  keywords: many(keywords),
  keywordRankings: many(keywordRankings),
  competitors: many(competitors),
  gbpMetrics: many(gbpMetrics),
  trafficData: many(trafficData),
  reviews: many(reviews),
  citations: many(citations),
  alerts: many(alerts),
}));

export const keywordsRelations = relations(keywords, ({ one, many }) => ({
  location: one(locations, {
    fields: [keywords.locationId],
    references: [locations.id],
  }),
  rankings: many(keywordRankings),
  competitorRankings: many(competitorRankings),
}));

export const keywordRankingsRelations = relations(
  keywordRankings,
  ({ one }) => ({
    keyword: one(keywords, {
      fields: [keywordRankings.keywordId],
      references: [keywords.id],
    }),
    location: one(locations, {
      fields: [keywordRankings.locationId],
      references: [locations.id],
    }),
  })
);

export const competitorsRelations = relations(
  competitors,
  ({ one, many }) => ({
    location: one(locations, {
      fields: [competitors.locationId],
      references: [locations.id],
    }),
    rankings: many(competitorRankings),
  })
);

export const competitorRankingsRelations = relations(
  competitorRankings,
  ({ one }) => ({
    competitor: one(competitors, {
      fields: [competitorRankings.competitorId],
      references: [competitors.id],
    }),
    keyword: one(keywords, {
      fields: [competitorRankings.keywordId],
      references: [keywords.id],
    }),
  })
);

export const contentPiecesRelations = relations(
  contentPieces,
  ({ one, many }) => ({
    location: one(locations, {
      fields: [contentPieces.locationId],
      references: [locations.id],
    }),
    targetKeyword: one(keywords, {
      fields: [contentPieces.targetKeywordId],
      references: [keywords.id],
    }),
    performance: many(contentPerformance),
    videoMetrics: many(videoMetrics),
  })
);

export const contentPerformanceRelations = relations(
  contentPerformance,
  ({ one }) => ({
    content: one(contentPieces, {
      fields: [contentPerformance.contentId],
      references: [contentPieces.id],
    }),
  })
);

export const videoMetricsRelations = relations(videoMetrics, ({ one }) => ({
  content: one(contentPieces, {
    fields: [videoMetrics.contentId],
    references: [contentPieces.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  location: one(locations, {
    fields: [reviews.locationId],
    references: [locations.id],
  }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  location: one(locations, {
    fields: [alerts.locationId],
    references: [locations.id],
  }),
  keyword: one(keywords, {
    fields: [alerts.relatedKeywordId],
    references: [keywords.id],
  }),
  competitor: one(competitors, {
    fields: [alerts.relatedCompetitorId],
    references: [competitors.id],
  }),
}));
