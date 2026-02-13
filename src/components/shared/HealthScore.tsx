"use client";

import { cn } from "@/lib/utils";
import { useAnimatedValue } from "@/hooks/useAnimatedValue";

interface HealthScoreProps {
  score: number;
  color: string;
  size?: number;
  label?: string;
  className?: string;
}

export function HealthScore({ score, color, size = 120, label, className }: HealthScoreProps) {
  const animatedScore = useAnimatedValue(score);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-2xl font-bold text-[var(--text-primary)]">
            {Math.round(animatedScore)}
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-xs font-medium text-[var(--text-tertiary)]">
          {label}
        </span>
      )}
    </div>
  );
}
