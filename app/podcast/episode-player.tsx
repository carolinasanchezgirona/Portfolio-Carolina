"use client";

import { useState } from "react";

function getSpotifyEpisodeId(value: string) {
  try {
    const url = new URL(value);
    if (!["open.spotify.com", "www.open.spotify.com"].includes(url.hostname)) return null;
    const match = url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?episode\/([A-Za-z0-9]+)\/?$/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export default function EpisodePlayer({
  title,
  audioSrc,
  spotifyUrl,
}: {
  title: string;
  audioSrc?: string;
  spotifyUrl?: string;
}) {
  const [showSpotify, setShowSpotify] = useState(false);
  const spotifyId = spotifyUrl ? getSpotifyEpisodeId(spotifyUrl) : null;

  if (audioSrc) {
    return (
      <div className="podcast-player" aria-label={"Reproductor: " + title}>
        <p className="podcast-player-label">Escuchar episodio</p>
        <audio controls preload="none" src={audioSrc} aria-label={title}>
          Tu navegador no admite la reproducción de audio.
        </audio>
        {spotifyId && <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">Abrir también en Spotify ↗</a>}
      </div>
    );
  }

  if (spotifyId) {
    return (
      <div className="podcast-player">
        <p className="podcast-player-label">Escuchar episodio</p>
        {!showSpotify ? (
          <button className="podcast-play-action" type="button" onClick={() => setShowSpotify(true)}>
            ▶ Activar reproductor de Spotify
          </button>
        ) : (
          <iframe
            src={"https://open.spotify.com/embed/episode/" + spotifyId + "?utm_source=generator"}
            title={"Escuchar " + title + " en Spotify"}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            width="100%"
            height="180"
          />
        )}
        <p className="podcast-player-disclosure">El reproductor externo solo se carga al activarlo y puede utilizar cookies propias de Spotify.</p>
        <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">Abrir en Spotify ↗</a>
      </div>
    );
  }

  return (
    <div className="podcast-player podcast-player-pending">
      <p className="podcast-player-label">Episodio 01 · Audio</p>
      <p>Muy pronto podrás escuchar el episodio completo desde esta página. Mientras tanto, descubre las preguntas y lecturas que acompañan a esta entrega.</p>
    </div>
  );
}
