import { cronHandler } from "../utils";
import { db } from "@/lib/db";
import { gbpMetrics, locations } from "@/lib/db/schema";
import { fetchGBPMetrics } from "@/lib/api/google-business";

async function collectGBP() {
  const allLocations = await db.select().from(locations);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  const dateObj = {
    year: yesterday.getFullYear(),
    month: yesterday.getMonth() + 1,
    day: yesterday.getDate(),
  };

  for (const location of allLocations) {
    try {
      const data = await fetchGBPMetrics(location.slug, dateObj, dateObj);
      if (!data) {
        console.log(`[collect-gbp] No data for ${location.slug}`);
        continue;
      }

      const timeSeries = data.timeSeries || [];
      let searchesDirect = 0;
      let searchesDiscovery = 0;
      let actionsWebsite = 0;
      let actionsPhone = 0;
      let actionsDirections = 0;

      for (const series of timeSeries) {
        const value = series.dailyMetricTimeSeries?.dailySubEntityMetrics?.[0]?.timeSeries?.datedValues?.[0]?.value;
        const metric = series.dailyMetric;
        const num = parseInt(value || "0", 10);

        if (metric === "QUERIES_DIRECT") searchesDirect = num;
        if (metric === "QUERIES_INDIRECT") searchesDiscovery = num;
        if (metric === "CALL_CLICKS") actionsPhone = num;
        if (metric === "WEBSITE_CLICKS") actionsWebsite = num;
        if (metric === "BUSINESS_DIRECTION_REQUESTS") actionsDirections = num;
      }

      await db
        .insert(gbpMetrics)
        .values({
          locationId: location.id,
          recordedDate: dateStr,
          searchesDirect,
          searchesDiscovery,
          searchesTotal: searchesDirect + searchesDiscovery,
          actionsWebsite,
          actionsPhone,
          actionsDirections,
          actionsTotal: actionsWebsite + actionsPhone + actionsDirections,
        })
        .onConflictDoUpdate({
          target: [gbpMetrics.locationId, gbpMetrics.recordedDate],
          set: {
            searchesDirect,
            searchesDiscovery,
            searchesTotal: searchesDirect + searchesDiscovery,
            actionsWebsite,
            actionsPhone,
            actionsDirections,
            actionsTotal: actionsWebsite + actionsPhone + actionsDirections,
          },
        });

      console.log(`[collect-gbp] ${location.slug}: saved`);
    } catch (error) {
      console.error(`[collect-gbp] Failed for ${location.slug}:`, error);
    }
  }
}

export async function GET(request: Request) {
  return cronHandler(request, collectGBP, "collect-gbp");
}
