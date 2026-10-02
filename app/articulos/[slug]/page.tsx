import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import JsonLd, { breadcrumbSchema } from "../../components/json-ld";
import { getAutomaticRelatedPage, getPublishedArticle, getPublishedArticles, isArticleVisible } from "../articles-data";
import "../articles.css";
import "../article-seo.css";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = (await getPublishedArticles()).filter((article) => isArticleVisible(article));
  return articles.map((article) => ({ slug: article.slug }));
}

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

function wordCount(html: string) {
  return plainText(html).split(/\s+/).filter(Boolean).length;
}

function categoryLabel(value: string) {
  return value === "neuropsicologia" ? "Neuropsicología" : "Psicología";
}

function displayArticleTitle(article: { slug: string; title: string }) {
  if (article.slug === "volver-a-la-rutina-sin-intentar-cambiarlo-todo-como-recuperar-habitos-de-forma-sostenible") {
    return "Volver a la rutina: cómo recuperar hábitos de forma sostenible";
  }
  return article.title;
}

const curatedArticleTitles: Record<string, string> = {
  "volver-a-la-rutina-sin-intentar-cambiarlo-todo-como-recuperar-habitos-de-forma-sostenible":
    "Volver a la rutina: hábitos sostenibles",
  "ansiedad-sintomas-fisicos": "Síntomas físicos de ansiedad: por qué aparecen",
  "por-que-no-puedo-dejar-de-darle-vueltas-a-las-cosas":
    "Rumiación: cómo dejar de darle vueltas",
  "culpa-al-poner-limites": "Culpa al poner límites: por qué ocurre",
  "necesidad-de-aprobacion-cuando-tu-autoestima-depende-demasiado-de-lo-que-piensan-los-demas":
    "Necesidad de aprobación y autoestima",
};

function articleSeoTitle(article: { slug: string; title: string; seo_title: string | null }) {
  return (
    curatedArticleTitles[article.slug] || article.seo_title || article.title
  ).replace(/\s*\|\s*Carolina Sánchez(?: Girona)?\s*$/i, "");
}

function usefulImageAlt(value: string | null, title: string) {
  if (!value || /chatgpt image/i.test(value)) return `Imagen del artículo: ${title}`;
  return value;
}

function safeCta(value: string | null, label: string | null) {
  const candidate = value?.trim() || "";
  const isSafeUrl =
    (candidate.startsWith("/") && !candidate.startsWith("//")) || candidate.startsWith("https://");

  return {
    url: isSafeUrl ? candidate : "/cita/",
    label: isSafeUrl ? label || "Pedir cita" : candidate || label || "Pedir cita",
  };
}

function normalizeArticleContent(content: string) {
  return content
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(
      /<p>\s*→\s*<strong>\s*\[Pedir primera visita\]\s*<\/strong>\s*<\/p>/gi,
      '<p>→ <a href="/cita/"><strong>Pedir primera visita</strong></a></p>',
    );
}

