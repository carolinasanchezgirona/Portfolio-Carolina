import type { Metadata } from "next";
import Script from "next/script";
import "./articles.css";

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

export default function ArticlesPage() {
  return (
    <main className="articles-page" data-articles-view="list">
      <section className="articles-hero">
        <div className="articles-wrap">
          <p className="articles-kicker">Recursos</p>
          <h1>Artículos</h1>
          <p className="articles-lead">Un espacio para comprender mejor lo que ocurre en la mente: artículos y guías sobre salud psicológica, memoria y funcionamiento cognitivo, escritos desde la práctica clínica y la evidencia.</p>
        </div>
      </section>
      <div className="articles-wrap">
        <div className="articles-toolbar">
          <div className="articles-filters" aria-label="Filtrar artículos">
            <a data-category="all" href="/articulos/">Todos</a>
            <a data-category="psicologia" href="/articulos/?categoria=psicologia">Psicología</a>
            <a data-category="neuropsicologia" href="/articulos/?categoria=neuropsicologia">Neuropsicología</a>
          </div>
        </div>
        <p id="articles-status" className="articles-empty">Cargando artículos…</p>
        <section id="articles-grid" className="articles-grid" aria-label="Listado de artículos" />
      </div>
      <Script src="/articles-public.js?v=20260913-editor-2" strategy="afterInteractive" />
    </main>
  );
}
