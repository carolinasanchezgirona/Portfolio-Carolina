import { cache } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../lib/supabase-public";

export type Resource = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  category: "psicologia" | "neuropsicologia" | "profesionales";
  audience: "general" | "pacientes" | "familias" | "profesionales";
  format_label: string;
  price_cents: number;
  featured: boolean;
  cover_url: string | null;
  cover_alt: string | null;
  updated_at: string | null;
};

const select = [
  "id",
  "title",
  "slug",
  "subtitle",
  "description",
  "category",
  "audience",
  "format_label",
  "price_cents",
  "featured",
  "cover_url",
  "cover_alt",
  "updated_at",
].join(",");

export const getPublishedResources = cache(async (): Promise<Resource[]> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/digital_resources?select=${encodeURIComponent(select)}&status=eq.published&order=featured.desc,created_at.desc`,
      { headers: { apikey: SUPABASE_PUBLISHABLE_KEY } },
    );
    if (!response.ok) return [];
    const rows = await response.json();
    return Array.isArray(rows) ? (rows as Resource[]) : [];
  } catch {
    return [];
  }
});
