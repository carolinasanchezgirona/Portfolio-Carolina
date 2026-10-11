import Image from "next/image";

export default function PodcastArtwork({ compact = false }: { compact?: boolean }) {
  return (
    <div className={"podcast-artwork" + (compact ? " podcast-artwork-compact" : "")}>
      <div className="podcast-artwork-headline" aria-label="Psicología Incómoda">
        <span>PSICOLOGÍA</span>
        <strong>INCÓMODA<span className="podcast-artwork-dot">.</span></strong>
        <small>CON CAROLINA SÁNCHEZ GIRONA</small>
      </div>
      <div className="podcast-artwork-portrait">
        <Image
          src="/carolina-sanchez-portada-720.webp"
          alt="Carolina Sánchez Girona, psicóloga y neuropsicóloga"
          width={340}
          height={510}
          sizes={compact ? "120px" : "(max-width: 720px) 42vw, 270px"}
          loading="lazy"
        />
      </div>
      <div className="podcast-artwork-line" aria-hidden="true" />
      <span className="podcast-artwork-audio" aria-hidden="true">◖ ◗ ◖ ◗ ◖ ◗</span>
    </div>
  );
}
