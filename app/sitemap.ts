import type { MetadataRoute } from "next";
import { getPublishedArticles, isArticleVisible } from "./articulos/articles-data";

const base = "https://carolinasanchezgirona.com";
const staticLastModified = new Date("2026-09-18T00:00:00+02:00");

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/psicologa-arenys-de-mar/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/psicologia/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/neuropsicologia/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/sobre-mi/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/ansiedad/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/ataques-de-panico/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/depresion/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.83 },
    { url: `${base}/duelo/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/rupturas-de-pareja/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.81 },
    { url: `${base}/evaluacion-neuropsicologica/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/problemas-de-memoria/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.86 },
    { url: `${base}/deterioro-cognitivo/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/demencias/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.86 },
    { url: `${base}/estimulacion-cognitiva/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.84 },
    { url: `${base}/articulos/`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.88 },
    { url: `${base}/cita/`, lastModified: staticLastModified, changeFrequency: "daily", priority: 0.9 },
  ];

  const articles = (await getPublishedArticles())
    .filter((article) => isArticleVisible(article))
    .map((article) => ({
      url: `${base}/articulos/${encodeURIComponent(article.slug)}/`,
      lastModified: article.updated_at ? new Date(article.updated_at) : article.published_at ? new Date(article.published_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: article.featured ? 0.82 : 0.75,
    }));

  return [...staticPages, ...articles];
}
