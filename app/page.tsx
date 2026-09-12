import portrait from "./carolina-sanchez-retrato.webp";

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
          <a href="#sobre-mi">Sobre mí</a>
          <a className="nav-cta" href="#contacto">Pedir cita</a>
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
              <a className="editorial-btn editorial-btn-primary" href="#contacto">Pedir cita <Arrow /></a>
              <a className="editorial-btn editorial-btn-secondary" href="#como-trabajo">Cómo trabajo</a>
            </div>
            <div className="editorial-meta" aria-label="Información práctica">
              <span>60 minutos</span>
              <span>60 €</span>
              <span>Presencial y online</span>
            </div>
          </div>

          <figure className="editorial-photo">
            <img
              className="editorial-photo-image"
              src={portrait.src}
              alt="Carolina Sánchez, psicóloga y neuropsicóloga"
              width={480}
              height={618}
              loading="eager"
              decoding="sync"
            />
          </figure>
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
              <p>
                Ansiedad, estado de ánimo, duelo, relaciones, sobrecarga y cambios vitales que empiezan a ocupar
                demasiado espacio en el día a día.
              </p>
            </article>

            <article className="editorial-service-card editorial-service-coral" id="neuropsicologia">
              <div className="editorial-accent" />
              <p className="editorial-card-kicker">Evaluación e intervención</p>
              <h3>Neuropsicología</h3>
              <p>
                Memoria, atención, lenguaje, funciones ejecutivas, deterioro cognitivo y seguimiento cuando es
                necesario comprender mejor el perfil cognitivo.
              </p>
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
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-contact" id="contacto" aria-labelledby="contact-title">
        <div className="editorial-wrap editorial-contact-grid">
          <div>
            <p className="editorial-section-eyebrow">Contacto</p>
            <h2 id="contact-title">Podemos empezar por una primera visita.</h2>
          </div>
          <div className="editorial-contact-card">
            <p className="editorial-contact-place">Arenys de Mar · Maresme</p>
            <p>Consulta presencial y online · 60 min · 60 €</p>
            <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20primera%20visita">
              Solicitar primera visita <Arrow />
            </a>
            <a className="editorial-email" href="mailto:contact@carolinasanchezgirona.com">
              contact@carolinasanchezgirona.com
            </a>
          </div>
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
