import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../articles.css";
import { getPublishedArticle } from "../articles-data";

type PageProps = { params: Promise<{ slug: string }> };

function categoryLabel(category: string) {
  return category === "neuropsicologia" ? "Neuropsicología" : "Psicología";
}

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(value));
}

function relatedLabel(path: string | null) {
  const labels: Record<string, string> = {
    "/psicologia/": "Psicología General Sanitaria",
    "/neuropsicologia/": "Neuropsicología",
    "/ansiedad/": "Ansiedad",
    "/duelo/": "Duelo",
    "/deterioro-cognitivo/": "Deterioro cognitivo y memoria",
    "/evaluacion-neuropsicologica/": "Evaluación neuropsicológica",
  };
  return path ? labels[path] || "Más información" : "";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return { title: "Artículo no encontrado" };
  const description = article.seo_description || article.excerpt || "Artículo de Psicología y Neuropsicología de Carolina Sánchez Girona.";
  return {
    title: article.seo_title || article.title,
    description,
    alternates: { canonical: `/articulos/${article.slug}/` },
    openGraph: {
      type: "article",
      title: article.seo_title || article.title,
      description,
      url: `https://carolinasanchezgirona.com/articulos/${article.slug}/`,
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at,
      images: article.image_url ? [article.image_url] : ["/carolina-sanchez-retrato.jpg"],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo_description || article.excerpt || undefined,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: "Carolina Sánchez Girona",
      url: "https://carolinasanchezgirona.com/sobre-mi/",
    },
    publisher: {
      "@type": "Person",
      name: "Carolina Sánchez Girona",
    },
    mainEntityOfPage: `https://carolinasanchezgirona.com/articulos/${article.slug}/`,
    image: article.image_url || "https://carolinasanchezgirona.com/carolina-sanchez-retrato.jpg",
  };

  return (
    <main className="articles-page">
      <div className="articles-wrap article-detail">
        <a className="article-back" href="/articulos/">← Todos los artículos</a>
        <header className="article-header">
          <p className="articles-kicker">{categoryLabel(article.category)}</p>
          <h1>{article.title}</h1>
          {article.excerpt ? <p className="article-excerpt">{article.excerpt}</p> : null}
          {article.published_at ? <p className="article-date">Publicado el {formatDate(article.published_at)}</p> : null}
          {article.image_url ? <img className="article-image" src={article.image_url} alt="" /> : null}
        </header>

        <article className="article-prose" dangerouslySetInnerHTML={{ __html: article.content }} />

        {article.related_page ? (
          <aside className="article-related">
            <strong>¿Quieres saber más?</strong>
            <a href={article.related_page}>Ver {relatedLabel(article.related_page)} →</a>
          </aside>
        ) : null}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
