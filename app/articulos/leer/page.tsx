import type { Metadata } from "next";
import Script from "next/script";
import "../articles.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

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
            <p id="article-subtitle" className="article-subtitle" />
            <p id="article-excerpt" className="article-excerpt" />
            <div className="article-meta"><span id="article-date" /><span id="article-reading-time" /></div>
            <div id="article-tags" className="article-tags" />
            <figure id="article-figure" className="article-figure" hidden>
              <img id="article-image" className="article-image" alt="" />
              <figcaption id="article-image-caption" />
            </figure>
          </header>
          <div className="article-reading-layout">
            <aside id="article-toc" className="article-toc" hidden>
              <strong>En este artículo</strong>
              <nav id="article-toc-links" aria-label="Índice del artículo" />
            </aside>
            <article id="article-content" className="article-prose" />
          </div>
          <aside id="article-cta" className="article-cta" hidden>
            <div><span>Siguiente paso</span><strong id="article-cta-heading">¿Quieres dar el siguiente paso?</strong></div>
            <a id="article-cta-link" href="/cita/">Pedir cita →</a>
          </aside>
          <aside id="article-related" className="article-related" hidden>
            <strong>También puede interesarte</strong>
            <a id="article-related-link" href="#">Ver información relacionada →</a>
          </aside>
        </div>
      </div>
      <Script src="/articles-public.js?v=20260913-editor-2" strategy="afterInteractive" />
    </main>
  );
}
