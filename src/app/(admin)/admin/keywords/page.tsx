"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Download, ChevronDown, ExternalLink, TrendingUp } from "lucide-react";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { LocationFilter } from "@/components/shared/LocationFilter";
import { RankBadge } from "@/components/shared/RankBadge";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { MetricCard } from "@/components/shared/MetricCard";
import { useDateRange } from "@/hooks/useDateRange";
import { cn } from "@/lib/utils";
import type { LocationSlug } from "@/types";

const demoKeywords = [
  { id: "1", keyword: "elder law attorney manhattan", location: "manhattan" as LocationSlug, locationName: "Manhattan", category: "Elder Law (General)", currentRank: 4, previousRank: 6, localPack: 2, volume: 720, url: "/manhattan/elder-law-attorney/" },
  { id: "2", keyword: "medicaid planning attorney nyc", location: "manhattan" as LocationSlug, locationName: "Manhattan", category: "Medicaid Planning", currentRank: 7, previousRank: 5, localPack: null, volume: 480, url: "/manhattan/medicaid-planning/" },
  { id: "3", keyword: "estate planning lawyer staten island", location: "staten-island" as LocationSlug, locationName: "Staten Island", category: "Estate Planning", currentRank: 3, previousRank: 3, localPack: 1, volume: 320, url: "/staten-island/estate-planning/" },
  { id: "4", keyword: "elder law attorney nj", location: "morris-county" as LocationSlug, locationName: "Morris County", category: "Elder Law (General)", currentRank: 12, previousRank: 18, localPack: null, volume: 590, url: "/new-jersey/elder-law-attorney/" },
  { id: "5", keyword: "guardianship lawyer nyc", location: "manhattan" as LocationSlug, locationName: "Manhattan", category: "Guardianship", currentRank: 9, previousRank: 11, localPack: null, volume: 260, url: "/manhattan/guardianship/" },
  { id: "6", keyword: "medicaid attorney morris county nj", location: "morris-county" as LocationSlug, locationName: "Morris County", category: "Medicaid Planning", currentRank: 5, previousRank: 8, localPack: 3, volume: 210, url: "/new-jersey/medicaid-planning/" },
  { id: "7", keyword: "asset protection attorney nyc", location: "manhattan" as LocationSlug, locationName: "Manhattan", category: "Asset Protection", currentRank: 15, previousRank: 12, localPack: null, volume: 390, url: "/manhattan/asset-protection/" },
  { id: "8", keyword: "long term care planning nj", location: "morris-county" as LocationSlug, locationName: "Morris County", category: "Long-Term Care", currentRank: 8, previousRank: 14, localPack: 2, volume: 170, url: "/new-jersey/long-term-care/" },
];

const locationDotColor: Record<string, string> = {
  manhattan: "#818CF8",
  "staten-island": "#22D3EE",
  "morris-county": "#34D399",
};

export default function KeywordsPage() {
  const { dateRange, setDateRange } = useDateRange();
  const [locationFilter, setLocationFilter] = useState<LocationSlug | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("currentRank");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = demoKeywords
    .filter((kw) => locationFilter === "all" || kw.location === locationFilter)
    .filter((kw) => kw.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] ?? 999;
      const bVal = b[sortBy as keyof typeof b] ?? 999;
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const handleSort = (col: string) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Keywords</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Track keyword rankings across all locations</p>
        </div>
        <div className="flex items-center gap-4">
          <LocationFilter value={locationFilter} onChange={setLocationFilter} />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Keywords" value={147} />
        <MetricCard label="In Top 3" value={18} change={12.5} />
        <MetricCard label="In Top 10" value={52} change={8.3} />
        <MetricCard label="Avg Position" value={14.2} format="decimal" change={-2.3} invertTrend />
      </div>

      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)] w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors">
              <Download size={14} />
              Export CSV
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500 transition-colors">
              <Plus size={14} />
              Add Keywords
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                {[
                  { key: "keyword", label: "Keyword" },
                  { key: "location", label: "Location" },
                  { key: "currentRank", label: "Rank" },
                  { key: "previousRank", label: "Prev" },
                  { key: "change", label: "Change" },
                  { key: "localPack", label: "Local Pack" },
                  { key: "volume", label: "Volume" },
                  { key: "url", label: "URL" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-left py-3 px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--text-secondary)]"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortBy === col.key && <ChevronDown size={12} className={sortDir === "desc" ? "rotate-180" : ""} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((kw, i) => (
                <motion.tr
                  key={kw.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <div>
                      <span className="text-[var(--text-primary)] font-medium">{kw.keyword}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)]">{kw.category}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: locationDotColor[kw.location] }} />
                      <span className="text-[var(--text-secondary)]">{kw.locationName}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <RankBadge position={kw.currentRank} />
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-[var(--text-muted)]">
                    {kw.previousRank}
                  </td>
                  <td className="py-3 px-3">
                    <TrendIndicator value={kw.previousRank - kw.currentRank} invert />
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-[var(--text-secondary)]">
                    {kw.localPack ?? "—"}
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-[var(--text-secondary)]">
                    {kw.volume.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-[var(--text-muted)] truncate max-w-[150px] block">{kw.url}</span>
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
