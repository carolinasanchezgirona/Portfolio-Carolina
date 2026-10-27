import type { Metadata } from "next";
import ArticlesList from "./articles-list";
import { getPublishedArticles, isArticleVisible } from "./articles-data";

export const metadata: Metadata = {
  title: "Artículos de Psicología y Neuropsicología",
  description: "Artículos sobre psicología, neuropsicología, memoria, ansiedad, duelo y salud cognitiva escritos por Carolina Sánchez Girona.",
  alternates: { canonical: "/articulos/" },
  openGraph: {
    title: "Artículos | Carolina Sánchez Girona",
    description: "Psicología, neuropsicología y salud cognitiva explicadas con rigor y claridad.",
    url: "https://carolinasanchezgirona.com/articulos/",
  },
};

export default async function ArticlesPage() {
  const articles = (await getPublishedArticles()).filter((article) => isArticleVisible(article));
  return <ArticlesList articles={articles} />;
}
