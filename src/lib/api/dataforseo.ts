const getCredentials = () =>
  Buffer.from(
    `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
  ).toString("base64");

const LOCATION_CODES: Record<string, number> = {
  manhattan: 1023191,
  "staten-island": 1023191,
  "morris-county": 1022412,
};

interface SerpTask {
  keyword: string;
  location_code: number;
  language_code: string;
  device: string;
  os: string;
  depth: number;
}

export async function fetchSerpResults(
  keywords: Array<{ keyword: string; locationSlug: string }>
) {
  const tasks: SerpTask[] = keywords.map((kw) => ({
    keyword: kw.keyword,
    location_code: LOCATION_CODES[kw.locationSlug] || 1023191,
    language_code: "en",
    device: "desktop",
    os: "windows",
    depth: 100,
  }));

  const batches: SerpTask[][] = [];
  for (let i = 0; i < tasks.length; i += 100) {
    batches.push(tasks.slice(i, i + 100));
  }

  const allResults = [];
  for (const batch of batches) {
    const response = await fetch(
      "https://api.dataforseo.com/v3/serp/google/organic/live/regular",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${getCredentials()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batch),
      }
    );
    if (!response.ok) throw new Error(`DataForSEO API error: ${response.status}`);
    const data = await response.json();
    if (data.tasks) allResults.push(...data.tasks);
  }
  return allResults;
}

export function parseSerpResult(
  task: Record<string, unknown>,
  ourDomain: string,
  competitorDomains: string[]
) {
  const result = task.result as Array<Record<string, unknown>> | undefined;
  if (!result?.[0]) return null;

  const items = (result[0].items as Array<Record<string, unknown>>) || [];
  const ourResult = items.find(
    (item) => typeof item.url === "string" && item.url.includes(ourDomain)
  );

  const localPack = items.find((item) => item.type === "local_pack") as Record<string, unknown> | undefined;
  const localPackItems = (localPack?.items as Array<Record<string, unknown>>) || [];
  const ourLocalPackEntry = localPackItems.find(
    (entry) => typeof entry.domain === "string" && entry.domain.includes(ourDomain)
  );

  const competitorResults: Record<string, { position: number; url: string; localPackPosition: number | null }> = {};
  for (const domain of competitorDomains) {
    const compResult = items.find(
      (item) => typeof item.url === "string" && item.url.includes(domain)
    );
    const compLocalPack = localPackItems.find(
      (entry) => typeof entry.domain === "string" && entry.domain.includes(domain)
    );
    if (compResult) {
      competitorResults[domain] = {
        position: compResult.rank_absolute as number,
        url: compResult.url as string,
        localPackPosition: compLocalPack ? (compLocalPack.rank_in_group as number) : null,
      };
    }
  }

  return {
    position: ourResult ? (ourResult.rank_absolute as number) : null,
    url: ourResult ? (ourResult.url as string) : null,
    localPackPosition: ourLocalPackEntry ? (ourLocalPackEntry.rank_in_group as number) : null,
    featuredSnippet: ourResult ? (ourResult.is_featured_snippet as boolean) || false : false,
    competitorResults,
  };
}
