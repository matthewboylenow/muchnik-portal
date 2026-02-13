"use client";

import { useState, useEffect } from "react";
import type { KeywordRankingEntry, LocationSlug } from "@/types";

export function useKeywordRankings(locationFilter?: LocationSlug | "all") {
  const [data, setData] = useState<KeywordRankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    setData([]);
    setLoading(false);
  }, [locationFilter]);

  return { data, loading };
}
