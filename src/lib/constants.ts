export const LOCATIONS = [
  {
    slug: "manhattan" as const,
    name: "Manhattan - Financial District",
    shortName: "Manhattan",
    address: "11 Broadway, Suite 615",
    city: "New York",
    state: "NY",
    zip: "10004",
    phone: "(212) 597-2427",
    latitude: "40.7054",
    longitude: "-74.0134",
    radiusMiles: 5,
    marketCharacter:
      "Dense urban, high-net-worth. Focus on estate tax planning, asset protection, business succession.",
    colorHex: "#6366F1",
    urlPattern: "/manhattan/",
  },
  {
    slug: "staten-island" as const,
    name: "Staten Island",
    shortName: "Staten Island",
    address: "900 South Avenue, Executive Suites",
    city: "Staten Island",
    state: "NY",
    zip: "10314",
    phone: "(718) 442-7004",
    latitude: "40.5834",
    longitude: "-74.1496",
    radiusMiles: 15,
    marketCharacter:
      "Suburban bridge market between NY and NJ. Family-focused elder law and Medicaid planning.",
    colorHex: "#06B6D4",
    urlPattern: "/staten-island/",
  },
  {
    slug: "morris-county" as const,
    name: "Morris County - Randolph, NJ",
    shortName: "Morris County",
    address: "10 W. Hanover Avenue, Suite 111",
    city: "Randolph",
    state: "NJ",
    zip: "07869",
    phone: "(201) 582-8014",
    latitude: "40.8484",
    longitude: "-74.5765",
    radiusMiles: 20,
    marketCharacter:
      "Suburban NJ corridor. Community-focused Medicaid planning, long-term care, guardianship.",
    colorHex: "#10B981",
    urlPattern: "/new-jersey/",
  },
] as const;

export type LocationSlug = (typeof LOCATIONS)[number]["slug"];

export const KEYWORD_CATEGORIES = [
  { value: "medicaid-planning", label: "Medicaid Planning" },
  { value: "estate-planning", label: "Estate Planning" },
  { value: "asset-protection", label: "Asset Protection" },
  { value: "guardianship", label: "Guardianship" },
  { value: "elder-law-general", label: "Elder Law (General)" },
  { value: "long-term-care", label: "Long-Term Care" },
  { value: "veterans-benefits", label: "Veterans Benefits" },
  { value: "trust-administration", label: "Trust Administration" },
  { value: "probate", label: "Probate" },
  { value: "special-needs", label: "Special Needs" },
] as const;

export const DATE_RANGE_PRESETS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "6m", days: 180 },
  { label: "12m", days: 365 },
] as const;

export const DATAFORSEO_LOCATION_CODES = {
  manhattan: 1023191,
  "staten-island": 1023191,
  "morris-county": 1022412,
} as const;
