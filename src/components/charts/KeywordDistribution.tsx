"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { chartTheme } from "./theme";

interface KeywordDistributionProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  title?: string;
}

const DEFAULT_COLORS = [
  "#818CF8", "#22D3EE", "#34D399", "#FBBF24", "#F87171",
  "#A78BFA", "#67E8F9", "#6EE7B7", "#FDE68A", "#FCA5A5",
];

export function KeywordDistribution({
  data,
  height = 250,
  title,
}: KeywordDistributionProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass-card-static p-6">
      {title && (
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
          {title}
        </h3>
      )}
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip {...chartTheme.tooltip} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                  }}
                />
                <span className="text-[var(--text-secondary)]">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--text-primary)]">
                  {entry.value}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  ({total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
