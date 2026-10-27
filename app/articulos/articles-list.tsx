import Script from "next/script";
import type { PublicArticle } from "./articles-data";
import "./articles.css";

function categoryLabel(value: string) {
  return value === "neuropsicologia" ? "Neuropsicología" : "Psicología";
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

export default function ArticlesList({ articles, category = "all" }: { articles: PublicArticle[]; category?: "all" | "psicologia" | "neuropsicologia" }) {

  return (
    <main className="articles-page" data-articles-view="list" data-article-filter={category}>
      <section className="articles-hero">
        <div className="articles-wrap">
          <p className="articles-kicker">Recursos</p>
          <h1>{category === "all" ? "Artículos" : `Artículos de ${categoryLabel(category)}`}</h1>
          <p className="articles-lead">Un espacio para comprender mejor lo que ocurre en la mente: artículos y guías sobre salud psicológica, memoria y funcionamiento cognitivo, escritos desde la práctica clínica y la evidencia.</p>
        </div>
      </section>
      <div className="articles-wrap">
        <div className="articles-toolbar">
          <div className="articles-filters" aria-label="Filtrar artículos">
            <a data-category="all" className={category === "all" ? "active" : undefined} aria-current={category === "all" ? "page" : undefined} href="/articulos/">Todos</a>
            <a data-category="psicologia" className={category === "psicologia" ? "active" : undefined} aria-current={category === "psicologia" ? "page" : undefined} href="/articulos/categoria/psicologia/">Psicología</a>
            <a data-category="neuropsicologia" className={category === "neuropsicologia" ? "active" : undefined} aria-current={category === "neuropsicologia" ? "page" : undefined} href="/articulos/categoria/neuropsicologia/">Neuropsicología</a>
          </div>
        </div>

        <p id="articles-status" className="articles-empty" role="status" hidden={articles.length > 0}>
          {articles.length ? "" : category === "all" ? "Próximamente encontrarás aquí nuevos artículos." : `Todavía no hay artículos publicados de ${categoryLabel(category)}.`}
        </p>
        <section id="articles-grid" className="articles-grid" aria-label="Listado de artículos">
          {articles.map((article) => {
            const href = `/articulos/${encodeURIComponent(article.slug)}/`;
            const summary = article.subtitle || article.excerpt || "";
            const minutes = readingMinutes(article.content);
            return (
              <article key={article.id} data-article-category={article.category} className={`articles-card${article.featured ? " featured" : ""}`}>
                {article.image_url ? (
                  <a className="articles-card-image" href={href} aria-label={`Leer ${article.title}`}>
                    <img src={article.image_url} alt={article.image_alt || ""} loading="lazy" decoding="async" />
                  </a>
                ) : null}
                <div className="articles-card-body">
                  <div className="articles-card-meta">
                    <span className="articles-card-category">{categoryLabel(article.category)}</span>
                    {article.published_at ? <span>{formatDate(article.published_at)}</span> : null}
                    {minutes ? <span>{minutes} min</span> : null}
                  </div>
                  <h2><a href={href}>{article.title}</a></h2>
                  {summary ? <p>{summary}</p> : null}
                  <a className="articles-card-link" href={href}>Leer artículo →</a>
                </div>
              </article>
            );
          })}
        </section>
      </div>
      <Script src="/articles-public.js?v=20261027-category-2" strategy="afterInteractive" />
    </main>
  );
}
