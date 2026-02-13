import { google } from "googleapis";

function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

const locationUrlPatterns: Record<string, string> = {
  manhattan: "/manhattan/",
  "staten-island": "/staten-island/",
  "morris-county": "/new-jersey/",
};

export async function fetchSearchConsoleData(date: string) {
  const auth = getAuth();
  const searchConsole = google.searchconsole({ version: "v1", auth });

  const response = await searchConsole.searchanalytics.query({
    siteUrl: process.env.GSC_SITE_URL!,
    requestBody: {
      startDate: date,
      endDate: date,
      dimensions: ["query", "page"],
      rowLimit: 1000,
    },
  });

  const results: Array<{
    query: string;
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    locationSlug: string | null;
  }> = [];

  if (response.data.rows) {
    for (const row of response.data.rows) {
      const page = row.keys?.[1] || "";
      let locationSlug: string | null = null;
      for (const [slug, pattern] of Object.entries(locationUrlPatterns)) {
        if (page.includes(pattern)) {
          locationSlug = slug;
          break;
        }
      }
      results.push({
        query: row.keys?.[0] || "",
        page,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
        locationSlug,
      });
    }
  }

  return results;
}
