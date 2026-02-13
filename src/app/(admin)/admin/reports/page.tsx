"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, CheckSquare, Loader2 } from "lucide-react";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { MetricCard } from "@/components/shared/MetricCard";
import { useDateRange } from "@/hooks/useDateRange";
import { LOCATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const reportSections = [
  { id: "rankings", label: "Keyword Rankings" },
  { id: "traffic", label: "Traffic Analytics" },
  { id: "gbp", label: "Google Business Profile" },
  { id: "content", label: "Content Performance" },
  { id: "reviews", label: "Reviews" },
  { id: "technical", label: "Technical SEO" },
  { id: "competitors", label: "Competitor Analysis" },
];

const pastReports = [
  { id: "1", name: "January 2026 Monthly Report", date: "2026-02-01", locations: "All Locations", size: "2.4 MB" },
  { id: "2", name: "December 2025 Monthly Report", date: "2026-01-01", locations: "All Locations", size: "2.1 MB" },
  { id: "3", name: "November 2025 Monthly Report", date: "2025-12-01", locations: "All Locations", size: "1.9 MB" },
  { id: "4", name: "Q4 2025 Quarterly Review", date: "2025-12-15", locations: "All Locations", size: "4.7 MB" },
];

const demoGoals = [
  { title: "Manhattan: Top 3 for 'elder law attorney manhattan'", current: 4, target: 3, metric: "Position", progress: 75 },
  { title: "Staten Island: 20 Google Reviews", current: 18, target: 20, metric: "Reviews", progress: 90 },
  { title: "Morris County: 500 Monthly Organic Visits", current: 380, target: 500, metric: "Visits", progress: 76 },
  { title: "All: Publish 8 Blog Posts per Month", current: 6, target: 8, metric: "Posts", progress: 75 },
];

export default function ReportsPage() {
  const { dateRange, setDateRange } = useDateRange();
  const [selectedLocations, setSelectedLocations] = useState<string[]>(LOCATIONS.map((l) => l.slug));
  const [selectedSections, setSelectedSections] = useState<string[]>(reportSections.map((s) => s.id));
  const [generating, setGenerating] = useState(false);

  const toggleLocation = (slug: string) => {
    setSelectedLocations((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const toggleSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reports</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">Generate and manage client reports</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Report Generator */}
        <div className="col-span-2 glass-card-static p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Generate Report</h3>

          <div className="mb-6">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Locations</h4>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.slug}
                  onClick={() => toggleLocation(loc.slug)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors border",
                    selectedLocations.includes(loc.slug)
                      ? "border-indigo-500/50 bg-indigo-500/10 text-[var(--text-primary)]"
                      : "border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
                  )}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: loc.colorHex }} />
                  {loc.shortName}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Sections</h4>
            <div className="grid grid-cols-2 gap-2">
              {reportSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors border text-left",
                    selectedSections.includes(section.id)
                      ? "border-indigo-500/50 bg-indigo-500/10 text-[var(--text-primary)]"
                      : "border-[var(--border-default)] text-[var(--text-muted)] hover:border-[var(--border-strong)]"
                  )}
                >
                  <CheckSquare size={14} className={selectedSections.includes(section.id) ? "text-indigo-400" : ""} />
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText size={16} />
                Generate Report
              </>
            )}
          </button>
        </div>

        {/* Goals */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Goal Progress</h3>
          <div className="space-y-4">
            {demoGoals.map((goal, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">{goal.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {goal.current}/{goal.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Past Reports */}
      <div className="glass-card-static p-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Report History</h3>
        <div className="space-y-2">
          {pastReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-lg p-3 hover:bg-[var(--bg-surface)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-indigo-400" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{report.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{report.locations} · {report.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-muted)]">
                  {new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <button className="flex items-center gap-1 rounded-md bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-glass-active)] transition-colors">
                  <Download size={12} />
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
