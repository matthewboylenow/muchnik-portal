import { google } from "googleapis";

function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

async function getAccessToken() {
  const auth = getAuth();
  const { token } = await auth.getAccessToken();
  return token;
}

const GBP_LOCATIONS: Record<string, string | undefined> = {
  manhattan: process.env.GBP_LOCATION_MANHATTAN,
  "staten-island": process.env.GBP_LOCATION_STATEN_ISLAND,
  "morris-county": process.env.GBP_LOCATION_MORRIS_COUNTY,
};

export async function fetchGBPMetrics(
  locationSlug: string,
  startDate: { year: number; month: number; day: number },
  endDate: { year: number; month: number; day: number }
) {
  const accessToken = await getAccessToken();
  const locationName = GBP_LOCATIONS[locationSlug];
  if (!locationName) return null;

  const metrics = [
    "QUERIES_DIRECT",
    "QUERIES_INDIRECT",
    "CALL_CLICKS",
    "WEBSITE_CLICKS",
    "BUSINESS_DIRECTION_REQUESTS",
  ];

  const params = new URLSearchParams();
  metrics.forEach((m) => params.append("dailyMetric", m));
  params.set("dailyRange.startDate.year", startDate.year.toString());
  params.set("dailyRange.startDate.month", startDate.month.toString());
  params.set("dailyRange.startDate.day", startDate.day.toString());
  params.set("dailyRange.endDate.year", endDate.year.toString());
  params.set("dailyRange.endDate.month", endDate.month.toString());
  params.set("dailyRange.endDate.day", endDate.day.toString());

  const response = await fetch(
    `https://businessprofileperformance.googleapis.com/v1/${locationName}:getDailyMetricsTimeSeries?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!response.ok) {
    throw new Error(`GBP API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
