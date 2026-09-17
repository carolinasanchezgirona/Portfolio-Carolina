import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function HomePage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="#areas">Áreas</a>
          <a href="#como-trabajo">Cómo trabajo</a>
          <a href="/sobre-mi/">Sobre mí</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="editorial-hero" id="inicio">
        <div className="editorial-wrap editorial-hero-grid">
          <div className="editorial-hero-copy">
            <p className="editorial-eyebrow">Carolina Sánchez · Psicología sanitaria y neuropsicología</p>
            <h1>Psicóloga sanitaria y neuropsicóloga en Arenys de Mar.</h1>
            <p className="editorial-lead">
              Atención psicológica para adultos y evaluación e intervención neuropsicológica. Un trabajo clínico
              individualizado, cercano y basado en evidencia, adaptado a la persona, su contexto y sus objetivos.
            </p>
            <div className="editorial-actions">
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita <Arrow /></a>
              <a className="editorial-btn editorial-btn-secondary" href="#como-trabajo">Cómo trabajo</a>
            </div>
            <div className="editorial-meta" aria-label="Información práctica">
              <span>60 minutos</span>
              <span>60 €</span>
              <span>Presencial y online</span>
            </div>
          </div>

          <figure className="editorial-photo">
            <Image
              className="editorial-photo-image"
              src="/carolina-sanchez-retrato-720.webp"
              alt="Carolina Sánchez, psicóloga y neuropsicóloga"
              width={720}
              height={927}
              sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 900px) 520px, 360px"
              preload
              unoptimized
            />
          </figure>
        </div>
      </section>

      <section className="editorial-trust" aria-label="Información profesional y práctica">
        <div className="editorial-wrap editorial-trust-grid">
          <div><strong>COPC 24892</strong><span>Psicóloga General Sanitaria</span></div>
          <div><strong>5,0 / 5</strong><span>20 reseñas en Google</span></div>
          <div><strong>Arenys de Mar</strong><span>Consulta presencial</span></div>
          <div><strong>Reserva online</strong><span>Disponibilidad en tiempo real</span></div>
        </div>
      </section>

      <section className="editorial-section" id="areas" aria-labelledby="areas-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Áreas de trabajo</p>
            <h2 id="areas-title">Dos puertas de entrada, una misma forma de trabajar.</h2>
          </div>

          <div className="editorial-service-grid">
            <article className="editorial-service-card editorial-service-teal" id="psicologia">
              <div className="editorial-accent" />
              <p className="editorial-card-kicker">Psicología sanitaria</p>
              <h3>Psicología</h3>
              <p className="editorial-card-copy">
                Ansiedad, estado de ánimo, duelo, relaciones, sobrecarga y cambios vitales que empiezan a ocupar
                demasiado espacio en el día a día.
              </p>
              <a className="editorial-card-link" href="/psicologia/">Ver Psicología General Sanitaria →</a>
            </article>

            <article className="editorial-service-card editorial-service-coral" id="neuropsicologia">
              <div className="editorial-accent" />
              <p className="editorial-card-kicker">Evaluación e intervención</p>
              <h3>Neuropsicología</h3>
              <p className="editorial-card-copy">
                Memoria, atención, lenguaje, funciones ejecutivas, deterioro cognitivo y seguimiento cuando es
                necesario comprender mejor el perfil cognitivo.
              </p>
              <a className="editorial-card-link" href="/neuropsicologia/">Ver Neuropsicología →</a>
            </article>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-method" id="como-trabajo" aria-labelledby="metodo-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Cómo trabajo</p>
            <h2 id="metodo-title">Comprender primero. Intervenir después.</h2>
          </div>

          <div className="editorial-step-grid">
            <article className="editorial-step editorial-step-teal">
              <div className="editorial-accent" />
              <span>01</span>
              <h3>Comprender</h3>
              <p>Historia, motivo de consulta, contexto actual y factores relevantes.</p>
            </article>
            <article className="editorial-step editorial-step-teal">
              <div className="editorial-accent" />
              <span>02</span>
              <h3>Formular</h3>
              <p>Organizar la información para construir una hipótesis clínica útil.</p>
            </article>
            <article className="editorial-step editorial-step-coral">
              <div className="editorial-accent" />
              <span>03</span>
              <h3>Intervenir</h3>
              <p>Definir objetivos concretos y seleccionar estrategias ajustadas al caso.</p>
            </article>
            <article className="editorial-step editorial-step-coral">
              <div className="editorial-accent" />
              <span>04</span>
              <h3>Revisar</h3>
              <p>Valorar cambios, dificultades y siguientes pasos sin automatismos.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-reviews" aria-labelledby="google-reviews-title">
        <div className="editorial-wrap editorial-reviews-grid">
          <div>
            <p className="editorial-section-eyebrow">Valoraciones en Google</p>
            <h2 id="google-reviews-title">5,0 de 5 · 20 reseñas</h2>
          </div>
          <div className="editorial-reviews-copy">
            <p>
              Valoración actual publicada en el perfil de empresa de Dememòria en Google.
            </p>
            <a
              className="editorial-card-link"
              href="https://maps.app.goo.gl/ubCSFYZRgbv7vpqF9"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver reseñas en Google →
            </a>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-local" aria-labelledby="local-title">
        <div className="editorial-wrap editorial-local-grid">
          <div>
            <p className="editorial-section-eyebrow">Consulta en el Maresme</p>
            <h2 id="local-title">Psicología y neuropsicología en Arenys de Mar.</h2>
          </div>
          <div className="editorial-local-copy">
            <p>
              La consulta está en Carrer Barcelona 8, Local, en Arenys de Mar. Puedes revisar cómo es la primera visita,
              las áreas de atención y la información práctica antes de reservar.
            </p>
            <div className="editorial-actions">
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
              <a className="editorial-btn editorial-btn-secondary" href="/psicologa-arenys-de-mar/">Ver consulta en Arenys de Mar</a>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-dememoria" aria-labelledby="dememoria-title">
        <div className="editorial-wrap editorial-dememoria-inner">
          <p className="editorial-section-eyebrow">Dememoria · Consulta clínica</p>
          <h2 id="dememoria-title">La clínica no empieza en una etiqueta diagnóstica.</h2>
          <p>
            Diagnóstico, pruebas y síntomas aportan información, pero adquieren sentido cuando se integran con la
            biografía, el funcionamiento cotidiano y las necesidades reales de la persona.
          </p>
        </div>
      </section>

      <section className="editorial-section editorial-about" id="sobre-mi" aria-labelledby="about-title">
        <div className="editorial-wrap editorial-about-grid">
          <div>
            <p className="editorial-section-eyebrow">Sobre mí</p>
            <h2 id="about-title">Carolina Sánchez Girona</h2>
            <p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
          </div>
          <div className="editorial-about-copy">
            <p>
              Trabajo en evaluación e intervención psicológica y neuropsicológica, con experiencia especialmente
              vinculada a la clínica de adultos, el deterioro cognitivo y las demencias.
            </p>
            <p>
              Combino razonamiento clínico, evaluación estructurada y objetivos terapéuticos concretos. Mi formación
              en Ingeniería Biomédica complementa esta práctica desde la neurociencia y la tecnología sanitaria.
            </p>
            <p>
              Participo también en divulgación profesional en psicología sanitaria y neuropsicología, con publicaciones en la revista PsiAra del Col·legi Oficial de Psicologia de Catalunya.
            </p>
            <p><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a></p>
            <p><a href="/psicologa-arenys-de-mar/">Consulta de Psicología y Neuropsicología en Arenys de Mar →</a></p>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-closing-cta" aria-labelledby="closing-cta-title">
        <div className="editorial-wrap editorial-closing-cta-inner">
          <div>
            <p className="editorial-section-eyebrow">Reserva</p>
            <h2 id="closing-cta-title">Si quieres valorar tu caso, puedes consultar la disponibilidad directamente.</h2>
          </div>
          <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita <Arrow /></a>
        </div>
      </section>

      <footer className="editorial-footer">
        <div className="editorial-wrap editorial-footer-inner">
          <div>
            <p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p>
            <p>Dememoria · Consulta de Psicología y Neuropsicología</p>
          </div>
          <div>
            <p>Arenys de Mar · Atención online</p>
            <p>© 2026 Carolina Sánchez Girona</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
