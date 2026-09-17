import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedArticle, isArticleVisible } from "../articles-data";
import "../articles.css";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function readingMinutes(html: string) {
  const words = plainText(html).split(/\s+/).filter(Boolean).length;
  return words ? Math.max(1, Math.ceil(words / 220)) : 0;
}

function categoryLabel(value: string) {
  return value === "neuropsicologia" ? "Neuropsicología" : "Psicología";
}

function relatedLabel(path: string) {
  return ({
    "/psicologia/": "Psicología General Sanitaria",
    "/neuropsicologia/": "Neuropsicología",
    "/ansiedad/": "Ansiedad",
    "/duelo/": "Duelo",
    "/deterioro-cognitivo/": "Deterioro cognitivo y memoria",
    "/evaluacion-neuropsicologica/": "Evaluación neuropsicológica",
  } as Record<string, string>)[path] || "Información relacionada";
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article || !isArticleVisible(article)) {
    return { title: "Artículo no disponible", robots: { index: false, follow: false } };
  }

  const title = article.seo_title || article.title;
  const description = article.seo_description || article.excerpt || article.subtitle || "Artículo de Psicología y Neuropsicología de Carolina Sánchez Girona.";
  const canonical = `https://carolinasanchezgirona.com/articulos/${encodeURIComponent(article.slug)}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at || undefined,
      images: article.image_url ? [{ url: article.image_url, alt: article.image_alt || article.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.image_url ? [article.image_url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article || !isArticleVisible(article)) notFound();

  const canonical = `https://carolinasanchezgirona.com/articulos/${encodeURIComponent(article.slug)}/`;
  const description = article.seo_description || article.excerpt || article.subtitle || "Artículo de Psicología y Neuropsicología de Carolina Sánchez Girona.";
  const minutes = readingMinutes(article.content);
  const tags = Array.isArray(article.tags) ? article.tags : [];
  const ctaLabel = article.cta_label || "Pedir cita";
  const ctaUrl = article.cta_url || "/cita/";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || undefined,
    author: {
      "@type": "Person",
      name: "Carolina Sánchez Girona",
      url: "https://carolinasanchezgirona.com/sobre-mi/",
    },
    publisher: {
      "@type": "Person",
      name: "Carolina Sánchez Girona",
    },
    mainEntityOfPage: canonical,
    image: article.image_url || "https://carolinasanchezgirona.com/carolina-sanchez-retrato.jpg",
    keywords: tags.length ? tags.join(", ") : undefined,
  };

  return (
    <main className="articles-page">
      <div className="articles-wrap article-detail">
        <a className="article-back" href="/articulos/">← Todos los artículos</a>
        <article>
          <header className="article-header">
            <p className="articles-kicker">{categoryLabel(article.category)}</p>
            <h1>{article.title}</h1>
            {article.subtitle ? <p className="article-subtitle">{article.subtitle}</p> : null}
            {article.excerpt ? <p className="article-excerpt">{article.excerpt}</p> : null}
            <div className="article-meta">
              {article.published_at ? <span>Publicado el {formatDate(article.published_at)}</span> : null}
              {minutes ? <span>{minutes} min de lectura</span> : null}
            </div>
            {tags.length ? (
              <div className="article-tags">
                {tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            ) : null}
            {article.image_url ? (
              <figure className="article-figure">
                <img className="article-image" src={article.image_url} alt={article.image_alt || ""} decoding="async" />
                {article.image_caption ? <figcaption>{article.image_caption}</figcaption> : null}
              </figure>
            ) : null}
          </header>

          <div className="article-reading-layout">
            <div />
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: article.content || "" }} />
          </div>

          <aside className="article-cta">
            <div>
              <span>Siguiente paso</span>
              <strong>¿Quieres consultar tu caso?</strong>
            </div>
            <a href={ctaUrl}>{ctaLabel} →</a>
          </aside>

          {article.related_page ? (
            <aside className="article-related">
              <strong>También puede interesarte</strong>
              <a href={article.related_page}>Ver {relatedLabel(article.related_page)} →</a>
            </aside>
          ) : null}
        </article>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
