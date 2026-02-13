"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LocationSlug } from "@/types";

interface LocationCardProps {
  slug: LocationSlug;
  name: string;
  address?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const locationBarClass: Record<LocationSlug, string> = {
  manhattan: "location-bar-manhattan",
  "staten-island": "location-bar-staten-island",
  "morris-county": "location-bar-morris-county",
};

const locationGlowClass: Record<LocationSlug, string> = {
  manhattan: "glass-card-manhattan",
  "staten-island": "glass-card-staten-island",
  "morris-county": "glass-card-morris-county",
};

export function LocationCard({
  slug,
  name,
  address,
  children,
  onClick,
  className,
}: LocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass-card overflow-hidden cursor-pointer",
        locationGlowClass[slug],
        className
      )}
      onClick={onClick}
    >
      <div className={cn("h-1 w-full", locationBarClass[slug])} />
      <div className="p-5">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {name}
        </h3>
        {address && (
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{address}</p>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </motion.div>
  );
}
