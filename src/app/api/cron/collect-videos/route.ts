import { cronHandler } from "../utils";
import { db } from "@/lib/db";
import { videoMetrics, contentPieces } from "@/lib/db/schema";
import { fetchChannelVideos, fetchVideoStatistics } from "@/lib/api/youtube";
import { fetchBunnyVideos } from "@/lib/api/bunny";
import { eq } from "drizzle-orm";

async function collectVideos() {
  const today = new Date().toISOString().split("T")[0];

  // YouTube
  try {
    const videoIds = await fetchChannelVideos();
    if (videoIds.length > 0) {
      const stats = await fetchVideoStatistics(videoIds);
      const items = stats.items || [];

      for (const video of items) {
        const snippet = video.snippet || {};
        const statistics = video.statistics || {};

        const existingContent = await db
          .select()
          .from(contentPieces)
          .where(eq(contentPieces.slug, video.id))
          .limit(1);

        await db
          .insert(videoMetrics)
          .values({
            contentId: existingContent[0]?.id || null,
            platform: "youtube",
            externalId: video.id,
            recordedDate: today,
            views: parseInt(statistics.viewCount || "0", 10),
            likes: parseInt(statistics.likeCount || "0", 10),
            comments: parseInt(statistics.commentCount || "0", 10),
          })
          .onConflictDoUpdate({
            target: [
              videoMetrics.externalId,
              videoMetrics.platform,
              videoMetrics.recordedDate,
            ],
            set: {
              views: parseInt(statistics.viewCount || "0", 10),
              likes: parseInt(statistics.likeCount || "0", 10),
              comments: parseInt(statistics.commentCount || "0", 10),
            },
          });
      }

      console.log(`[collect-videos] YouTube: ${items.length} videos`);
    }
  } catch (error) {
    console.error("[collect-videos] YouTube failed:", error);
  }

  // Bunny.net
  try {
    const bunnyData = await fetchBunnyVideos();
    const bunnyVideos = bunnyData.items || [];

    for (const video of bunnyVideos) {
      await db
        .insert(videoMetrics)
        .values({
          contentId: null,
          platform: "bunny",
          externalId: video.guid,
          recordedDate: today,
          views: video.views || 0,
          avgViewDuration: video.averageWatchTime || null,
        })
        .onConflictDoUpdate({
          target: [
            videoMetrics.externalId,
            videoMetrics.platform,
            videoMetrics.recordedDate,
          ],
          set: {
            views: video.views || 0,
            avgViewDuration: video.averageWatchTime || null,
          },
        });
    }

    console.log(`[collect-videos] Bunny: ${bunnyVideos.length} videos`);
  } catch (error) {
    console.error("[collect-videos] Bunny failed:", error);
  }
}

export async function GET(request: Request) {
  return cronHandler(request, collectVideos, "collect-videos");
}
