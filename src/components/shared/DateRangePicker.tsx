"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronDown } from "lucide-react";
import { DATE_RANGE_PRESETS } from "@/lib/constants";

interface DateRangePickerProps {
  value: { from: Date; to: Date };
  onChange: (range: { from: Date; to: Date }) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState("30d");

  const handlePresetClick = (preset: (typeof DATE_RANGE_PRESETS)[number]) => {
    setActivePreset(preset.label);
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - preset.days);
    onChange({ from, to });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-1">
        {DATE_RANGE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className={cn(
              "rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-all duration-150",
              activePreset === preset.label
                ? "bg-[var(--bg-glass-active)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <button className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:border-[var(--border-strong)] transition-colors">
        <Calendar size={14} />
        <span>
          {value.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          {" — "}
          {value.to.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <ChevronDown size={14} />
      </button>
    </div>
  );
}
