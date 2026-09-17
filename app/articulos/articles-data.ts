const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";

export type PublicArticle = {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string;
  category: "psicologia" | "neuropsicologia";
  featured: boolean;
  image_url: string | null;
  image_alt: string | null;
  image_caption: string | null;
  related_page: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[] | null;
  cta_label: string | null;
  cta_url: string | null;
  published_at: string | null;
  scheduled_at: string | null;
  updated_at: string;
};

const select = "id,title,subtitle,slug,excerpt,content,category,featured,image_url,image_alt,image_caption,related_page,seo_title,seo_description,tags,cta_label,cta_url,published_at,scheduled_at,updated_at";

export async function getPublishedArticles(category?: string): Promise<PublicArticle[]> {
  const filters = [`select=${encodeURIComponent(select)}`, "status=eq.published", "order=featured.desc,published_at.desc"];
  if (category === "psicologia" || category === "neuropsicologia") filters.push(`category=eq.${category}`);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?${filters.join("&")}`, {
    headers: { apikey: KEY },
  });
  if (!response.ok) return [];
  return response.json();
}

export async function getPublishedArticle(slug: string): Promise<PublicArticle | null> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=${encodeURIComponent(select)}&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`, {
    headers: { apikey: KEY },
  });
  if (!response.ok) return null;
  const rows = await response.json();
  return rows?.[0] ?? null;
}

export function isArticleVisible(article: PublicArticle, now = Date.now()) {
  return !article.published_at || new Date(article.published_at).getTime() <= now;
}

export function getAutomaticRelatedPage(article: PublicArticle) {
  if (article.related_page) return article.related_page;

  const searchable = [article.title, article.subtitle, article.excerpt, ...(article.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("es");

  if (/ansiedad|preocupaci[oó]n|p[aá]nico|miedo/.test(searchable)) return "/ansiedad/";
  if (/duelo|p[eé]rdida|fallecimiento/.test(searchable)) return "/duelo/";
  if (/deterioro|demencia|memoria|alzheimer/.test(searchable)) return "/deterioro-cognitivo/";
  if (/evaluaci[oó]n neuropsicol[oó]gica|test neuropsicol[oó]gic|perfil cognitivo/.test(searchable)) return "/evaluacion-neuropsicologica/";
  return article.category === "neuropsicologia" ? "/neuropsicologia/" : "/psicologia/";
}
