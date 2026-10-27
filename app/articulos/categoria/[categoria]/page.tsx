import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlesList from "../../articles-list";
import { getPublishedArticles, isArticleVisible } from "../../articles-data";

type Category = "psicologia" | "neuropsicologia";
type Props = { params: Promise<{ categoria: string }> };
const categories: Record<Category, string> = { psicologia: "Psicología", neuropsicologia: "Neuropsicología" };
function isCategory(value: string): value is Category { return Object.hasOwn(categories, value); }

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(categories).map((categoria) => ({ categoria })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  if (!isCategory(categoria)) notFound();
  const title = `Artículos de ${categories[categoria]}`;
  const description = categoria === "neuropsicologia"
    ? "Artículos de Carolina Sánchez Girona sobre memoria, funcionamiento cognitivo, evaluación neuropsicológica y demencias."
    : "Artículos de Carolina Sánchez Girona sobre ansiedad, emociones, relaciones, duelo y bienestar psicológico.";
  const canonical = `/articulos/categoria/${categoria}/`;
  const hasArticles = (await getPublishedArticles(categoria)).some((article) => isArticleVisible(article) && article.category === categoria);
  return { title, description, alternates: { canonical }, robots: { index: hasArticles, follow: true },
    openGraph: { title, description, url: `https://carolinasanchezgirona.com${canonical}` },
    twitter: { card: "summary", title, description } };
}

export default async function ArticleCategoryPage({ params }: Props) {
  const { categoria } = await params;
  if (!isCategory(categoria)) notFound();
  const articles = (await getPublishedArticles(categoria)).filter((article) => isArticleVisible(article) && article.category === categoria);
  return <ArticlesList articles={articles} category={categoria} />;
}
