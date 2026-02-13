"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Info, AlertCircle, FileText, RefreshCw } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { LocationCard } from "@/components/shared/LocationCard";
import { HealthScore } from "@/components/shared/HealthScore";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { LocationFilter } from "@/components/shared/LocationFilter";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { RankingTrend } from "@/components/charts/RankingTrend";
import { useDateRange } from "@/hooks/useDateRange";
import { useLocationData } from "@/hooks/useLocationData";
import { LOCATIONS } from "@/lib/constants";
import { getLocationColor } from "@/lib/utils";
import type { LocationSlug } from "@/types";

const demoRankingData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  manhattan: 8 + Math.sin(i / 5) * 3,
  statenIsland: 12 + Math.cos(i / 4) * 4,
  morrisCounty: 10 + Math.sin(i / 6) * 3.5,
}));

const demoAlerts = [
  { id: 1, severity: "critical" as const, title: "Manhattan: 'elder law attorney manhattan' dropped from #4 to #12", time: "2 hours ago" },
  { id: 2, severity: "info" as const, title: "New 5-star review on Morris County GBP", time: "5 hours ago" },
  { id: 3, severity: "warning" as const, title: "Littman Krooks published new blog on Medicaid planning", time: "1 day ago" },
  { id: 4, severity: "info" as const, title: "Staten Island: 'medicaid attorney' improved from #15 to #8", time: "1 day ago" },
  { id: 5, severity: "warning" as const, title: "Traffic to /manhattan/medicaid dropped 25% vs last week", time: "2 days ago" },
];

const severityIcon = {
  info: <Info size={16} className="text-[var(--color-info)]" />,
  warning: <AlertTriangle size={16} className="text-[var(--color-warning)]" />,
  critical: <AlertCircle size={16} className="text-[var(--color-negative)]" />,
};

export default function AdminDashboard() {
  const router = useRouter();
  const { dateRange, setDateRange } = useDateRange();
  const { data: locationData } = useLocationData();
  const [locationFilter, setLocationFilter] = useState<LocationSlug | "all">("all");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">SEO performance overview across all locations</p>
        </div>
        <div className="flex items-center gap-4">
          <LocationFilter value={locationFilter} onChange={setLocationFilter} />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Health Score Cards */}
      <div className="grid grid-cols-3 gap-6">
        {locationData.map((loc, i) => (
          <motion.div
            key={loc.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <LocationCard
              slug={loc.slug}
              name={loc.name}
              onClick={() => router.push(`/admin/locations/${loc.slug}`)}
            >
              <div className="flex items-start gap-4">
                <HealthScore
                  score={loc.healthScore}
                  color={getLocationColor(loc.slug)}
                  size={90}
                  label="SEO Health"
                />
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Avg Position</p>
                    <p className="font-mono text-lg font-semibold text-[var(--text-primary)]">{loc.avgPosition.toFixed(1)}</p>
                    <TrendIndicator value={loc.avgPositionChange} invert size="sm" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Organic Traffic</p>
                    <p className="font-mono text-lg font-semibold text-[var(--text-primary)]">{loc.traffic.toLocaleString()}</p>
                    <TrendIndicator value={loc.trafficChange} size="sm" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">GBP Actions</p>
                    <p className="font-mono text-lg font-semibold text-[var(--text-primary)]">{loc.gbpActions}</p>
                    <TrendIndicator value={loc.gbpActionsChange} size="sm" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Reviews</p>
                    <p className="font-mono text-lg font-semibold text-[var(--text-primary)]">{loc.reviewCount}</p>
                    <span className="text-xs text-[var(--text-tertiary)]">avg {loc.avgRating}★</span>
                  </div>
                </div>
              </div>
            </LocationCard>
          </motion.div>
        ))}
      </div>

      {/* Ranking Trend Chart */}
      <RankingTrend data={demoRankingData} height={300} />

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Total Keywords" value={147} />
        <MetricCard label="Top 3" value={18} change={12.5} />
        <MetricCard label="Top 10" value={52} change={8.3} />
        <MetricCard label="Improved" value={34} className="border-l-2 border-[var(--color-positive)]" />
        <MetricCard label="Declined" value={11} className="border-l-2 border-[var(--color-negative)]" />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-5 gap-6">
        {/* Alerts */}
        <div className="col-span-3 glass-card-static p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {demoAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-lg p-3 ${
                  alert.severity === "critical" ? "bg-red-500/5 border border-red-500/20" : "bg-[var(--bg-surface)]"
                }`}
              >
                {severityIcon[alert.severity]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-secondary)]">{alert.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-2 glass-card-static p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 rounded-lg bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-glass-active)] transition-colors">
              <FileText size={16} />
              Generate Monthly Report
            </button>
            <button className="w-full flex items-center gap-3 rounded-lg bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-glass-active)] transition-colors">
              <RefreshCw size={16} />
              Run Manual Rank Check
            </button>
          </div>
          <div className="mt-6">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Recent Content</h4>
            <div className="space-y-2">
              {[
                { title: "Understanding Medicaid Look-Back Period in NJ", date: "Feb 8" },
                { title: "Estate Planning for Business Owners in NYC", date: "Feb 3" },
                { title: "Video: When to Start Elder Law Planning", date: "Jan 28" },
              ].map((item) => (
                <div key={item.title} className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)] truncate mr-2">{item.title}</span>
                  <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
