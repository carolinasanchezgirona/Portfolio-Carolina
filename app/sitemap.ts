import type { MetadataRoute } from "next";
import { getPublishedArticles } from "./articulos/articles-data";

const base = "https://carolinasanchezgirona.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date("2026-09-13"), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/psicologa-arenys-de-mar/`, lastModified: new Date("2026-09-13"), changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/psicologia/`, lastModified: new Date("2026-09-13"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/neuropsicologia/`, lastModified: new Date("2026-09-13"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/sobre-mi/`, lastModified: new Date("2026-09-13"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/ansiedad/`, lastModified: new Date("2026-09-13"), changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/duelo/`, lastModified: new Date("2026-09-13"), changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/evaluacion-neuropsicologica/`, lastModified: new Date("2026-09-13"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/deterioro-cognitivo/`, lastModified: new Date("2026-09-13"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/articulos/`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.88 },
    { url: `${base}/cita/`, lastModified: new Date("2026-09-13"), changeFrequency: "daily", priority: 0.9 },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${base}/articulos/${article.slug}/`,
    lastModified: new Date(article.updated_at || article.published_at || Date.now()),
    changeFrequency: "monthly",
    priority: article.featured ? 0.82 : 0.75,
  }));

  return [...staticPages, ...articlePages];
}
