"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LocationCard } from "@/components/shared/LocationCard";
import { HealthScore } from "@/components/shared/HealthScore";
import { MetricCard } from "@/components/shared/MetricCard";
import { TrendIndicator } from "@/components/shared/TrendIndicator";
import { RankBadge } from "@/components/shared/RankBadge";
import { useLocationData } from "@/hooks/useLocationData";
import { LOCATIONS } from "@/lib/constants";
import { getLocationColor } from "@/lib/utils";

const demoTopKeywords: Record<string, Array<{ keyword: string; position: number }>> = {
  manhattan: [
    { keyword: "elder law attorney manhattan", position: 4 },
    { keyword: "medicaid planning attorney nyc", position: 7 },
    { keyword: "estate planning lawyer nyc", position: 8 },
    { keyword: "guardianship lawyer nyc", position: 9 },
    { keyword: "asset protection attorney nyc", position: 15 },
  ],
  "staten-island": [
    { keyword: "estate planning lawyer staten island", position: 3 },
    { keyword: "elder law attorney staten island", position: 6 },
    { keyword: "medicaid attorney staten island", position: 8 },
    { keyword: "probate lawyer staten island", position: 11 },
    { keyword: "trust attorney staten island", position: 14 },
  ],
  "morris-county": [
    { keyword: "medicaid attorney morris county nj", position: 5 },
    { keyword: "elder law attorney nj", position: 12 },
    { keyword: "long term care planning nj", position: 8 },
    { keyword: "estate planning attorney randolph nj", position: 6 },
    { keyword: "guardianship attorney nj", position: 10 },
  ],
};

export default function LocationsPage() {
  const router = useRouter();
  const { data: locationData } = useLocationData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Locations</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">Performance metrics for each office location</p>
      </div>

      <div className="space-y-8">
        {locationData.map((loc, i) => {
          const locInfo = LOCATIONS.find((l) => l.slug === loc.slug);
          const topKws = demoTopKeywords[loc.slug] || [];
          return (
            <motion.div
              key={loc.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <LocationCard
                slug={loc.slug}
                name={locInfo?.name || loc.name}
                address={locInfo ? `${locInfo.address}, ${locInfo.city}, ${locInfo.state} ${locInfo.zip}` : undefined}
                onClick={() => router.push(`/admin/locations/${loc.slug}`)}
              >
                <div className="grid grid-cols-4 gap-6">
                  {/* Health Score + GBP */}
                  <div className="flex flex-col items-center gap-3">
                    <HealthScore score={loc.healthScore} color={getLocationColor(loc.slug)} size={100} label="SEO Health" />
                    <div className="text-center">
                      <p className="text-xs text-[var(--text-muted)]">GBP Actions</p>
                      <p className="font-mono text-lg font-bold text-[var(--text-primary)]">{loc.gbpActions}</p>
                      <TrendIndicator value={loc.gbpActionsChange} size="sm" />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-tertiary)]">Avg Position</span>
                        <span className="font-mono text-[var(--text-primary)]">{loc.avgPosition.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-tertiary)]">Organic Traffic</span>
                        <span className="font-mono text-[var(--text-primary)]">{loc.traffic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-tertiary)]">Reviews</span>
                        <span className="font-mono text-[var(--text-primary)]">{loc.reviewCount} ({loc.avgRating}★)</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Keywords */}
                  <div className="col-span-2">
                    <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3">Top Keywords</h4>
                    <div className="space-y-2">
                      {topKws.map((kw) => (
                        <div key={kw.keyword} className="flex items-center justify-between text-sm">
                          <span className="text-[var(--text-secondary)] truncate mr-3">{kw.keyword}</span>
                          <RankBadge position={kw.position} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </LocationCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
