import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EpisodePlayer from "../episode-player";
import PodcastArtwork from "../podcast-artwork";
import { episodes, getEpisode } from "../episodes";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return episodes.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisode(slug);
  if (!episode) return {};
  return {
    title: episode.title + " | Psicología Incómoda",
    description: episode.description,
    alternates: { canonical: "/podcast/" + episode.slug + "/" },
    openGraph: {
      title: episode.title + " | Psicología Incómoda",
      description: episode.description,
      url: "https://carolinasanchezgirona.com/podcast/" + episode.slug + "/",
      type: "article",
    },
  };
}
export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = getEpisode(slug);
  if (!episode) notFound();
  const episodeStructuredData = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.description,
    url: "https://carolinasanchezgirona.com/podcast/" + episode.slug + "/",
    inLanguage: "es-ES",
    episodeNumber: episode.number,
    partOfSeries: { "@type": "PodcastSeries", name: "Psicología Incómoda", url: "https://carolinasanchezgirona.com/podcast/" },
    author: { "@type": "Person", name: "Carolina Sánchez Girona" },
    ...(episode.audioSrc ? { associatedMedia: { "@type": "AudioObject", contentUrl: "https://carolinasanchezgirona.com" + episode.audioSrc } } : {}),
  };
  return (
    <main className="podcast-page podcast-single">
      <div className="editorial-wrap">
        <nav className="podcast-breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href="/recursos/">Recursos</a><span>/</span><a href="/podcast/">Podcast</a><span>/</span><span>Episodio {episode.number}</span></nav>
        <header className="podcast-single-heading"><p className="podcast-eyebrow">Psicología Incómoda · Episodio {String(episode.number).padStart(2, "0")}</p><h1>{episode.title}</h1><p className="podcast-lead">{episode.description}</p></header>
        <div className="podcast-single-grid">
          <div><PodcastArtwork compact /><EpisodePlayer title={episode.title} audioSrc={episode.audioSrc} spotifyUrl={episode.spotifyUrl} /><p className="podcast-duration">Duración: {episode.duration} min · En español</p></div>
          <article className="podcast-article">
            <h2>Sobre este episodio</h2><p>{episode.summary}</p>
            {episode.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
            <aside className="podcast-note">Contenido divulgativo y psicoeducativo. No sustituye una evaluación o intervención psicológica individualizada. Las reflexiones del episodio no permiten extraer conclusiones clínicas sobre personas concretas.</aside>
            <section className="podcast-related"><h2>Para seguir profundizando</h2><ul>{episode.related.map((item) => <li key={item.href}><a href={item.href}>{item.title} ↗</a></li>)}</ul></section>
            <a className="podcast-text-link" href="/podcast/">← Todos los episodios</a>
          </article>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeStructuredData) }} />
    </main>
  );
}
