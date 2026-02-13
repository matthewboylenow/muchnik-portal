"use client";

import { useState, useEffect } from "react";
import type { LocationSlug } from "@/types";

interface LocationData {
  slug: LocationSlug;
  name: string;
  healthScore: number;
  avgPosition: number;
  avgPositionChange: number;
  traffic: number;
  trafficChange: number;
  gbpActions: number;
  gbpActionsChange: number;
  reviewCount: number;
  avgRating: number;
}

export function useLocationData() {
  const [data, setData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    setData([
      {
        slug: "manhattan",
        name: "Manhattan",
        healthScore: 78,
        avgPosition: 8.4,
        avgPositionChange: -2.1,
        traffic: 1200,
        trafficChange: 15.3,
        gbpActions: 47,
        gbpActionsChange: 12,
        reviewCount: 24,
        avgRating: 4.8,
      },
      {
        slug: "staten-island",
        name: "Staten Island",
        healthScore: 65,
        avgPosition: 12.1,
        avgPositionChange: -1.5,
        traffic: 890,
        trafficChange: 8.7,
        gbpActions: 32,
        gbpActionsChange: 18.5,
        reviewCount: 18,
        avgRating: 4.6,
      },
      {
        slug: "morris-county",
        name: "Morris County",
        healthScore: 72,
        avgPosition: 10.3,
        avgPositionChange: -3.2,
        traffic: 1100,
        trafficChange: 22.1,
        gbpActions: 28,
        gbpActionsChange: 5.2,
        reviewCount: 31,
        avgRating: 4.9,
      },
    ]);
    setLoading(false);
  }, []);

  return { data, loading };
}
