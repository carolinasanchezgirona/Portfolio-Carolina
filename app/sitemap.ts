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
    { url: `${base}/dependencia-emocional/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.81 },
    { url: `${base}/limites-y-relaciones-dificiles/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/autoestima-y-autocritica/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/perfeccionismo-y-autoexigencia/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/rumiacion-y-pensamientos-repetitivos/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.81 },
    { url: `${base}/estres-y-sobrecarga/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.81 },
    { url: `${base}/insomnio-y-dificultades-para-dormir/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.81 },
    { url: `${base}/toma-de-decisiones-e-indecision/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/cambios-vitales-y-adaptacion/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/culpa-y-dificultad-para-perdonarse/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/miedo-al-rechazo-y-necesidad-de-aprobacion/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/procrastinacion-y-bloqueo/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/ansiedad-social-y-miedo-al-ridiculo/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/pensamientos-intrusivos-y-miedo-a-perder-el-control/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.81 },
    { url: `${base}/toc-obsesiones-y-compulsiones/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/agorafobia-y-miedo-a-salir/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/fobias-especificas/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.81 },
    { url: `${base}/trauma-psicologico-y-estres-postraumatico/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.82 },
    { url: `${base}/evaluacion-neuropsicologica/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/problemas-de-memoria/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.86 },
    { url: `${base}/deterioro-cognitivo/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/ictus-y-dano-cerebral-adquirido/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.84 },
    { url: `${base}/parkinson-y-cambios-cognitivos/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.83 },
    { url: `${base}/rehabilitacion-neuropsicologica/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/alzheimer-primeros-sintomas-y-evaluacion/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.86 },
    { url: `${base}/demencias/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.86 },
    { url: `${base}/estimulacion-cognitiva/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.84 },
    { url: `${base}/familiares-y-cuidadores-de-personas-con-demencia/`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.84 },
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
