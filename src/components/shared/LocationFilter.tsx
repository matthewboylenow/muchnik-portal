"use client";

import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/lib/constants";
import type { LocationSlug } from "@/types";

interface LocationFilterProps {
  value: LocationSlug | "all";
  onChange: (value: LocationSlug | "all") => void;
  className?: string;
}

export function LocationFilter({ value, onChange, className }: LocationFilterProps) {
  return (
    <div className={cn("flex items-center gap-1 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-1", className)}>
      <button
        onClick={() => onChange("all")}
        className={cn(
          "rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-all duration-150",
          value === "all"
            ? "bg-[var(--bg-glass-active)] text-[var(--text-primary)] shadow-sm"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        )}
      >
        All
      </button>
      {LOCATIONS.map((loc) => (
        <button
          key={loc.slug}
          onClick={() => onChange(loc.slug)}
          className={cn(
            "flex items-center gap-1.5 rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-all duration-150",
            value === loc.slug
              ? "bg-[var(--bg-glass-active)] text-[var(--text-primary)] shadow-sm"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          )}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: loc.colorHex }}
          />
          {loc.shortName}
        </button>
      ))}
    </div>
  );
}
