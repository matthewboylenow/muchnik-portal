const FATHOM_API_BASE = "https://api.usefathom.com/v1";

function getHeaders() {
  return { Authorization: `Bearer ${process.env.FATHOM_API_KEY}` };
}

export async function fetchFathomAggregations(dateFrom: string, dateTo: string, filters?: string) {
  const params = new URLSearchParams({
    entity_id: process.env.FATHOM_SITE_ID!,
    entity: "pageview",
    aggregates: "visits,uniques,avg_duration,bounce_rate",
    date_from: dateFrom,
    date_to: dateTo,
  });
  if (filters) params.set("filters", filters);

  const response = await fetch(`${FATHOM_API_BASE}/aggregations?${params}`, { headers: getHeaders() });
  if (!response.ok) throw new Error(`Fathom API error: ${response.status}`);
  return response.json();
}

export async function fetchFathomTopPages(dateFrom: string, dateTo: string) {
  const params = new URLSearchParams({
    entity_id: process.env.FATHOM_SITE_ID!,
    entity: "pageview",
    aggregates: "visits",
    field_grouping: "pathname",
    date_from: dateFrom,
    date_to: dateTo,
    sort_by: "visits:desc",
    limit: "20",
  });

  const response = await fetch(`${FATHOM_API_BASE}/aggregations?${params}`, { headers: getHeaders() });
  if (!response.ok) throw new Error(`Fathom API error: ${response.status}`);
  return response.json();
}
