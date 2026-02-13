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

interface TrafficOverviewProps {
  data: Array<{
    date: string;
    manhattan?: number;
    statenIsland?: number;
    morrisCounty?: number;
    total?: number;
  }>;
  mode?: "stacked" | "total";
  height?: number;
  title?: string;
}

export function TrafficOverview({
  data,
  mode = "stacked",
  height = 300,
  title = "Organic Traffic",
}: TrafficOverviewProps) {
  return (
    <div className="glass-card-static p-6">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="trafficGradManhattan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartTheme.areaGradients.manhattan.start} />
              <stop offset="100%" stopColor={chartTheme.areaGradients.manhattan.end} />
            </linearGradient>
            <linearGradient id="trafficGradStatenIsland" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartTheme.areaGradients.statenIsland.start} />
              <stop offset="100%" stopColor={chartTheme.areaGradients.statenIsland.end} />
            </linearGradient>
            <linearGradient id="trafficGradMorrisCounty" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartTheme.areaGradients.morrisCounty.start} />
              <stop offset="100%" stopColor={chartTheme.areaGradients.morrisCounty.end} />
            </linearGradient>
            <linearGradient id="trafficGradTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(129, 140, 248, 0.3)" />
              <stop offset="100%" stopColor="rgba(129, 140, 248, 0)" />
            </linearGradient>
          </defs>
          <CartesianGrid {...chartTheme.cartesianGrid} />
          <XAxis dataKey="date" {...chartTheme.xAxis} />
          <YAxis {...chartTheme.yAxis} />
          <Tooltip {...chartTheme.tooltip} />
          {mode === "stacked" ? (
            <>
              <Area
                type="monotone"
                dataKey="manhattan"
                stackId="traffic"
                stroke={chartTheme.colors.manhattan}
                fill="url(#trafficGradManhattan)"
                strokeWidth={2}
                name="Manhattan"
              />
              <Area
                type="monotone"
                dataKey="statenIsland"
                stackId="traffic"
                stroke={chartTheme.colors.statenIsland}
                fill="url(#trafficGradStatenIsland)"
                strokeWidth={2}
                name="Staten Island"
              />
              <Area
                type="monotone"
                dataKey="morrisCounty"
                stackId="traffic"
                stroke={chartTheme.colors.morrisCounty}
                fill="url(#trafficGradMorrisCounty)"
                strokeWidth={2}
                name="Morris County"
              />
            </>
          ) : (
            <Area
              type="monotone"
              dataKey="total"
              stroke={chartTheme.colors.primary}
              fill="url(#trafficGradTotal)"
              strokeWidth={2}
              name="Total Traffic"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
