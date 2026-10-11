import type { Metadata } from "next";
import PodcastArtwork from "./podcast-artwork";
import EpisodePlayer from "./episode-player";
import { episodes, podcastName, podcastSubtitle } from "./episodes";

export const metadata: Metadata = {
  title: "Psicología Incómoda | Podcast de Carolina Sánchez Girona",
  description: "Psicología sin frases vacías: relaciones, emociones, historias reales, preguntas difíciles y ciencia con humor. Podcast de Carolina Sánchez Girona.",
  alternates: { canonical: "/podcast/" },
  openGraph: {
    title: "Psicología Incómoda | Podcast",
    description: "Psicología sin soluciones mágicas. Preguntas difíciles, ciencia y humor con Carolina Sánchez Girona.",
    url: "https://carolinasanchezgirona.com/podcast/",
    type: "website",
  },
};

export default function PodcastPage() {
  const first = episodes[0];
  const seriesData = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: podcastName,
    description: podcastSubtitle,
    url: "https://carolinasanchezgirona.com/podcast/",
    inLanguage: "es-ES",
    author: { "@type": "Person", name: "Carolina Sánchez Girona", url: "https://carolinasanchezgirona.com/sobre-mi/" },
  };

  return (
    <main className="podcast-page" id="podcast">
      <div className="editorial-wrap">
        <nav className="podcast-breadcrumb" aria-label="Ruta de navegación">
          <a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/recursos/">Recursos</a><span aria-hidden="true">/</span><span>Podcast</span>
        </nav>
        <section className="podcast-hero" aria-labelledby="podcast-title">
          <div className="podcast-hero-copy">
            <p className="podcast-eyebrow">Podcast · Carolina Sánchez Girona</p>
            <h1 id="podcast-title">Psicología <em>Incómoda.</em></h1>
            <p className="podcast-lead">{podcastSubtitle}</p>
            <p>Historias, ciencia y preguntas que no siempre tienen una respuesta cómoda. Un espacio de divulgación sobre relaciones, emociones y las contradicciones de nuestra mente, sin recetas mágicas y con algo de humor.</p>
            <a className="podcast-cta" href="#episodios">Explorar episodios <span aria-hidden="true">↗</span></a>
          </div>
          <PodcastArtwork />
        </section>

        <section className="podcast-introduction" aria-labelledby="podcast-intro-title">
          <div><p className="podcast-eyebrow">Detrás del micrófono</p><h2 id="podcast-intro-title">La psicología también puede hacer preguntas incómodas.</h2></div>
          <div><p>Soy Carolina Sánchez Girona, psicóloga general sanitaria y neuropsicóloga. Aquí no se trata de pensar siempre en positivo, sino de comprender con más rigor lo que sentimos y hacemos.</p><p>Los episodios son divulgativos y no sustituyen la valoración ni la intervención clínica individualizada.</p></div>
        </section>

        <section className="podcast-episodes" id="episodios" aria-labelledby="podcast-episodes-title">
          <div className="podcast-section-heading"><div><p className="podcast-eyebrow">La biblioteca</p><h2 id="podcast-episodes-title">Episodios</h2></div><span>{String(episodes.length).padStart(2, "0")} episodio</span></div>
          <article className="podcast-episode-feature">
            <div className="podcast-episode-number">01 / PRIMER EPISODIO</div>
            <div className="podcast-feature-grid">
              <div><h3><a href={"/podcast/" + first.slug + "/"}>{first.title}</a></h3><p>{first.summary}</p>
                <div className="podcast-tags">{first.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
                <a className="podcast-text-link" href={"/podcast/" + first.slug + "/"}>Leer la ficha del episodio ↗</a></div>
              <div><p className="podcast-duration">{first.duration} minutos</p><EpisodePlayer title={first.title} audioSrc={first.audioSrc} spotifyUrl={first.spotifyUrl} /></div>
            </div>
          </article>
        </section>

        <section className="podcast-bottom" aria-label="Más recursos">
          <div><h2>¿Quieres seguir explorando?</h2><p>En los artículos encontrarás información complementaria y en Tu Consulta puedes proponer preguntas generales para próximos contenidos.</p></div>
          <div className="podcast-bottom-links"><a href="/articulos/">Ver artículos ↗</a><a href="/pregunta-a-carolina/">Ir a Tu Consulta ↗</a></div>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesData) }} />
    </main>
  );
}
