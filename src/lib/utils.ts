import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export function getRankColor(position: number | null): string {
  if (!position) return "text-[var(--text-muted)]";
  if (position <= 3) return "text-amber-400";
  if (position <= 10) return "text-[var(--color-positive)]";
  if (position <= 20) return "text-[var(--color-warning)]";
  return "text-[var(--color-negative)]";
}

export function getRankLabel(position: number | null): string {
  if (!position) return "Not ranking";
  if (position <= 3) return "Top 3";
  if (position <= 10) return "Page 1";
  if (position <= 20) return "Page 2";
  return `Page ${Math.ceil(position / 10)}`;
}

export function getLocationColor(slug: string): string {
  switch (slug) {
    case "manhattan":
      return "var(--color-manhattan)";
    case "staten-island":
      return "var(--color-staten-island)";
    case "morris-county":
      return "var(--color-morris-county)";
    default:
      return "var(--text-secondary)";
  }
}
