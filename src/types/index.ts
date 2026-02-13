export type LocationSlug = "manhattan" | "staten-island" | "morris-county";

export type UserRole = "admin" | "client";

export type KeywordCategory =
  | "medicaid-planning"
  | "estate-planning"
  | "asset-protection"
  | "guardianship"
  | "elder-law-general"
  | "long-term-care"
  | "veterans-benefits"
  | "trust-administration"
  | "probate"
  | "special-needs";

export type ContentType = "blog" | "service-page" | "video" | "resource";

export type AlertSeverity = "info" | "warning" | "critical";

export type GoalStatus = "active" | "achieved" | "missed" | "paused";

export interface LocationMetrics {
  healthScore: number;
  avgKeywordPosition: number;
  avgKeywordPositionChange: number;
  organicTraffic: number;
  organicTrafficChange: number;
  gbpActions: number;
  gbpActionsChange: number;
  reviewCount: number;
  avgRating: number;
}

export interface KeywordRankingEntry {
  id: string;
  keyword: string;
  category: KeywordCategory;
  locationSlug: LocationSlug;
  locationName: string;
  currentPosition: number | null;
  previousPosition: number | null;
  change: number | null;
  localPackPosition: number | null;
  featuredSnippet: boolean;
  searchVolume: number | null;
  url: string | null;
  isPrimary: boolean;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ChartDataPoint {
  date: string;
  manhattan?: number;
  statenIsland?: number;
  morrisCounty?: number;
  value?: number;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  locationSlug?: LocationSlug;
  createdAt: string;
  isRead: boolean;
}

export interface MonthlySummary {
  id: string;
  month: string;
  summaryText: string;
  metrics: Record<string, number | string>;
  highlights: Array<{ type: string; message: string }>;
  recommendations: Array<{ priority: string; action: string }>;
}
