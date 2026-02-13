import { db } from "./index";
import {
  users,
  locations,
  keywords,
  competitors,
  keywordRankings,
  alerts,
} from "./schema";
import { LOCATIONS } from "../constants";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Clear tables
  await db.execute(sql`TRUNCATE TABLE alerts CASCADE`);
  await db.execute(sql`TRUNCATE TABLE keyword_rankings CASCADE`);
  await db.execute(sql`TRUNCATE TABLE competitor_rankings CASCADE`);
  await db.execute(sql`TRUNCATE TABLE competitors CASCADE`);
  await db.execute(sql`TRUNCATE TABLE keywords CASCADE`);
  await db.execute(sql`TRUNCATE TABLE search_console_data CASCADE`);
  await db.execute(sql`TRUNCATE TABLE gbp_metrics CASCADE`);
  await db.execute(sql`TRUNCATE TABLE traffic_data CASCADE`);
  await db.execute(sql`TRUNCATE TABLE content_performance CASCADE`);
  await db.execute(sql`TRUNCATE TABLE content_pieces CASCADE`);
  await db.execute(sql`TRUNCATE TABLE video_metrics CASCADE`);
  await db.execute(sql`TRUNCATE TABLE reviews CASCADE`);
  await db.execute(sql`TRUNCATE TABLE citations CASCADE`);
  await db.execute(sql`TRUNCATE TABLE goals CASCADE`);
  await db.execute(sql`TRUNCATE TABLE monthly_summaries CASCADE`);
  await db.execute(sql`TRUNCATE TABLE technical_audits CASCADE`);
  await db.execute(sql`TRUNCATE TABLE locations CASCADE`);
  await db.execute(sql`TRUNCATE TABLE users CASCADE`);

  // Seed users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const clientPassword = await bcrypt.hash("client123", 10);

  const [adminUser] = await db
    .insert(users)
    .values([
      {
        email: "admin@muchnikelderlaw.com",
        passwordHash: adminPassword,
        name: "SEO Admin",
        role: "admin",
      },
      {
        email: "kirill@muchnikelderlaw.com",
        passwordHash: clientPassword,
        name: "Kirill Muchnik",
        role: "client",
      },
    ])
    .returning();

  console.log("Users seeded");

  // Seed locations
  const insertedLocations = await db
    .insert(locations)
    .values(
      LOCATIONS.map((loc) => ({
        slug: loc.slug,
        name: loc.name,
        shortName: loc.shortName,
        address: loc.address,
        city: loc.city,
        state: loc.state,
        zip: loc.zip,
        phone: loc.phone,
        latitude: loc.latitude,
        longitude: loc.longitude,
        radiusMiles: loc.radiusMiles,
        marketCharacter: loc.marketCharacter,
        colorHex: loc.colorHex,
      }))
    )
    .returning();

  console.log("Locations seeded");

  const locationMap = new Map(insertedLocations.map((l) => [l.slug, l.id]));
  const manhattanId = locationMap.get("manhattan")!;
  const statenIslandId = locationMap.get("staten-island")!;
  const morrisCountyId = locationMap.get("morris-county")!;

  // Seed keywords
  const keywordData = [
    // Manhattan
    { keyword: "elder law attorney manhattan", locationId: manhattanId, category: "elder-law-general" as const, isPrimary: true, monthlySearchVolume: 720, targetPosition: 3 },
    { keyword: "medicaid planning attorney nyc", locationId: manhattanId, category: "medicaid-planning" as const, isPrimary: true, monthlySearchVolume: 480, targetPosition: 5 },
    { keyword: "estate planning lawyer nyc", locationId: manhattanId, category: "estate-planning" as const, isPrimary: true, monthlySearchVolume: 590, targetPosition: 5 },
    { keyword: "guardianship lawyer nyc", locationId: manhattanId, category: "guardianship" as const, isPrimary: false, monthlySearchVolume: 260, targetPosition: 10 },
    { keyword: "asset protection attorney nyc", locationId: manhattanId, category: "asset-protection" as const, isPrimary: false, monthlySearchVolume: 390, targetPosition: 10 },
    { keyword: "elder law firm manhattan", locationId: manhattanId, category: "elder-law-general" as const, isPrimary: false, monthlySearchVolume: 320, targetPosition: 5 },
    { keyword: "medicaid spend down attorney nyc", locationId: manhattanId, category: "medicaid-planning" as const, isPrimary: false, monthlySearchVolume: 170, targetPosition: 10 },
    { keyword: "trust attorney manhattan", locationId: manhattanId, category: "trust-administration" as const, isPrimary: false, monthlySearchVolume: 210, targetPosition: 10 },
    // Staten Island
    { keyword: "estate planning lawyer staten island", locationId: statenIslandId, category: "estate-planning" as const, isPrimary: true, monthlySearchVolume: 320, targetPosition: 3 },
    { keyword: "elder law attorney staten island", locationId: statenIslandId, category: "elder-law-general" as const, isPrimary: true, monthlySearchVolume: 280, targetPosition: 3 },
    { keyword: "medicaid attorney staten island", locationId: statenIslandId, category: "medicaid-planning" as const, isPrimary: true, monthlySearchVolume: 190, targetPosition: 5 },
    { keyword: "probate lawyer staten island", locationId: statenIslandId, category: "probate" as const, isPrimary: false, monthlySearchVolume: 140, targetPosition: 10 },
    { keyword: "trust attorney staten island", locationId: statenIslandId, category: "trust-administration" as const, isPrimary: false, monthlySearchVolume: 110, targetPosition: 10 },
    // Morris County
    { keyword: "elder law attorney nj", locationId: morrisCountyId, category: "elder-law-general" as const, isPrimary: true, monthlySearchVolume: 590, targetPosition: 5 },
    { keyword: "medicaid attorney morris county nj", locationId: morrisCountyId, category: "medicaid-planning" as const, isPrimary: true, monthlySearchVolume: 210, targetPosition: 3 },
    { keyword: "estate planning attorney randolph nj", locationId: morrisCountyId, category: "estate-planning" as const, isPrimary: true, monthlySearchVolume: 150, targetPosition: 3 },
    { keyword: "long term care planning nj", locationId: morrisCountyId, category: "long-term-care" as const, isPrimary: false, monthlySearchVolume: 170, targetPosition: 5 },
    { keyword: "guardianship attorney nj", locationId: morrisCountyId, category: "guardianship" as const, isPrimary: false, monthlySearchVolume: 230, targetPosition: 10 },
    { keyword: "veterans benefits attorney nj", locationId: morrisCountyId, category: "veterans-benefits" as const, isPrimary: false, monthlySearchVolume: 120, targetPosition: 10 },
    { keyword: "special needs trust attorney nj", locationId: morrisCountyId, category: "special-needs" as const, isPrimary: false, monthlySearchVolume: 90, targetPosition: 10 },
  ];

  const insertedKeywords = await db.insert(keywords).values(keywordData).returning();
  console.log(`Keywords seeded: ${insertedKeywords.length}`);

  // Seed competitors
  const competitorData = [
    { name: "Littman Krooks LLP", domain: "littmankrooks.com", locationId: manhattanId, notes: "Major NYC elder law firm" },
    { name: "Morgan Legal Group", domain: "morganlegalny.com", locationId: manhattanId, notes: "Estate planning focus" },
    { name: "Russo Law Group", domain: "russolawgroup.com", locationId: manhattanId, notes: "Elder law and estate planning" },
    { name: "Goldberg Law Group", domain: "goldberglawgroup.com", locationId: statenIslandId, notes: "Staten Island competitor" },
    { name: "Begley Law Group", domain: "begleylawgroup.com", locationId: morrisCountyId, notes: "NJ elder law competitor" },
    { name: "Coughlin Law Firm", domain: "coughlinlaw.com", locationId: morrisCountyId, notes: "NJ estate planning" },
  ];

  await db.insert(competitors).values(competitorData);
  console.log("Competitors seeded");

  // Seed sample keyword rankings (last 8 weeks)
  const keywordMap = new Map(insertedKeywords.map((k) => [k.keyword, k]));
  const rankingValues = [];

  for (let week = 0; week < 8; week++) {
    const date = new Date();
    date.setDate(date.getDate() - week * 7);
    const dateStr = date.toISOString().split("T")[0];

    for (const kw of insertedKeywords) {
      const basePosition = kw.targetPosition ? kw.targetPosition + 5 : 15;
      const position = Math.max(1, basePosition + Math.floor(Math.random() * 10) - 5 - Math.floor(week * 0.5));

      rankingValues.push({
        keywordId: kw.id,
        locationId: kw.locationId,
        recordedDate: dateStr,
        position,
        previousPosition: week < 7 ? position + Math.floor(Math.random() * 4) - 2 : null,
        featuredSnippet: position <= 3 && Math.random() > 0.8,
      });
    }
  }

  await db.insert(keywordRankings).values(rankingValues);
  console.log(`Keyword rankings seeded: ${rankingValues.length} entries`);

  // Seed some alerts
  await db.insert(alerts).values([
    {
      title: "Rank drop: 'elder law attorney manhattan'",
      message: "Manhattan: 'elder law attorney manhattan' dropped from #4 to #12",
      severity: "critical",
      locationId: manhattanId,
      visibleToClient: false,
    },
    {
      title: "New 5-star review",
      message: "New 5-star review on Morris County GBP from Sarah M.",
      severity: "info",
      locationId: morrisCountyId,
      visibleToClient: true,
    },
    {
      title: "Competitor content detected",
      message: "Littman Krooks published new blog on Medicaid planning",
      severity: "warning",
      locationId: manhattanId,
      visibleToClient: false,
    },
    {
      title: "Rank improvement: 'medicaid attorney morris county nj'",
      message: "Morris County: Improved from #8 to #5 for 'medicaid attorney morris county nj'",
      severity: "info",
      locationId: morrisCountyId,
      visibleToClient: true,
    },
    {
      title: "Traffic milestone",
      message: "Staten Island pages exceeded 500 organic visits this month",
      severity: "info",
      locationId: statenIslandId,
      visibleToClient: true,
    },
  ]);
  console.log("Alerts seeded");

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
