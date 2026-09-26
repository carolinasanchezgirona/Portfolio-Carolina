import type { Metadata } from "next";
import Image from "next/image";
import SocialLinks from "./components/social-links";

export const metadata: Metadata = {
  title: "Carolina Sánchez Girona | Psicóloga y Neuropsicóloga",
  description:
    "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online. Atención psicológica para adultos, evaluación neuropsicológica y seguimiento cognitivo.",
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

          <div className="editorial-method-photo-layout">
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
          <figure className="editorial-method-photo">
            <Image
              src="/carolina-sanchez-como-trabajo.webp"
              alt="Carolina Sánchez con una libreta durante la preparación de su trabajo clínico"
              width={540}
              height={960}
              sizes="(max-width: 680px) min(calc(100vw - 36px), 420px), (max-width: 900px) 440px, 340px"
              loading="lazy"
            />
          </figure>
          </div>
        </div>
      </section>

      <section className="editorial-section home-question-card" aria-labelledby="home-question-title">
        <div className="editorial-wrap home-question-grid">
          <div>
            <p className="editorial-section-eyebrow">Un espacio para tus dudas</p>
            <h2 id="home-question-title">Tu Consulta</h2>
            <figure className="home-question-photo">
              <Image
                src="/carolina-sanchez-tu-consulta.webp"
                alt="Carolina Sánchez sentada ante una mesa, con gafas rosas, en un espacio luminoso"
                width={640}
                height={640}
                sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 920px) 370px, 340px"
                loading="lazy"
              />
            </figure>
          </div>
          <div className="home-question-copy">
            <p>
              Puedes enviarme una pregunta general sobre psicología, relaciones, memoria o neuropsicología. Revisaré
              las consultas y publicaré respuestas claras y profesionales, siempre de forma anonimizada.
            </p>
            <div className="home-question-points" aria-label="Características del buzón">
              <span><strong>Privado</strong>Tu pregunta original no se publica.</span>
              <span><strong>Revisado</strong>Cada respuesta pasa por revisión profesional.</span>
              <span><strong>Divulgativo</strong>Orientación general, no diagnóstico individual.</span>
            </div>
            <a className="editorial-btn editorial-btn-primary home-question-link" href="/pregunta-a-carolina/">Enviar una pregunta <Arrow /></a>
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
            <a className="editorial-local-photo" href="/psicologa-arenys-de-mar/" aria-label="Ver fotografías de la consulta en Arenys de Mar">
              <Image src="/consulta-carolina-sanchez-despacho.webp" alt="Interior de la consulta de psicología y neuropsicología de Carolina Sánchez en Arenys de Mar" width={1448} height={1086} sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 900px) 560px, 480px" loading="lazy" />
            </a>
            <div className="editorial-actions">
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
              <a className="editorial-btn editorial-btn-secondary" href="/psicologa-arenys-de-mar/">Ver consulta en Arenys de Mar</a>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-dememoria" aria-labelledby="dememoria-title">
        <div className="editorial-wrap editorial-dememoria-inner">
          <p className="editorial-section-eyebrow">Carolina Sánchez · Dememòria</p>
          <h2 id="dememoria-title">La misma consulta, una identidad profesional más personal.</h2>
          <p>
            Dememòria es el nombre con el que se ha dado a conocer mi consulta en Arenys de Mar. En esta web encontrarás mi actividad profesional como Carolina Sánchez Girona, psicóloga sanitaria y neuropsicóloga, en el mismo espacio de atención.
          </p>
        </div>
      </section>

      <section className="editorial-section editorial-about" id="sobre-mi" aria-labelledby="about-title">
        <div className="editorial-wrap editorial-about-grid">
          <div>
            <p className="editorial-section-eyebrow">Sobre mí</p>
            <h2 id="about-title">Carolina Sánchez Girona</h2>
            <p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
            <figure className="editorial-about-photo">
              <Image
                src="/carolina-sanchez-sobre-mi.webp"
                alt="Carolina Sánchez sentada en una terraza luminosa rodeada de plantas"
                width={540}
                height={810}
                sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 900px) 480px, 340px"
                loading="lazy"
              />
            </figure>
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
            <SocialLinks className="editorial-about-social" />
          </div>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="first-visit-home-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Antes de venir</p>
            <h2 id="first-visit-home-title">Tu primera visita, sin incertidumbres innecesarias.</h2>
            <p>La primera sesión dura 60 minutos. Hablaremos del motivo de consulta, los antecedentes relevantes y lo que necesitas en este momento. Si dispones de informes previos, puedes traerlos, pero no es necesario enviarlos al reservar.</p>
            <div className="editorial-actions">
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar horarios y reservar <Arrow /></a>
              <a className="editorial-btn editorial-btn-secondary" href="/psicologa-arenys-de-mar/">Ver el espacio y cómo llegar</a>
            </div>
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

    </main>
  );
}
