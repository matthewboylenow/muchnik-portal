"use client";

import { cn } from "@/lib/utils";
import { TrendIndicator } from "./TrendIndicator";
import { motion } from "framer-motion";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

interface MetricCardProps {
  label: string;
  value: number;
  format?: "number" | "percent" | "decimal" | "currency" | "duration";
  change?: number;
  changeLabel?: string;
  invertTrend?: boolean;
  className?: string;
}

function formatMetricValue(value: number, format: MetricCardProps["format"]): string {
  switch (format) {
    case "percent":
      return `${value.toFixed(1)}%`;
    case "decimal":
      return value.toFixed(2);
    case "currency":
      return `$${value.toLocaleString()}`;
    case "duration": {
      const mins = Math.floor(value / 60);
      const secs = value % 60;
      return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    }
    default:
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      return value.toLocaleString();
  }
}

export function MetricCard({
  label,
  value,
  format = "number",
  change,
  changeLabel,
  invertTrend = false,
  className,
}: MetricCardProps) {
  const animatedValue = useAnimatedValue(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("glass-card-static p-5", className)}
    >
      <p className="text-xs font-medium tracking-wider uppercase text-[var(--text-tertiary)] mb-2">
        {label}
      </p>
      <p className="font-mono text-4xl font-bold tracking-tight text-[var(--text-primary)]">
        {formatMetricValue(Math.round(animatedValue), format)}
      </p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-2">
          <TrendIndicator value={change} invert={invertTrend} />
          {changeLabel && (
            <span className="text-xs text-[var(--text-muted)]">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
