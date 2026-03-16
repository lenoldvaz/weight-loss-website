import type { LocationServiceSeedData } from "../types.js";

const SERVICES = [
  { type: "weight loss clinic", slug: "weight-loss-clinics" },
  { type: "registered dietitian", slug: "dietitians" },
  { type: "bariatric surgeon", slug: "bariatric-surgery" },
];

const CITIES: Array<{ city: string; province: string; province_code: string }> = [
  { city: "Toronto", province: "Ontario", province_code: "ON" },
  { city: "Ottawa", province: "Ontario", province_code: "ON" },
  { city: "Mississauga", province: "Ontario", province_code: "ON" },
  { city: "Hamilton", province: "Ontario", province_code: "ON" },
  { city: "London", province: "Ontario", province_code: "ON" },
  { city: "Vancouver", province: "British Columbia", province_code: "BC" },
  { city: "Surrey", province: "British Columbia", province_code: "BC" },
  { city: "Burnaby", province: "British Columbia", province_code: "BC" },
  { city: "Victoria", province: "British Columbia", province_code: "BC" },
  { city: "Calgary", province: "Alberta", province_code: "AB" },
  { city: "Edmonton", province: "Alberta", province_code: "AB" },
  { city: "Red Deer", province: "Alberta", province_code: "AB" },
  { city: "Montreal", province: "Quebec", province_code: "QC" },
  { city: "Quebec City", province: "Quebec", province_code: "QC" },
  { city: "Laval", province: "Quebec", province_code: "QC" },
  { city: "Winnipeg", province: "Manitoba", province_code: "MB" },
  { city: "Halifax", province: "Nova Scotia", province_code: "NS" },
  { city: "Saskatoon", province: "Saskatchewan", province_code: "SK" },
  { city: "Regina", province: "Saskatchewan", province_code: "SK" },
  { city: "St. John's", province: "Newfoundland", province_code: "NL" },
];

// Generate all combinations: 20 cities × 3 services = 60 seeds
export const locationServiceSeeds: LocationServiceSeedData[] = CITIES.flatMap(
  (city) =>
    SERVICES.map((service) => ({
      template: "location-service" as const,
      city: city.city,
      province: city.province,
      province_code: city.province_code,
      service_type: service.type,
      service_slug: service.slug,
      year: 2026,
    }))
);
