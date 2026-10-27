export const GA_ID = "G-DMEDMEHMCJ";
export const CONSENT_VERSION = "2026-10-27";
export const STORAGE_KEY = "carolina_analytics_consent_v2";
export const LEGACY_STORAGE_KEY = "carolina_analytics_consent_v1";
export const BOOKING_SOURCE_KEY = "carolina_booking_source_v2";
export const CONSENT_MAX_AGE = 1000 * 60 * 60 * 24 * 180;
export type ConsentChoice = "accepted" | "rejected";

// Unknown routes are excluded by default. No clinical topics, forms or tokens.
const ANALYTICS_PAGES: Record<string, string> = {
  "/": "Inicio",
  "/sobre-mi/": "Sobre la profesional",
  "/residencias/": "Servicios para centros",
  "/articulos/": "Artículos",
  "/podcast/": "Podcast",
  "/recursos/": "Recursos",
};
export function analyticsPage(path: string) {
  const normalized = path === "/" || path.endsWith("/") ? path : path + "/";
  return Object.hasOwn(ANALYTICS_PAGES, normalized) ? { path: normalized, title: ANALYTICS_PAGES[normalized] } : null;
}
export function consentFromRecord(raw: string | null, now = Date.now()): ConsentChoice | null {
  try {
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (value.version !== CONSENT_VERSION || !["accepted", "rejected"].includes(value.choice)) return null;
    if (typeof value.updatedAt !== "number" || !Number.isFinite(value.updatedAt)) return null;
    const age = now - value.updatedAt;
    return age >= 0 && age < CONSENT_MAX_AGE ? value.choice : null;
  } catch { return null; }
}
export function cookieDomains(host: string) {
  const parts = host.split(".");
  return [...new Set(parts.slice(0, -1).flatMap((_, i) => {
    const domain = parts.slice(i).join(".");
    return [domain, "." + domain];
  }))];
}
