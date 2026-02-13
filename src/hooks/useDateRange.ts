"use client";

import { useState, useCallback } from "react";

interface DateRange {
  from: Date;
  to: Date;
}

export function useDateRange(defaultDays = 30) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - defaultDays * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const setPreset = useCallback((days: number) => {
    setDateRange({
      from: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      to: new Date(),
    });
  }, []);

  return { dateRange, setDateRange, setPreset };
}
