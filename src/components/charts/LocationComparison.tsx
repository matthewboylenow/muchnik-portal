"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { chartTheme } from "./theme";

interface LocationComparisonProps {
  data: Array<{
    name: string;
    value: number;
    slug: string;
  }>;
  height?: number;
  title?: string;
  valueLabel?: string;
}

const slugColorMap: Record<string, string> = {
  manhattan: chartTheme.colors.manhattan,
  "staten-island": chartTheme.colors.statenIsland,
  "morris-county": chartTheme.colors.morrisCounty,
};

export function LocationComparison({
  data,
  height = 200,
  title,
  valueLabel = "Value",
}: LocationComparisonProps) {
  return (
    <div className="glass-card-static p-6">
      {title && (
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
          <CartesianGrid {...chartTheme.cartesianGrid} horizontal={false} vertical />
          <XAxis type="number" {...chartTheme.xAxis} />
          <YAxis
            type="category"
            dataKey="name"
            {...chartTheme.yAxis}
            width={70}
          />
          <Tooltip
            {...chartTheme.tooltip}
            formatter={(value) => [Number(value).toLocaleString(), valueLabel]}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={slugColorMap[entry.slug] || chartTheme.colors.primary}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
