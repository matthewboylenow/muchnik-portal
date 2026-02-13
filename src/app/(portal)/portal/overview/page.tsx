"use client";

import { motion } from "framer-motion";
import { TrendingUp, Star, Eye, Phone, MapPin, Globe, ArrowRight } from "lucide-react";
import { LocationCard } from "@/components/shared/LocationCard";
import { HealthScore } from "@/components/shared/HealthScore";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { TrafficOverview } from "@/components/charts/TrafficOverview";
import { useLocationData } from "@/hooks/useLocationData";
import { getLocationColor } from "@/lib/utils";

const demoSummary = {
  month: "February 2026",
  text: "Your online visibility improved across all three offices this month. The Manhattan office saw 34% more people finding you through Google Search, and your new blog on Medicaid planning is now appearing on the first page of results. Staten Island had 12 phone calls through Google this month, up from 8 last month. Morris County received two new 5-star reviews. Here's what we're focusing on next month: expanding your blog content around estate planning topics and building more local citations for the Morris County office.",
};

const demoGrowthData = Array.from({ length: 6 }, (_, i) => ({
  date: new Date(2025, 8 + i, 1).toLocaleDateString("en-US", { month: "short" }),
  manhattan: 800 + i * 80 + Math.floor(Math.random() * 50),
  statenIsland: 500 + i * 60 + Math.floor(Math.random() * 40),
  morrisCounty: 600 + i * 70 + Math.floor(Math.random() * 45),
}));

const demoWins = [
  { icon: <TrendingUp size={16} className="text-[var(--color-positive)]" />, text: "Your Manhattan office now appears on page 1 for 'estate planning attorney nyc'", type: "ranking" },
  { icon: <Star size={16} className="text-amber-400" />, text: "New 5-star review in Morris County: 'Kirill was incredibly thorough and caring...'", type: "review" },
  { icon: <Eye size={16} className="text-indigo-400" />, text: "Your video on Medicaid planning has been watched 340 times", type: "content" },
  { icon: <Phone size={16} className="text-cyan-400" />, text: "Staten Island office received 12 phone calls from Google this month", type: "action" },
];

export default function PortalOverview() {
  const { data: locationData } = useLocationData();

  return (
    <div className="space-y-8">
      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
          {demoSummary.month} Summary
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed text-base">
          {demoSummary.text}
        </p>
        <button className="mt-4 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          View Full Report <ArrowRight size={14} />
        </button>
      </motion.div>

      {/* Location Performance Cards */}
      <div className="grid grid-cols-3 gap-6">
        {locationData.map((loc, i) => (
          <motion.div
            key={loc.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <LocationCard slug={loc.slug} name={loc.name}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HealthScore
                    score={loc.healthScore}
                    color={getLocationColor(loc.slug)}
                    size={70}
                    label="Visibility"
                  />
                  <div>
                    <p className="text-2xl font-bold font-mono text-[var(--text-primary)]">{loc.healthScore}</p>
                    <p className="text-xs text-[var(--text-muted)]">Visibility Score</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                      <Eye size={14} /> People Finding You
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-[var(--text-primary)]">{loc.traffic.toLocaleString()}</span>
                      <TrendIndicator value={loc.trafficChange} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                      <Phone size={14} /> Actions Taken
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-[var(--text-primary)]">{loc.gbpActions}</span>
                      <TrendIndicator value={loc.gbpActionsChange} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                      <Star size={14} /> Google Rating
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.floor(loc.avgRating) }).map((_, j) => (
                        <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                      <span className="font-mono text-sm text-[var(--text-primary)] ml-1">{loc.avgRating}</span>
                      <span className="text-xs text-[var(--text-muted)]">({loc.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            </LocationCard>
          </motion.div>
        ))}
      </div>

      {/* Growth Chart */}
      <TrafficOverview
        data={demoGrowthData}
        mode="stacked"
        title="Your Growth — People Finding You Online"
        height={300}
      />

      {/* Recent Wins */}
      <div className="glass-card-static p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Wins</h3>
        <div className="grid grid-cols-2 gap-3">
          {demoWins.map((win, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 rounded-lg bg-[var(--bg-surface)] p-4"
            >
              <div className="mt-0.5">{win.icon}</div>
              <p className="text-sm text-[var(--text-secondary)]">{win.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
