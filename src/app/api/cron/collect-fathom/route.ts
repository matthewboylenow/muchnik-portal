import { cronHandler } from "../utils";
import { db } from "@/lib/db";
import { trafficData, locations } from "@/lib/db/schema";
import {
  fetchFathomAggregations,
  fetchFathomTopPages,
} from "@/lib/api/fathom";

const LOCATION_PATHS: Record<string, string> = {
  manhattan: "/manhattan",
  "staten-island": "/staten-island",
  "morris-county": "/new-jersey",
};

async function collectFathom() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  const allLocations = await db.select().from(locations);

  // Sitewide data
  try {
    const sitewide = await fetchFathomAggregations(dateStr, dateStr);
    const topPages = await fetchFathomTopPages(dateStr, dateStr);

    await db
      .insert(trafficData)
      .values({
        recordedDate: dateStr,
        locationId: null,
        pageviews: parseInt(sitewide[0]?.visits || "0", 10),
        uniqueVisitors: parseInt(sitewide[0]?.uniques || "0", 10),
        avgDuration: parseInt(sitewide[0]?.avg_duration || "0", 10),
        bounceRate: sitewide[0]?.bounce_rate || null,
        topPages: topPages || null,
      })
      .onConflictDoUpdate({
        target: [trafficData.recordedDate, trafficData.locationId],
        set: {
          pageviews: parseInt(sitewide[0]?.visits || "0", 10),
          uniqueVisitors: parseInt(sitewide[0]?.uniques || "0", 10),
          avgDuration: parseInt(sitewide[0]?.avg_duration || "0", 10),
          bounceRate: sitewide[0]?.bounce_rate || null,
          topPages: topPages || null,
        },
      });

    console.log("[collect-fathom] Sitewide data saved");
  } catch (error) {
    console.error("[collect-fathom] Sitewide failed:", error);
  }

  // Per-location data
  for (const location of allLocations) {
    const path = LOCATION_PATHS[location.slug];
    if (!path) continue;

    try {
      const filters = JSON.stringify([
        { property: "pathname", operator: "is like", value: `${path}*` },
      ]);

      const locData = await fetchFathomAggregations(dateStr, dateStr, filters);

      await db
        .insert(trafficData)
        .values({
          recordedDate: dateStr,
          locationId: location.id,
          pageviews: parseInt(locData[0]?.visits || "0", 10),
          uniqueVisitors: parseInt(locData[0]?.uniques || "0", 10),
          avgDuration: parseInt(locData[0]?.avg_duration || "0", 10),
          bounceRate: locData[0]?.bounce_rate || null,
        })
        .onConflictDoUpdate({
          target: [trafficData.recordedDate, trafficData.locationId],
          set: {
            pageviews: parseInt(locData[0]?.visits || "0", 10),
            uniqueVisitors: parseInt(locData[0]?.uniques || "0", 10),
            avgDuration: parseInt(locData[0]?.avg_duration || "0", 10),
            bounceRate: locData[0]?.bounce_rate || null,
          },
        });

      console.log(`[collect-fathom] ${location.slug}: saved`);
    } catch (error) {
      console.error(`[collect-fathom] Failed for ${location.slug}:`, error);
    }
  }
}

export async function GET(request: Request) {
  return cronHandler(request, collectFathom, "collect-fathom");
}
