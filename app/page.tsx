import type { Metadata } from "next";
import Image from "next/image";
import SocialLinks from "./components/social-links";

export const metadata: Metadata = {
  title: "Carolina Sánchez Girona | Psicóloga y Neuropsicóloga",
  description:
    "Psicóloga y neuropsicóloga en Arenys de Mar. Psicología para adultos, ansiedad, duelo, problemas de memoria y deterioro cognitivo. Presencial y online.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Carolina Sánchez Girona | Psicóloga y Neuropsicóloga",
    description:
      "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online.",
    url: "https://carolinasanchezgirona.com/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Carolina Sánchez Girona | Psicóloga y Neuropsicóloga",
    description:
      "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online.",
  },
};

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function HomePage() {
  return (
    <main className="editorial-site">
      <section className="editorial-hero" id="inicio">
        <div className="editorial-wrap editorial-hero-grid">
          <div className="editorial-hero-copy">
            <p className="editorial-eyebrow">Carolina Sánchez · Psicología sanitaria y neuropsicología</p>
            <h1>Psicóloga sanitaria y neuropsicóloga en Arenys de Mar.</h1>
            <p className="editorial-hero-statement">Comprender qué te ocurre es el primer paso para abordarlo.</p>
            <p className="editorial-lead">
              Ofrezco atención psicológica y neuropsicológica a personas adultas y familias. Combino
              evaluación clínica, intervención y orientación práctica adaptadas a cada situación.
            </p>
            <div className="editorial-actions">
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita <Arrow /></a>
              <a className="editorial-btn editorial-btn-secondary" href="#como-trabajo">Cómo trabajo</a>
            </div>
            <div className="editorial-meta" aria-label="Información práctica">
              <span>60 minutos</span>
              <span>Psicología 60 € · Neuropsicología 75 €</span>
              <span>Presencial y online</span>
            </div>
          </div>

          <figure className="editorial-photo">
            <Image
              className="editorial-photo-image"
              src="/carolina-sanchez-portada-720.webp"
              alt="Carolina Sánchez, psicóloga y neuropsicóloga"
              width={720}
              height={1080}
              sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 900px) 520px, 360px"
              quality={82}
              priority
              fetchPriority="high"
              unoptimized
            />
          </figure>
        </div>
      </section>

      <section className="editorial-trust" aria-label="Información profesional y práctica">
        <div className="editorial-wrap editorial-trust-grid">
          <div><strong>COPC 24892</strong><span>Psicóloga General Sanitaria</span></div>
          <div><strong>5,0 / 5</strong><span>27 reseñas en Google</span></div>
          <div><strong>Arenys de Mar</strong><span>Consulta presencial</span></div>
          <div><strong>Reserva online</strong><span>Disponibilidad en tiempo real</span></div>
        </div>
      </section>

      <section className="editorial-section" id="areas" aria-labelledby="areas-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Áreas de trabajo</p>
            <h2 id="areas-title">¿En qué puedo ayudarte?</h2>
          </div>

          <div className="editorial-service-grid">
            <article className="editorial-service-card editorial-service-teal" id="psicologia">
              <div className="editorial-accent" />
              <p className="editorial-card-kicker">Psicología sanitaria</p>
              <h3>Psicología</h3>
              <p className="editorial-card-hook">Cuando lo que sientes empieza a afectar a tu vida.</p>
              <p className="editorial-card-copy">
                <a href="/ansiedad/">Ansiedad</a> que interfiere en tu día a día, dificultades en las relaciones,
                cambios en el estado de ánimo, <a href="/duelo/">pérdidas</a> o situaciones que te cuesta gestionar.
                Trabajaremos para comprender lo que ocurre y definir objetivos terapéuticos concretos.
              </p>
              <p className="editorial-card-price">Sesión de psicología · 60 € / 60 minutos</p>
              <a className="editorial-card-link" href="/psicologia/">Conocer el servicio de psicología →</a>
            </article>

            <article className="editorial-service-card editorial-service-coral" id="neuropsicologia">
              <div className="editorial-accent" />
              <p className="editorial-card-kicker">Evaluación e intervención</p>
              <h3>Neuropsicología</h3>
              <p className="editorial-card-hook">Cuando aparecen cambios en la memoria, la atención o la conducta.</p>
              <p className="editorial-card-copy">
                ¿Olvidos cada vez más frecuentes o dificultades en tareas que antes eran sencillas?
                Estudio los <a href="/problemas-de-memoria/">cambios cognitivos</a> y su repercusión cotidiana,
                con especial atención al <a href="/deterioro-cognitivo/">deterioro cognitivo</a>,
                las demencias y la orientación a familiares y cuidadores.
              </p>
              <div className="editorial-card-bottom">
                <p className="editorial-card-price">75 € <span>· Sesión de 60 minutos</span></p>
                <p className="editorial-card-note">Las evaluaciones completas tienen un presupuesto específico.</p>
                <a className="editorial-card-link" href="/neuropsicologia/">Conocer neuropsicología →</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-method" id="como-trabajo" aria-labelledby="metodo-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Cómo trabajo</p>
            <h2 id="metodo-title">Evaluar, comprender y acompañar.</h2>
            <p className="editorial-method-intro">
              El proceso comienza escuchando el motivo de consulta y comprendiendo su contexto.
              A partir de la evaluación clínica, definimos objetivos y revisamos la evolución.
            </p>
          </div>

          <div className="editorial-method-editorial-layout">
            <figure className="editorial-method-portrait">
              <Image
                src="/carolina-sanchez-como-trabajo.webp"
                alt="Carolina Sánchez trabajando con una libreta"
                width={540}
                height={960}
                sizes="(max-width: 680px) 240px, (max-width: 900px) 270px, 310px"
                loading="lazy"
              />
            </figure>
            <div className="editorial-method-list" aria-label="Fases del proceso clínico">
              <div className="editorial-method-item">
                <span className="editorial-method-number" aria-hidden="true">01</span>
                <div><h3>Comprender</h3><p>Explorar el motivo de consulta, la historia clínica y el contexto.</p></div>
              </div>
              <div className="editorial-method-item">
                <span className="editorial-method-number" aria-hidden="true">02</span>
                <div><h3>Formular</h3><p>Integrar los datos y formular hipótesis clínicas fundamentadas.</p></div>
              </div>
              <div className="editorial-method-item">
                <span className="editorial-method-number" aria-hidden="true">03</span>
                <div><h3>Intervenir</h3><p>Acordar objetivos y seleccionar intervenciones ajustadas.</p></div>
              </div>
              <div className="editorial-method-item">
                <span className="editorial-method-number" aria-hidden="true">04</span>
                <div><h3>Revisar</h3><p>Revisar la evolución y ajustar el plan cuando sea necesario.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-reviews" aria-labelledby="google-reviews-title">
        <div className="editorial-wrap editorial-reviews-grid">
          <div>
            <p className="editorial-section-eyebrow">Valoraciones en Google</p>
            <h2 id="google-reviews-title">5,0 de 5 · 27 reseñas</h2>
          </div>
          <div className="editorial-reviews-copy">
            <p>
              Las reseñas corresponden a Dememòria, nombre con el que también se conoce mi consulta en Arenys de Mar. La atención profesional la presta Carolina Sánchez Girona.
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
        <div className="editorial-wrap">
          <div className="editorial-local-heading">
            <p className="editorial-section-eyebrow">Consulta en el Maresme</p>
            <h2 id="local-title">Psicología y neuropsicología en Arenys de Mar.</h2>
          </div>
          <div className="editorial-local-grid">
            <a className="editorial-local-photo" href="/psicologa-arenys-de-mar/" aria-label="Ver fotografías de la consulta en Arenys de Mar">
              <Image src="/consulta-carolina-sanchez-despacho.webp" alt="Interior de la consulta de psicología y neuropsicología de Carolina Sánchez en Arenys de Mar" width={1448} height={1086} sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 900px) 560px, 520px" loading="lazy" />
            </a>
            <div className="editorial-local-copy">
              <p>Mi consulta está en Carrer Barcelona 8, Local, en Arenys de Mar.</p>
              <p>Un espacio para la atención psicológica, la evaluación neuropsicológica y el acompañamiento a personas adultas y familias.</p>
              <a className="editorial-card-link" href="/psicologa-arenys-de-mar/">Ver la consulta y cómo llegar <Arrow /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-about" id="sobre-mi" aria-labelledby="about-title">
        <div className="editorial-wrap editorial-about-grid editorial-about-refined">
          <div className="editorial-about-content">
            <p className="editorial-section-eyebrow">Sobre mí</p>
            <h2 id="about-title">Carolina Sánchez Girona</h2>
            <p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
            <div className="editorial-about-copy">
              <p>
                Trabajo en psicología sanitaria y neuropsicología clínica con personas adultas.
                Atiendo dificultades emocionales y del comportamiento, y realizo evaluaciones
                del funcionamiento cognitivo, incluyendo memoria, atención y funciones ejecutivas.
                Integro la entrevista clínica, la evaluación estructurada y el contexto personal
                para orientar cada intervención.
              </p>
              <p>
                Participo también en divulgación profesional y he publicado en PsiAra,
                la revista del Col·legi Oficial de Psicologia de Catalunya.
              </p>
            </div>
            <a className="editorial-about-more" href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
            <SocialLinks className="editorial-about-social" />
          </div>
          <figure className="editorial-about-photo">
            <Image
              src="/carolina-sanchez-sobre-mi.webp"
              alt="Carolina Sánchez sentada en una terraza luminosa rodeada de plantas"
              width={540}
              height={810}
              sizes="(max-width: 680px) min(100vw - 36px, 300px), (max-width: 900px) 320px, 345px"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="editorial-section editorial-first-visit" aria-labelledby="first-visit-home-title">
        <div className="editorial-wrap editorial-first-visit-grid">
          <div>
            <p className="editorial-section-eyebrow">Antes de venir</p>
            <h2 id="first-visit-home-title">¿Cómo será nuestra primera sesión?</h2>
          </div>
          <div className="editorial-first-visit-copy">
            <p>La primera sesión dura 60 minutos. Hablaremos de lo que te preocupa, revisaremos los antecedentes relevantes y valoraremos los siguientes pasos. Puedes traer informes previos si dispones de ellos.</p>
            <a className="editorial-card-link" href="/psicologa-arenys-de-mar/">Cómo llegar y preparar la visita <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-podcast-section" aria-labelledby="podcast-home-title">
        <div className="editorial-wrap editorial-podcast-card">
          <div className="editorial-podcast-heading">
            <p className="editorial-section-eyebrow editorial-podcast-eyebrow">Pódcast · Psicología Incómoda</p>
            <h2 id="podcast-home-title">Preguntas incómodas. Psicología sin frases vacías.</h2>
          </div>
          <div className="editorial-podcast-copy">
            <p>Una serie de divulgación sobre relaciones, emociones, ciencia y humor. Empieza con «No quiero volver, pero quiero que me busque».</p>
            <a className="editorial-card-link" href="/podcast/">Conocer el pódcast <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-closing-cta" aria-labelledby="closing-cta-title">
        <div className="editorial-wrap editorial-closing-cta-inner">
          <div>
            <p className="editorial-section-eyebrow">Reserva</p>
            <h2 id="closing-cta-title">¿Hablamos? Consulta los horarios y elige cuándo quieres venir.</h2>
            <p className="editorial-closing-prices">Psicología: 60 € · Neuropsicología: 75 € · Sesiones de 60 minutos</p>
          </div>
          <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita <Arrow /></a>
        </div>
      </section>

    </main>
  );
}
