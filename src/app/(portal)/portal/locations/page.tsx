"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Globe, Search, Users, CheckCircle, Target } from "lucide-react";
import { LocationCard } from "@/components/shared/LocationCard";
import { LocationComparison } from "@/components/charts/LocationComparison";
import { useLocationData } from "@/hooks/useLocationData";
import { cn } from "@/lib/utils";

const demoSearchBreakdown: Record<string, { direct: number; discovery: number }> = {
  manhattan: { direct: 340, discovery: 890 },
  "staten-island": { direct: 120, discovery: 480 },
  "morris-county": { direct: 180, discovery: 620 },
};

const demoActions: Record<string, { calls: number; directions: number; website: number; callsChange: number; directionsChange: number; websiteChange: number }> = {
  manhattan: { calls: 18, directions: 12, website: 145, callsChange: 28, directionsChange: 15, websiteChange: 22 },
  "staten-island": { calls: 12, directions: 8, website: 89, callsChange: 50, directionsChange: -12, websiteChange: 18 },
  "morris-county": { calls: 9, directions: 6, website: 72, callsChange: 12, directionsChange: 20, websiteChange: 31 },
};

const demoTopSearches: Record<string, Array<{ query: string; count: number; badge: string }>> = {
  manhattan: [
    { query: "elder law attorney manhattan", count: 180, badge: "Page 1" },
    { query: "medicaid planning attorney nyc", count: 120, badge: "Page 1" },
    { query: "estate planning lawyer nyc", count: 95, badge: "Page 1" },
    { query: "guardianship lawyer nyc", count: 72, badge: "Page 1" },
    { query: "asset protection attorney nyc", count: 45, badge: "Page 2" },
  ],
  "staten-island": [
    { query: "estate planning lawyer staten island", count: 90, badge: "Page 1" },
    { query: "elder law attorney staten island", count: 75, badge: "Page 1" },
    { query: "medicaid attorney staten island", count: 58, badge: "Page 1" },
    { query: "probate lawyer staten island", count: 32, badge: "Page 2" },
    { query: "trust attorney staten island", count: 28, badge: "Page 2" },
  ],
  "morris-county": [
    { query: "medicaid attorney morris county nj", count: 82, badge: "Page 1" },
    { query: "estate planning attorney randolph nj", count: 65, badge: "Page 1" },
    { query: "long term care planning nj", count: 50, badge: "Page 1" },
    { query: "elder law attorney nj", count: 42, badge: "Page 2" },
    { query: "guardianship attorney nj", count: 30, badge: "Page 1" },
  ],
};

const demoCompetitors: Record<string, Array<{ name: string; ahead: boolean }>> = {
  manhattan: [
    { name: "Littman Krooks LLP", ahead: false },
    { name: "Russo Law Group", ahead: true },
    { name: "Morgan Legal Group", ahead: true },
  ],
  "staten-island": [
    { name: "Goldberg Law Group", ahead: true },
    { name: "Law Office of Anthony DeFazio", ahead: true },
  ],
  "morris-county": [
    { name: "Begley Law Group", ahead: false },
    { name: "Coughlin Law Firm", ahead: true },
  ],
};

export default function PortalLocations() {
  const { data: locationData } = useLocationData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Your Locations</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">See how each office is performing online</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {locationData.map((loc, i) => {
          const searches = demoSearchBreakdown[loc.slug];
          const actions = demoActions[loc.slug];
          const topSearches = demoTopSearches[loc.slug] || [];
          const competitors = demoCompetitors[loc.slug] || [];

          return (
            <motion.div
              key={loc.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <LocationCard slug={loc.slug} name={loc.name}>
                <div className="space-y-5">
                  {/* How People Find You */}
                  <div>
                    <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Search size={12} /> How People Find You
                    </h4>
                    <div className="flex gap-3">
                      <div className="flex-1 rounded-lg bg-[var(--bg-surface)] p-3 text-center">
                        <p className="font-mono text-lg font-bold text-[var(--text-primary)]">{searches?.direct}</p>
                        <p className="text-xs text-[var(--text-muted)]">Searched your name</p>
                      </div>
                      <div className="flex-1 rounded-lg bg-[var(--bg-surface)] p-3 text-center">
                        <p className="font-mono text-lg font-bold text-[var(--text-primary)]">{searches?.discovery}</p>
                        <p className="text-xs text-[var(--text-muted)]">Found you by service</p>
                      </div>
                    </div>
                  </div>

                  {/* What People Do */}
                  <div>
                    <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Phone size={12} /> What People Do
                    </h4>
                    <div className="space-y-2">
                      {[
                        { label: "Called your office", value: actions?.calls, change: actions?.callsChange },
                        { label: "Got directions", value: actions?.directions, change: actions?.directionsChange },
                        { label: "Visited your website", value: actions?.website, change: actions?.websiteChange },
                      ].map((action) => (
                        <div key={action.label} className="flex items-center justify-between text-sm">
                          <span className="text-[var(--text-tertiary)]">{action.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium text-[var(--text-primary)]">{action.value}</span>
                            <span className={cn("text-xs", (action.change || 0) >= 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]")}>
                              {(action.change || 0) >= 0 ? "+" : ""}{action.change}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Search Terms */}
                  <div>
                    <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Users size={12} /> Your Top Search Terms
                    </h4>
                    <div className="space-y-1.5">
                      {topSearches.slice(0, 5).map((s) => (
                        <div key={s.query} className="flex items-center justify-between text-xs">
                          <span className="text-[var(--text-secondary)] truncate mr-2">{s.query}</span>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap",
                            s.badge === "Page 1" ? "bg-[var(--color-positive)]/10 text-[var(--color-positive)]" :
                            s.badge === "In Map Results" ? "bg-indigo-500/10 text-indigo-400" :
                            "bg-[var(--bg-surface)] text-[var(--text-muted)]"
                          )}>
                            {s.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitors */}
                  <div>
                    <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Target size={12} /> Nearby Competitors
                    </h4>
                    <div className="space-y-1.5">
                      {competitors.map((comp) => (
                        <div key={comp.name} className="flex items-center justify-between text-xs">
                          <span className="text-[var(--text-secondary)]">{comp.name}</span>
                          <span className={cn(
                            "whitespace-nowrap",
                            comp.ahead ? "text-[var(--color-positive)]" : "text-[var(--color-warning)]"
                          )}>
                            {comp.ahead ? "You rank higher" : "We're working on it"}
                          </span>
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