function relatedLabel(path: string) {
  return ({
    "/psicologia/": "Psicología General Sanitaria",
    "/neuropsicologia/": "Neuropsicología",
    "/ansiedad/": "Ansiedad",
    "/duelo/": "Duelo",
    "/deterioro-cognitivo/": "Deterioro cognitivo y memoria",
    "/evaluacion-neuropsicologica/": "Evaluación neuropsicológica",
    "/rumiacion-y-pensamientos-repetitivos/": "Rumiación y pensamientos repetitivos",
    "/ataques-de-panico/": "Ataques de pánico",
    "/depresion/": "Depresión y bajo estado de ánimo",
    "/problemas-de-memoria/": "Problemas de memoria",
    "/alzheimer-primeros-sintomas-y-evaluacion/": "Alzheimer: primeros síntomas y evaluación",
    "/demencias/": "Demencias",
  } as Record<string, string>)[path] || "Información relacionada";
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article || !isArticleVisible(article)) {
    return { title: "Artículo no disponible", robots: { index: false, follow: false } };
  }

  const title = articleSeoTitle(article);
  const description = article.seo_description || article.excerpt || article.subtitle || "Artículo de Psicología y Neuropsicología de Carolina Sánchez Girona.";
  const canonical = `https://carolinasanchezgirona.com/articulos/${encodeURIComponent(article.slug)}/`;
  const imageAlt = usefulImageAlt(article.image_alt, displayArticleTitle(article));

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
      images: article.image_url ? [{ url: article.image_url, alt: imageAlt }] : undefined,
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
  const displayTitle = displayArticleTitle(article);
  const description = article.seo_description || article.excerpt || article.subtitle || "Artículo de Psicología y Neuropsicología de Carolina Sánchez Girona.";
  const minutes = readingMinutes(article.content);
  const tags = Array.isArray(article.tags) ? article.tags : [];
  const cta = safeCta(article.cta_url, article.cta_label);
  const normalizedContent = normalizeArticleContent(article.content || "");
  const articleWordCount = wordCount(article.content || "");
  const relatedPage = getAutomaticRelatedPage(article);
  const categoryPage = article.category === "neuropsicologia" ? "/neuropsicologia/" : "/psicologia/";
  const categoryPageLabel = article.category === "neuropsicologia" ? "Explorar Neuropsicología" : "Explorar Psicología";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${canonical}#article`,
        headline: displayTitle,
        description,
        datePublished: article.published_at || undefined,
        dateModified: article.updated_at || article.published_at || undefined,
        inLanguage: "es-ES",
        articleSection: categoryLabel(article.category),
        wordCount: articleWordCount,
        author: {
          "@type": "Person",
          "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona",
          name: "Carolina Sánchez Girona",
          url: "https://carolinasanchezgirona.com/sobre-mi/",
        },
        publisher: {
          "@id": "https://carolinasanchezgirona.com/#dememoria",
          name: "Carolina Sánchez | Psicóloga y Neuropsicóloga",
          url: "https://carolinasanchezgirona.com/",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonical,
        },
        isPartOf: {
          "@id": "https://carolinasanchezgirona.com/#website",
        },
        image: article.image_url || "https://carolinasanchezgirona.com/opengraph-image.png",
        keywords: tags.length ? tags.join(", ") : undefined,
      },
      breadcrumbSchema([
        { name: "Inicio", url: "https://carolinasanchezgirona.com/" },
        { name: "Artículos", url: "https://carolinasanchezgirona.com/articulos/" },
        { name: displayTitle, url: canonical },
      ]),
    ],
  };

  return (
    <main className="articles-page">
      <div className="articles-wrap article-detail">
        <nav className="article-breadcrumbs" aria-label="Migas de pan">
          <a href="/">Inicio</a><span aria-hidden="true">›</span>
          <a href="/articulos/">Artículos</a><span aria-hidden="true">›</span>
          <span aria-current="page">{displayTitle}</span>
        </nav>
        <article>
          <header className="article-header">
            <p className="articles-kicker">{categoryLabel(article.category)}</p>
            <h1>{displayTitle}</h1>
            {article.subtitle ? <p className="article-subtitle">{article.subtitle}</p> : null}
            {article.excerpt ? <p className="article-excerpt">{article.excerpt}</p> : null}
            <div className="article-meta">
              <span>Por <a href="/sobre-mi/">Carolina Sánchez Girona</a></span>
              {article.published_at ? <span>Publicado el {formatDate(article.published_at)}</span> : null}
              {article.updated_at && article.updated_at !== article.published_at ? <span>Actualizado el {formatDate(article.updated_at)}</span> : null}
              {minutes ? <span>{minutes} min de lectura</span> : null}
            </div>
            {tags.length ? (
              <div className="article-tags">
                {tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            ) : null}
            {article.image_url ? (
              <figure className="article-figure">
                <Image
                  className="article-image"
                  src={article.image_url}
                  alt={usefulImageAlt(article.image_alt, displayTitle)}
                  width={1200}
                  height={675}
                  sizes="(max-width: 960px) calc(100vw - 36px), 920px"
                  unoptimized
                />
                {article.image_caption ? <figcaption>{article.image_caption}</figcaption> : null}
              </figure>
            ) : null}
          </header>

          <div className="article-reading-layout">
            <div />
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: normalizedContent }} />
          </div>

          <aside className="article-author-note" aria-label="Autoría y revisión profesional">
            <div>
              <span>Autoría y revisión profesional</span>
              <strong>Carolina Sánchez Girona</strong>
              <p>Psicóloga General Sanitaria y Neuropsicóloga · Colegiada COPC 24892.</p>
            </div>
            <a href="/sobre-mi/">Ver perfil profesional →</a>
          </aside>

          <aside className="article-cta">
            <div>
              <span>Siguiente paso</span>
              <strong>¿Quieres consultar tu caso?</strong>
            </div>
            <a href={cta.url}>{cta.label} →</a>
          </aside>

          <aside className="article-related">
            <strong>También puede interesarte</strong>
            <a href={relatedPage}>Ver {relatedLabel(relatedPage)} →</a>
            {relatedPage !== categoryPage ? <a href={categoryPage}>{categoryPageLabel} →</a> : null}
          </aside>
        </article>
      </div>
      <JsonLd id="article-structured-data" data={schema} />
    </main>
  );
}
