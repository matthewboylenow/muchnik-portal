"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Video, Globe, Search, ExternalLink } from "lucide-react";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { LocationFilter } from "@/components/shared/LocationFilter";
import { MetricCard } from "@/components/shared/MetricCard";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { RankBadge } from "@/components/shared/RankBadge";
import { useDateRange } from "@/hooks/useDateRange";
import { cn } from "@/lib/utils";
import type { LocationSlug } from "@/types";

const typeIcon = {
  blog: <FileText size={14} />,
  video: <Video size={14} />,
  "service-page": <Globe size={14} />,
  resource: <FileText size={14} />,
};

const typeBadge = {
  blog: "bg-indigo-500/10 text-indigo-400",
  video: "bg-cyan-500/10 text-cyan-400",
  "service-page": "bg-emerald-500/10 text-emerald-400",
  resource: "bg-amber-500/10 text-amber-400",
};

const demoContent = [
  { id: "1", title: "Understanding Medicaid Look-Back Period in NJ", type: "blog" as const, location: "morris-county" as LocationSlug, locationName: "Morris County", published: "2026-02-08", pageviews: 342, avgTime: 245, formSubmissions: 3, targetKeyword: "medicaid look-back period nj", targetRank: 6, status: "published" },
  { id: "2", title: "Estate Planning for Business Owners in NYC", type: "blog" as const, location: "manhattan" as LocationSlug, locationName: "Manhattan", published: "2026-02-03", pageviews: 528, avgTime: 198, formSubmissions: 5, targetKeyword: "estate planning business owner nyc", targetRank: 8, status: "published" },
  { id: "3", title: "When to Start Elder Law Planning", type: "video" as const, location: "manhattan" as LocationSlug, locationName: "Manhattan", published: "2026-01-28", pageviews: 890, avgTime: 312, formSubmissions: 0, targetKeyword: "when to start elder law planning", targetRank: 11, status: "published" },
  { id: "4", title: "Elder Law Attorney Manhattan", type: "service-page" as const, location: "manhattan" as LocationSlug, locationName: "Manhattan", published: "2025-09-15", pageviews: 1205, avgTime: 156, formSubmissions: 12, targetKeyword: "elder law attorney manhattan", targetRank: 4, status: "published" },
  { id: "5", title: "Guardianship Services in NYC", type: "service-page" as const, location: "manhattan" as LocationSlug, locationName: "Manhattan", published: "2025-10-01", pageviews: 445, avgTime: 178, formSubmissions: 4, targetKeyword: "guardianship lawyer nyc", targetRank: 9, status: "needs-update" },
  { id: "6", title: "Protecting Assets from Nursing Home Costs", type: "blog" as const, location: "staten-island" as LocationSlug, locationName: "Staten Island", published: "2026-01-15", pageviews: 267, avgTime: 223, formSubmissions: 2, targetKeyword: "asset protection nursing home", targetRank: 14, status: "published" },
];

const locationDotColor: Record<string, string> = {
  manhattan: "#818CF8",
  "staten-island": "#22D3EE",
  "morris-county": "#34D399",
};

export default function ContentPage() {
  const { dateRange, setDateRange } = useDateRange();
  const [locationFilter, setLocationFilter] = useState<LocationSlug | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = demoContent
    .filter((c) => locationFilter === "all" || c.location === locationFilter)
    .filter((c) => typeFilter === "all" || c.type === typeFilter)
    .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Content</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Track content performance and rankings</p>
        </div>
        <div className="flex items-center gap-4">
          <LocationFilter value={locationFilter} onChange={setLocationFilter} />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Content" value={42} />
        <MetricCard label="Total Pageviews" value={12450} change={18.3} />
        <MetricCard label="Avg Time on Page" value={204} format="duration" />
        <MetricCard label="Form Submissions" value={26} change={32.1} />
      </div>

      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)] w-64"
              />
            </div>
            <div className="flex items-center gap-1 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-1">
              {["all", "blog", "service-page", "video"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-all",
                    typeFilter === t
                      ? "bg-[var(--bg-glass-active)] text-[var(--text-primary)]"
                      : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  )}
                >
                  {t === "all" ? "All" : t === "service-page" ? "Pages" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Title</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Location</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Published</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Views</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Avg Time</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Forms</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Target Rank</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <span className="text-[var(--text-primary)] font-medium">{item.title}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium", typeBadge[item.type])}>
                      {typeIcon[item.type]}
                      {item.type === "service-page" ? "Page" : item.type}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: locationDotColor[item.location] }} />
                      <span className="text-[var(--text-secondary)]">{item.locationName}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-[var(--text-muted)]">
                    {new Date(item.published).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-[var(--text-secondary)]">{item.pageviews.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-xs text-[var(--text-secondary)]">
                    {Math.floor(item.avgTime / 60)}m {item.avgTime % 60}s
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-[var(--text-secondary)]">{item.formSubmissions}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <RankBadge position={item.targetRank} size="sm" />
                      <span className="text-xs text-[var(--text-muted)] truncate max-w-[120px]">{item.targetKeyword}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      item.status === "published" ? "bg-[var(--color-positive)]/10 text-[var(--color-positive)]" :
                      item.status === "needs-update" ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]" :
                      "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                    )}>
                      {item.status === "needs-update" ? "Needs Update" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
