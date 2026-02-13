"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { chartTheme } from "./theme";

interface CompetitorRadarProps {
  data: Array<{
    category: string;
    ours: number;
    competitor: number;
  }>;
  competitorName?: string;
  height?: number;
}

export function CompetitorRadar({
  data,
  competitorName = "Competitor",
  height = 350,
}: CompetitorRadarProps) {
  return (
    <div className="glass-card-static p-6">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Category Comparison
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255, 255, 255, 0.06)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#71717A", fontSize: 11, fontFamily: "Instrument Sans" }}
          />
          <PolarRadiusAxis
            angle={90}
            tick={{ fill: "#71717A", fontSize: 10, fontFamily: "JetBrains Mono" }}
            axisLine={false}
          />
          <Radar
            name="Muchnik Elder Law"
            dataKey="ours"
            stroke={chartTheme.colors.primary}
            fill={chartTheme.colors.primary}
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name={competitorName}
            dataKey="competitor"
            stroke={chartTheme.colors.negative}
            fill={chartTheme.colors.negative}
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
          <Tooltip {...chartTheme.tooltip} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-5" style={{ backgroundColor: chartTheme.colors.primary }} />
          <span className="text-xs text-[var(--text-secondary)]">Muchnik Elder Law</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-5 border-t-2 border-dashed" style={{ borderColor: chartTheme.colors.negative }} />
          <span className="text-xs text-[var(--text-secondary)]">{competitorName}</span>
        </div>
      </div>
    </div>
  );
}
