import { cronHandler } from "../utils";
import { db } from "@/lib/db";
import {
  keywords,
  keywordRankings,
  competitors,
  competitorRankings,
  locations,
} from "@/lib/db/schema";
import { fetchSerpResults, parseSerpResult } from "@/lib/api/dataforseo";
import { eq, and, desc } from "drizzle-orm";

async function collectRankings() {
  const allKeywords = await db
    .select()
    .from(keywords)
    .where(eq(keywords.isActive, true));

  const allLocations = await db.select().from(locations);
  const allCompetitors = await db
    .select()
    .from(competitors)
    .where(eq(competitors.isActive, true));

  const locationMap = new Map(allLocations.map((l) => [l.id, l]));
  const today = new Date().toISOString().split("T")[0];

  const keywordBatches = allKeywords.map((kw) => ({
    keyword: kw.keyword,
    locationSlug: locationMap.get(kw.locationId)?.slug || "manhattan",
  }));

  if (keywordBatches.length === 0) {
    console.log("[collect-rankings] No active keywords");
    return;
  }

  const serpResults = await fetchSerpResults(keywordBatches);

  const competitorDomains = allCompetitors.map((c) => c.domain);

  for (let i = 0; i < serpResults.length; i++) {
    const kw = allKeywords[i];
    if (!kw) continue;

    const parsed = parseSerpResult(serpResults[i], "muchnikelderlaw.com", competitorDomains);
    if (!parsed) continue;

    const lastRanking = await db
      .select()
      .from(keywordRankings)
      .where(eq(keywordRankings.keywordId, kw.id))
      .orderBy(desc(keywordRankings.recordedDate))
      .limit(1);

    await db
      .insert(keywordRankings)
      .values({
        keywordId: kw.id,
        locationId: kw.locationId,
        recordedDate: today,
        position: parsed.position,
        previousPosition: lastRanking[0]?.position ?? null,
        url: parsed.url,
        localPackPosition: parsed.localPackPosition,
        featuredSnippet: parsed.featuredSnippet,
      })
      .onConflictDoUpdate({
        target: [keywordRankings.keywordId, keywordRankings.recordedDate],
        set: {
          position: parsed.position,
          previousPosition: lastRanking[0]?.position ?? null,
          url: parsed.url,
          localPackPosition: parsed.localPackPosition,
          featuredSnippet: parsed.featuredSnippet,
        },
      });

    for (const [domain, compData] of Object.entries(parsed.competitorResults)) {
      const comp = allCompetitors.find((c) => c.domain === domain);
      if (!comp) continue;

      await db
        .insert(competitorRankings)
        .values({
          competitorId: comp.id,
          keywordId: kw.id,
          recordedDate: today,
          position: compData.position,
          url: compData.url,
          localPackPosition: compData.localPackPosition,
        })
        .onConflictDoUpdate({
          target: [
            competitorRankings.competitorId,
            competitorRankings.keywordId,
            competitorRankings.recordedDate,
          ],
          set: {
            position: compData.position,
            url: compData.url,
            localPackPosition: compData.localPackPosition,
          },
        });
    }
  }

  console.log(`[collect-rankings] Processed ${serpResults.length} keywords`);
}

export async function GET(request: Request) {
  return cronHandler(request, collectRankings, "collect-rankings");
}
