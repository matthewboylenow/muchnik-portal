import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  invert?: boolean;
  showValue?: boolean;
  size?: "sm" | "md";
}

export function TrendIndicator({
  value,
  invert = false,
  showValue = true,
  size = "sm",
}: TrendIndicatorProps) {
  const isPositive = invert ? value < 0 : value > 0;
  const isNegative = invert ? value > 0 : value < 0;
  const isNeutral = value === 0;

  const iconSize = size === "sm" ? 14 : 16;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isPositive && "bg-[var(--color-positive)]/10 text-[var(--color-positive)]",
        isNegative && "bg-[var(--color-negative)]/10 text-[var(--color-negative)]",
        isNeutral && "bg-[var(--bg-surface)] text-[var(--text-muted)]"
      )}
    >
      {isPositive && <TrendingUp size={iconSize} />}
      {isNegative && <TrendingDown size={iconSize} />}
      {isNeutral && <Minus size={iconSize} />}
      {showValue && (
        <span>
          {value > 0 ? "+" : ""}
          {Math.abs(value) < 100 ? value.toFixed(1) : Math.round(value)}
          {!invert ? "%" : ""}
        </span>
      )}
    </div>
  );
}
