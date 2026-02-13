"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, TrendingUp, AlertTriangle } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { CompetitorRadar } from "@/components/charts/CompetitorRadar";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { LocationFilter } from "@/components/shared/LocationFilter";
import { RankBadge } from "@/components/shared/RankBadge";
import { useDateRange } from "@/hooks/useDateRange";
import { cn } from "@/lib/utils";
import type { LocationSlug } from "@/types";

const demoCompetitors = [
  { id: "1", name: "Littman Krooks LLP", domain: "littmankrooks.com", location: "manhattan", overlapping: 28, ourAvg: 8.4, theirAvg: 6.2 },
  { id: "2", name: "Morgan Legal Group", domain: "morganlegalny.com", location: "manhattan", overlapping: 22, ourAvg: 8.4, theirAvg: 9.1 },
  { id: "3", name: "Goldberg Law Group", domain: "goldberglawgroup.com", location: "staten-island", overlapping: 15, ourAvg: 12.1, theirAvg: 14.3 },
  { id: "4", name: "Russo Law Group", domain: "russolawgroup.com", location: "manhattan", overlapping: 19, ourAvg: 8.4, theirAvg: 11.5 },
];

const demoRadarData = [
  { category: "Elder Law", ours: 8, competitor: 5 },
  { category: "Medicaid", ours: 7, competitor: 9 },
  { category: "Estate Planning", ours: 6, competitor: 8 },
  { category: "Guardianship", ours: 9, competitor: 4 },
  { category: "Asset Protection", ours: 5, competitor: 7 },
  { category: "Long-Term Care", ours: 8, competitor: 3 },
];

const demoHeadToHead = [
  { keyword: "elder law attorney manhattan", ours: 4, theirs: 2, gap: -2 },
  { keyword: "medicaid planning attorney nyc", ours: 7, theirs: 5, gap: -2 },
  { keyword: "estate planning lawyer nyc", ours: 8, theirs: 6, gap: -2 },
  { keyword: "guardianship lawyer nyc", ours: 9, theirs: 15, gap: 6 },
  { keyword: "elder law firm manhattan", ours: 5, theirs: 8, gap: 3 },
  { keyword: "medicaid spend down attorney", ours: 6, theirs: 11, gap: 5 },
];

const demoAlerts = [
  { text: "Littman Krooks now ranks #2 for 'elder law attorney manhattan'", time: "1 day ago" },
  { text: "Morgan Legal Group published: 'Understanding NY Estate Tax 2026'", time: "3 days ago" },
  { text: "Goldberg Law Group gained 3 new Google reviews this week", time: "5 days ago" },
];

export default function CompetitorsPage() {
  const { dateRange, setDateRange } = useDateRange();
  const [locationFilter, setLocationFilter] = useState<LocationSlug | "all">("all");
  const [selectedCompetitor, setSelectedCompetitor] = useState(demoCompetitors[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Competitors</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Monitor competitor rankings and activity</p>
        </div>
        <div className="flex items-center gap-4">
          <LocationFilter value={locationFilter} onChange={setLocationFilter} />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-4 gap-4">
        {demoCompetitors.map((comp, i) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedCompetitor(comp)}
            className={cn(
              "glass-card-static p-5 cursor-pointer transition-all",
              selectedCompetitor.id === comp.id && "ring-1 ring-indigo-500/50"
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-[var(--text-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{comp.name}</h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-3">{comp.domain}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-tertiary)]">Overlapping Keywords</span>
                <span className="font-mono text-[var(--text-secondary)]">{comp.overlapping}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-tertiary)]">Their Avg Position</span>
                <span className="font-mono text-[var(--text-secondary)]">{comp.theirAvg.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-tertiary)]">Our Avg Position</span>
                <span className="font-mono text-[var(--text-secondary)]">{comp.ourAvg.toFixed(1)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Radar Chart */}
        <CompetitorRadar data={demoRadarData} competitorName={selectedCompetitor.name} />

        {/* Head-to-Head */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
            Head-to-Head vs {selectedCompetitor.name}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="text-left py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Keyword</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Ours</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Theirs</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Gap</th>
                </tr>
              </thead>
              <tbody>
                {demoHeadToHead.map((row) => (
                  <tr key={row.keyword} className="border-b border-[var(--border-subtle)]">
                    <td className="py-2 px-2 text-[var(--text-secondary)]">{row.keyword}</td>
                    <td className="py-2 px-2 text-center"><RankBadge position={row.ours} size="sm" /></td>
                    <td className="py-2 px-2 text-center"><RankBadge position={row.theirs} size="sm" /></td>
                    <td className={cn("py-2 px-2 text-center font-mono text-xs", row.gap > 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]")}>
                      {row.gap > 0 ? `+${row.gap}` : row.gap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Competitor Alerts */}
      <div className="glass-card-static p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Competitor Activity</h3>
        <div className="space-y-3">
          {demoAlerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-[var(--bg-surface)] p-3">
              <AlertTriangle size={16} className="text-[var(--color-warning)] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[var(--text-secondary)]">{alert.text}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
