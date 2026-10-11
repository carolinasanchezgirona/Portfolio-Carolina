/** Catálogo editorial. No publicar URLs de audio o Spotify hasta verificar que son públicas. */
export type PodcastEpisode = {
  slug: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  duration: string;
  date: string;
  coverSrc: string;
  topics: string[];
  audioSrc?: string;
  spotifyUrl?: string;
  sections: { heading: string; paragraphs: string[] }[];
  related: { href: string; title: string }[];
};

export const podcastName = "Psicología Incómoda";
export const podcastSubtitle = "La psicología también tiene cosas que decirte que quizá no quieras escuchar.";

export const episodes: PodcastEpisode[] = [
  {
    slug: "no-quiero-volver-pero-quiero-que-me-busque",
    number: 1,
    title: "No quiero volver, pero quiero que me busque",
    shortTitle: "No quiero volver, pero quiero que me busque",
    description: "Rupturas, autoestima, rechazo y necesidad de validación. Por qué a veces no quieres retomar la relación, pero sí necesitas saber que aún eres importante.",
    summary: "No quieres volver con tu ex. Pero ¿por qué duele que no te busque? Exploramos qué hay detrás de esa contradicción y cómo recuperar la capacidad de elegir sin esperar la confirmación de otra persona.",
    duration: "9:46",
    date: "2026-10-11",
    coverSrc: "/podcast/episodio-01.avif",
    topics: ["Rupturas", "Autoestima", "Relaciones", "Psicología incómoda"],
    // Al disponer del enlace del episodio ya publicado, pegar aquí su URL completa de Spotify.
    // Alternativamente, alojar el MP3 en public/podcast/audio/ y utilizar audioSrc.
    spotifyUrl: "",
    audioSrc: "",
    sections: [
      {
        heading: "No quiero volver… pero quiero que me elija",
        paragraphs: [
          "Después de una ruptura podemos tener clara la decisión de no continuar una relación y, aun así, sentir malestar al comprobar que la otra persona ha dejado de buscarnos. Ambas experiencias pueden coexistir.",
          "La pregunta incómoda es si echamos de menos a esa persona o si necesitamos confirmar que todavía ocupamos un lugar importante en su vida. No siempre buscamos reconciliación; a veces buscamos reconocimiento."
        ]
      },
      {
        heading: "Memoria, incertidumbre y refuerzo intermitente",
        paragraphs: [
          "La memoria autobiográfica es reconstructiva: el estado emocional actual influye en qué episodios resultan más accesibles y en cómo los interpretamos. Recordar no equivale a reproducir literalmente el pasado.",
          "En relaciones con alternancia imprevisible de atención y distancia pueden mantenerse expectativas difíciles de abandonar. El refuerzo intermitente ofrece una analogía útil, aunque no explica por sí solo toda relación ni permite diagnosticar a sus integrantes."
        ]
      },
      {
        heading: "Una pregunta que cambia la perspectiva",
        paragraphs: [
          "Si tu expareja regresara hoy y te dijera que se ha equivocado, ¿sentirías primero amor, alivio, enfado o validación? No existe una respuesta obligatoria. La utilidad está en distinguir qué necesidad se activa.",
          "Cerrar una relación no implica olvidar, no sentir nostalgia o dejar de pensar automáticamente en alguien. Puede consistir en que la continuación de tu vida ya no dependa de que la otra persona regrese, se arrepienta o reconozca tu valor."
        ]
      }
    ],
    related: [
      { href: "/rupturas-de-pareja/", title: "Rupturas de pareja" },
      { href: "/autoestima-y-autocritica/", title: "Autoestima y autocrítica" },
      { href: "/limites-y-relaciones-dificiles/", title: "Límites y relaciones difíciles" }
    ]
  }
];

export function getEpisode(slug: string) {
  return episodes.find((episode) => episode.slug === slug);
}
