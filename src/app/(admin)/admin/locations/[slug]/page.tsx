"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/shared/MetricCard";
import { HealthScore } from "@/components/shared/HealthScore";
import { RankBadge } from "@/components/shared/RankBadge";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { TrafficOverview } from "@/components/charts/TrafficOverview";
import { KeywordDistribution } from "@/components/charts/KeywordDistribution";
import { LocationComparison } from "@/components/charts/LocationComparison";
import { useDateRange } from "@/hooks/useDateRange";
import { LOCATIONS } from "@/lib/constants";
import { getLocationColor } from "@/lib/utils";

const demoGbpData = Array.from({ length: 12 }, (_, i) => ({
  date: new Date(2026, i, 1).toLocaleDateString("en-US", { month: "short" }),
  total: 200 + Math.floor(Math.random() * 100),
}));

const demoCategoryDistribution = [
  { name: "Medicaid Planning", value: 18 },
  { name: "Estate Planning", value: 15 },
  { name: "Elder Law General", value: 12 },
  { name: "Guardianship", value: 8 },
  { name: "Asset Protection", value: 7 },
  { name: "Long-Term Care", value: 5 },
];

const demoGbpActions = [
  { name: "Website Clicks", value: 145, slug: "website" },
  { name: "Phone Calls", value: 62, slug: "phone" },
  { name: "Directions", value: 38, slug: "directions" },
];

const demoKeywords = [
  { keyword: "elder law attorney manhattan", position: 4, change: -2, localPack: 2, category: "Elder Law" },
  { keyword: "medicaid planning attorney nyc", position: 7, change: 2, localPack: null, category: "Medicaid" },
  { keyword: "estate planning lawyer nyc", position: 8, change: 0, localPack: null, category: "Estate" },
  { keyword: "guardianship lawyer nyc", position: 9, change: -2, localPack: null, category: "Guardianship" },
  { keyword: "asset protection attorney nyc", position: 15, change: 3, localPack: null, category: "Asset Protection" },
];

const demoReviews = [
  { id: "1", name: "Sarah M.", rating: 5, text: "Kirill was incredibly thorough and explained everything clearly.", date: "2026-02-05", responded: true },
  { id: "2", name: "Robert K.", rating: 5, text: "Excellent service for our family's Medicaid planning needs.", date: "2026-01-22", responded: true },
  { id: "3", name: "Linda P.", rating: 4, text: "Very professional and knowledgeable about elder law matters.", date: "2026-01-10", responded: false },
];

export default function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { dateRange, setDateRange } = useDateRange();
  const location = LOCATIONS.find((l) => l.slug === slug);

  if (!location) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-muted)]">Location not found</p>
      </div>
    );
  }

  const color = getLocationColor(slug);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/locations" className="p-2 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{location.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1"><MapPin size={14} /> {location.address}, {location.city}, {location.state} {location.zip}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {location.phone}</span>
            </div>
          </div>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-4">
        <div className="glass-card-static p-5 flex items-center gap-4">
          <HealthScore score={78} color={color} size={70} />
          <div>
            <p className="text-xs text-[var(--text-muted)]">SEO Health</p>
            <p className="font-mono text-2xl font-bold text-[var(--text-primary)]">78</p>
          </div>
        </div>
        <MetricCard label="Avg Position" value={8.4} format="decimal" change={-2.1} invertTrend />
        <MetricCard label="Organic Traffic" value={1200} change={15.3} />
        <MetricCard label="GBP Actions" value={47} change={12} />
        <MetricCard label="Reviews" value={24} changeLabel="4.8★ avg" />
      </div>

      {/* GBP Performance */}
      <div className="grid grid-cols-2 gap-6">
        <TrafficOverview data={demoGbpData} mode="total" title="GBP Searches Over Time" />
        <LocationComparison data={demoGbpActions} title="GBP Actions Breakdown" valueLabel="Actions" />
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 glass-card-static p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Keyword Rankings</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <th className="text-left py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Keyword</th>
                <th className="text-center py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Rank</th>
                <th className="text-center py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Change</th>
                <th className="text-center py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Local Pack</th>
                <th className="text-left py-2 px-2 text-xs font-medium text-[var(--text-muted)]">Category</th>
              </tr>
            </thead>
            <tbody>
              {demoKeywords.map((kw) => (
                <tr key={kw.keyword} className="border-b border-[var(--border-subtle)]">
                  <td className="py-2 px-2 text-[var(--text-secondary)]">{kw.keyword}</td>
                  <td className="py-2 px-2 text-center"><RankBadge position={kw.position} size="sm" /></td>
                  <td className="py-2 px-2 text-center"><RankBadge position={kw.position} change={kw.change} size="sm" /></td>
                  <td className="py-2 px-2 text-center font-mono text-xs text-[var(--text-muted)]">{kw.localPack ?? "—"}</td>
                  <td className="py-2 px-2 text-xs text-[var(--text-muted)]">{kw.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <KeywordDistribution data={demoCategoryDistribution} title="Keywords by Category" />
      </div>

      {/* Reviews */}
      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Reviews</h3>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="font-mono text-sm text-[var(--text-primary)]">4.8</span>
            <span className="text-xs text-[var(--text-muted)]">(24 reviews)</span>
          </div>
        </div>
        <div className="space-y-4">
          {demoReviews.map((review) => (
            <div key={review.id} className="rounded-lg bg-[var(--bg-surface)] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-[var(--text-primary)]">{review.name}</span>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${review.responded ? "bg-[var(--color-positive)]/10 text-[var(--color-positive)]" : "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"}`}>
                    {review.responded ? "Responded" : "Needs Response"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
