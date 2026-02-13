import { cronHandler } from "../utils";
import { db } from "@/lib/db";
import { searchConsoleData, locations } from "@/lib/db/schema";
import { fetchSearchConsoleData } from "@/lib/api/google-search-console";
import { eq } from "drizzle-orm";

async function collectGSC() {
  const allLocations = await db.select().from(locations);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - 3);
  const dateStr = targetDate.toISOString().split("T")[0];

  const locationMap = new Map(allLocations.map((l) => [l.slug, l.id]));
  const results = await fetchSearchConsoleData(dateStr);

  for (const row of results) {
    const locationId = row.locationSlug ? locationMap.get(row.locationSlug as "manhattan" | "staten-island" | "morris-county") ?? null : null;

    try {
      await db
        .insert(searchConsoleData)
        .values({
          recordedDate: dateStr,
          query: row.query,
          page: row.page,
          locationId,
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: String(row.ctr),
          position: String(row.position),
        })
        .onConflictDoUpdate({
          target: [searchConsoleData.recordedDate, searchConsoleData.query, searchConsoleData.page],
          set: {
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: String(row.ctr),
            position: String(row.position),
            locationId,
          },
        });
    } catch (error) {
      console.error(`[collect-gsc] Failed for query "${row.query}":`, error);
    }
  }

  console.log(`[collect-gsc] Processed ${results.length} rows`);
}

export async function GET(request: Request) {
  return cronHandler(request, collectGSC, "collect-gsc");
}
