import Script from "next/script";
import "../articles.css";

export default function ArticleReaderPage() {
  return (
    <main className="articles-page" data-articles-view="detail">
      <div className="articles-wrap article-detail">
        <a className="article-back" href="/articulos/">← Todos los artículos</a>
        <p id="article-loading" className="articles-empty">Cargando artículo…</p>
        <div id="article-shell" hidden>
          <header className="article-header">
            <p id="article-category" className="articles-kicker" />
            <h1 id="article-title" />
            <p id="article-excerpt" className="article-excerpt" />
            <p id="article-date" className="article-date" />
            <img id="article-image" className="article-image" alt="" hidden />
          </header>
          <article id="article-content" className="article-prose" />
          <aside id="article-related" className="article-related" hidden>
            <strong>¿Quieres saber más?</strong>
            <a id="article-related-link" href="#">Ver información relacionada →</a>
          </aside>
        </div>
      </div>
      <Script src="/articles-public.js?v=20260913-1" strategy="afterInteractive" />
    </main>
  );
}
