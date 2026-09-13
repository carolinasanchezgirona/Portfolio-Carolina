import type { Metadata } from "next";
import "./articles.css";
import { getPublishedArticles } from "./articles-data";

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

type PageProps = { searchParams: Promise<{ categoria?: string }> };

function categoryLabel(category: string) {
  return category === "neuropsicologia" ? "Neuropsicología" : "Psicología";
}

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(value));
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.categoria === "psicologia" || params.categoria === "neuropsicologia" ? params.categoria : undefined;
  const articles = await getPublishedArticles(category);

  return (
    <main className="articles-page">
      <section className="articles-hero">
        <div className="articles-wrap">
          <p className="articles-kicker">Recursos</p>
          <h1>Artículos</h1>
          <p className="articles-lead">Psicología, neuropsicología y salud cognitiva explicadas con rigor, claridad y utilidad práctica.</p>
        </div>
      </section>

      <div className="articles-wrap">
        <div className="articles-toolbar">
          <div className="articles-filters" aria-label="Filtrar artículos">
            <a className={!category ? "active" : ""} href="/articulos/">Todos</a>
            <a className={category === "psicologia" ? "active" : ""} href="/articulos/?categoria=psicologia">Psicología</a>
            <a className={category === "neuropsicologia" ? "active" : ""} href="/articulos/?categoria=neuropsicologia">Neuropsicología</a>
          </div>
        </div>

        {articles.length ? (
          <section className="articles-grid" aria-label="Listado de artículos">
            {articles.map((article) => (
              <article key={article.id} className={`articles-card${article.featured ? " featured" : ""}`}>
                <div className="articles-card-meta">
                  <span className="articles-card-category">{categoryLabel(article.category)}</span>
                  {article.published_at ? <span>{formatDate(article.published_at)}</span> : null}
                </div>
                <h2><a href={`/articulos/${article.slug}/`} style={{ color: "inherit", textDecoration: "none" }}>{article.title}</a></h2>
                {article.excerpt ? <p>{article.excerpt}</p> : null}
                <a className="articles-card-link" href={`/articulos/${article.slug}/`}>Leer artículo →</a>
              </article>
            ))}
          </section>
        ) : (
          <div className="articles-empty">Próximamente encontrarás aquí nuevos artículos.</div>
        )}
      </div>
    </main>
  );
}
