import { cn } from "@/lib/utils";

interface RankBadgeProps {
  position: number | null;
  change?: number | null;
  size?: "sm" | "md" | "lg";
}

export function RankBadge({ position, change, size = "md" }: RankBadgeProps) {
  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getColor = (pos: number | null) => {
    if (!pos) return "border-[var(--text-muted)] text-[var(--text-muted)]";
    if (pos <= 3) return "border-amber-400 text-amber-400 bg-amber-400/10";
    if (pos <= 10) return "border-[var(--color-positive)] text-[var(--color-positive)] bg-[var(--color-positive)]/10";
    if (pos <= 20) return "border-[var(--color-warning)] text-[var(--color-warning)] bg-[var(--color-warning)]/10";
    return "border-[var(--color-negative)] text-[var(--color-negative)] bg-[var(--color-negative)]/10";
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={cn(
          "flex items-center justify-center rounded-full border font-mono font-medium",
          sizeClasses[size],
          getColor(position)
        )}
      >
        {position ?? "—"}
      </div>
      {change !== undefined && change !== null && change !== 0 && (
        <span
          className={cn(
            "text-xs font-medium font-mono",
            change < 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]"
          )}
        >
          {change < 0 ? `↑${Math.abs(change)}` : `↓${change}`}
        </span>
      )}
    </div>
  );
}
