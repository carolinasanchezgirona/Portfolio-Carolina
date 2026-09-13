const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";

export type PublicArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: "psicologia" | "neuropsicologia";
  featured: boolean;
  image_url: string | null;
  related_page: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
};

const select = "id,title,slug,excerpt,content,category,featured,image_url,related_page,seo_title,seo_description,published_at,updated_at";

export async function getPublishedArticles(category?: string): Promise<PublicArticle[]> {
  const filters = [`select=${encodeURIComponent(select)}`, "status=eq.published", "order=featured.desc,published_at.desc"];
  if (category === "psicologia" || category === "neuropsicologia") filters.push(`category=eq.${category}`);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?${filters.join("&")}`, {
    headers: { apikey: KEY },
    next: { revalidate: 300 },
  });
  if (!response.ok) return [];
  return response.json();
}

export async function getPublishedArticle(slug: string): Promise<PublicArticle | null> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=${encodeURIComponent(select)}&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`, {
    headers: { apikey: KEY },
    next: { revalidate: 300 },
  });
  if (!response.ok) return null;
  const rows = await response.json();
  return rows?.[0] ?? null;
}
