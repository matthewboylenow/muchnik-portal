"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartTheme } from "./theme";

interface RankingTrendProps {
  data: Array<{
    date: string;
    manhattan: number | null;
    statenIsland: number | null;
    morrisCounty: number | null;
  }>;
  height?: number;
}

export function RankingTrend({ data, height = 350 }: RankingTrendProps) {
  return (
    <div className="glass-card-static p-6">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        Average Keyword Position Trend
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gradManhattan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartTheme.areaGradients.manhattan.start} />
              <stop offset="100%" stopColor={chartTheme.areaGradients.manhattan.end} />
            </linearGradient>
            <linearGradient id="gradStatenIsland" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartTheme.areaGradients.statenIsland.start} />
              <stop offset="100%" stopColor={chartTheme.areaGradients.statenIsland.end} />
            </linearGradient>
            <linearGradient id="gradMorrisCounty" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartTheme.areaGradients.morrisCounty.start} />
              <stop offset="100%" stopColor={chartTheme.areaGradients.morrisCounty.end} />
            </linearGradient>
          </defs>
          <CartesianGrid {...chartTheme.cartesianGrid} />
          <XAxis dataKey="date" {...chartTheme.xAxis} />
          <YAxis reversed domain={[1, "auto"]} {...chartTheme.yAxis} />
          <Tooltip {...chartTheme.tooltip} />
          <Area
            type="monotone"
            dataKey="manhattan"
            stroke={chartTheme.colors.manhattan}
            fill="url(#gradManhattan)"
            strokeWidth={2}
            name="Manhattan"
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="statenIsland"
            stroke={chartTheme.colors.statenIsland}
            fill="url(#gradStatenIsland)"
            strokeWidth={2}
            name="Staten Island"
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="morrisCounty"
            stroke={chartTheme.colors.morrisCounty}
            fill="url(#gradMorrisCounty)"
            strokeWidth={2}
            name="Morris County"
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
