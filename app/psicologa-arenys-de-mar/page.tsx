import type { Metadata } from "next";
import "../seo-pages.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Psicóloga en Arenys de Mar | Carolina Sánchez Girona",
  description:
    "Psicóloga General Sanitaria y Neuropsicóloga en Arenys de Mar. Atención psicológica para adultos, evaluación e intervención neuropsicológica, presencial y online.",
  alternates: { canonical: "/psicologa-arenys-de-mar/" },
  openGraph: {
    title: "Psicóloga en Arenys de Mar | Carolina Sánchez Girona",
    description:
      "Psicología General Sanitaria y Neuropsicología en Arenys de Mar y online.",
    url: "https://carolinasanchezgirona.com/psicologa-arenys-de-mar/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología y Neuropsicología en Arenys de Mar",
  provider: {
    "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: ["Psicología General Sanitaria", "Neuropsicología"],
  url: "https://carolinasanchezgirona.com/psicologa-arenys-de-mar/",
};

export default function LocalPsychologistPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologia/">Psicología</a>
          <a href="/neuropsicologia/">Neuropsicología</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Arenys de Mar</span></p>
          <p className="editorial-eyebrow">Consulta en Arenys de Mar · Maresme</p>
          <h1>Psicóloga General Sanitaria y Neuropsicóloga en Arenys de Mar</h1>
          <p className="seo-lead">
            Atención psicológica para adultos y evaluación e intervención neuropsicológica desde una práctica clínica individualizada, basada en evidencia y adaptada a la persona, su contexto y sus objetivos.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#como-puedo-ayudarte">Ver áreas de atención</a>
          </div>
        </div>
      </section>

      <section className="editorial-section consultation-gallery" aria-labelledby="consulta-gallery-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Conoce el espacio</p>
            <h2 id="consulta-gallery-title">Tu consulta en Arenys de Mar</h2>
            <p>Un espacio de atención presencial en el que puedes conocer el despacho y la zona de espera antes de tu visita.</p>
          </div>
          <div className="consultation-gallery-grid">
            <figure className="consultation-gallery-main">
              <Image src="/consulta-carolina-sanchez-despacho.webp" alt="Despacho de psicología y neuropsicología de Carolina Sánchez en Arenys de Mar, con mesa de trabajo y zona de atención" width={1448} height={1086} sizes="(max-width: 720px) calc(100vw - 36px), (max-width: 1100px) 65vw, 670px" loading="lazy" />
              <figcaption>El despacho</figcaption>
            </figure>
            <figure>
              <Image src="/consulta-carolina-sanchez-sala-espera.webp" alt="Sala de espera de la consulta de Carolina Sánchez en Arenys de Mar con dos sillas y una planta" width={1086} height={1448} sizes="(max-width: 720px) calc(100vw - 36px), (max-width: 1100px) 35vw, 330px" loading="lazy" />
              <figcaption>La sala de espera</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section id="como-puedo-ayudarte">
            <h2>Psicología y neuropsicología en un mismo espacio clínico</h2>
            <p>
              No todas las consultas empiezan del mismo modo. Algunas personas llegan porque la ansiedad, el estado de ánimo, una pérdida o una situación relacional está interfiriendo en su vida. Otras necesitan comprender mejor cambios en memoria, atención, lenguaje o funciones ejecutivas. El punto de partida es diferente, pero el objetivo es el mismo: entender bien qué está ocurriendo antes de decidir cómo intervenir.
            </p>
            <p>
              En consulta trabajo dos áreas diferenciadas: Psicología General Sanitaria para adultos y Neuropsicología. La primera visita permite situar el motivo de consulta, revisar antecedentes relevantes y acordar los siguientes pasos sin aplicar un protocolo idéntico a todas las personas.
            </p>
          </section>

          <section>
            <h2>Atención psicológica para adultos</h2>
            <p>
              La consulta de Psicología General Sanitaria está orientada a adultos que atraviesan dificultades emocionales o vitales que empiezan a ocupar demasiado espacio en el día a día.
            </p>
            <ul>
              <li>Ansiedad, preocupación persistente y sensación de desbordamiento.</li>
              <li>Bajo estado de ánimo, apatía o pérdida de interés.</li>
              <li>Duelo y adaptación a pérdidas o cambios importantes.</li>
              <li>Dificultades en relaciones, límites y toma de decisiones.</li>
              <li>Sobrecarga, estrés y etapas de cambio vital.</li>
            </ul>
            <div className="seo-callout">
              <strong>La terapia empieza por comprender el problema, no por encajarlo en una etiqueta.</strong>
              <span>La formulación clínica orienta los objetivos y el tipo de intervención que puede ser más útil en cada caso.</span>
            </div>
          </section>

          <section>
            <h2>Evaluación e intervención neuropsicológica</h2>
            <p>
              La neuropsicología estudia la relación entre el funcionamiento cerebral y procesos como la memoria, la atención, el lenguaje, la planificación o la regulación de la conducta. Una evaluación puede ser útil cuando existen cambios cognitivos, dudas sobre el funcionamiento cotidiano o necesidad de definir un perfil cognitivo con mayor precisión.
            </p>
            <ul>
              <li>Quejas o cambios de memoria y atención.</li>
              <li>Dificultades de lenguaje o funciones ejecutivas.</li>
              <li>Deterioro cognitivo y demencias.</li>
              <li>Seguimiento de cambios cognitivos a lo largo del tiempo.</li>
              <li>Orientación a la persona y a la familia tras la evaluación.</li>
            </ul>
          </section>

          <section>
            <h2>Primera visita en Arenys de Mar</h2>
            <p>
              La primera sesión dura 60 minutos. Si dispones de informes previos de psicología, psiquiatría, neurología u otras especialidades médicas que consideres relevantes, puedes traerlos a la consulta. No es necesario enviar documentación clínica a través del formulario de reserva.
            </p>
            <p>
              La atención puede realizarse presencialmente en Arenys de Mar y, cuando el tipo de intervención lo permite, también online. La modalidad se valora según la necesidad clínica y el objetivo de la consulta.
            </p>
          </section>

          <section>
            <h2>Atención desde Arenys de Mar para el Maresme</h2>
            <p>
              La consulta está situada en Arenys de Mar y atiende a personas del entorno del Maresme, además de ofrecer atención online. La web está pensada para que puedas conocer previamente el tipo de trabajo clínico, consultar disponibilidad y reservar sin tener que compartir el motivo de consulta por correo o formularios abiertos.
            </p>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Información práctica</h2>
            <ul className="seo-facts">
              <li><span>Duración</span><strong>60 minutos</strong></li>
              <li><span>Psicología</span><strong>60 €</strong></li>
              <li><span>Neuropsicología</span><strong>75 €</strong></li>
              <li><span>Modalidad</span><strong>Presencial y online</strong></li>
              <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
            </ul>
            <p className="seo-card-note">La sesión de Psicología General Sanitaria tiene una tarifa de 60 € y la sesión de Neuropsicología de 75 €, ambas de 60 minutos. Las evaluaciones neuropsicológicas que requieran varias sesiones, pruebas específicas o informe se valoran aparte.</p>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>

          <div className="seo-card">
            <p className="editorial-section-eyebrow">Valoraciones en Google</p>
            <h3>5,0 de 5 · 20 reseñas</h3>
            <p>Valoración actual publicada en el perfil de empresa de Dememòria en Google.</p>
            <div className="seo-related">
              <a
                href="https://maps.app.goo.gl/ubCSFYZRgbv7vpqF9"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver reseñas en Google ↗
              </a>
            </div>
          </div>

          <div className="seo-card">
            <h3>Servicios</h3>
            <div className="seo-related">
              <a href="/psicologia/">Psicología General Sanitaria</a>
              <a href="/neuropsicologia/">Neuropsicología</a>
            </div>
          </div>
        </aside>
      </div>

      <section className="editorial-section" aria-labelledby="consulta-map-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Dónde está la consulta</p>
            <h2 id="consulta-map-title">Dememoria · Arenys de Mar</h2>
            <p style={{ color: "var(--e-ink-soft)", lineHeight: 1.7, marginTop: "14px" }}>
              Carrer Barcelona 8, Local · Arenys de Mar. Puedes abrir la ficha de Google para consultar la ubicación y las indicaciones para llegar.
            </p>
            <a
              className="editorial-card-link"
              href="https://maps.app.goo.gl/ubCSFYZRgbv7vpqF9"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps →
            </a>
          </div>
          <figure className="consultation-exterior-photo">
            <Image src="/consulta-carolina-sanchez-fachada.webp" alt="Fachada de Dememòria, consulta de psicología y neuropsicología en Carrer Barcelona, Arenys de Mar" width={1122} height={1402} sizes="(max-width: 720px) calc(100vw - 36px), (max-width: 1100px) 55vw, 480px" loading="lazy" />
            <figcaption>Entrada a la consulta</figcaption>
          </figure>
          <div style={{ overflow: "hidden", border: "1px solid var(--e-line)", borderRadius: "14px", background: "#fff" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2984.1022207147844!2d2.5429863999999998!3d41.588671299999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12bb370f7cb10fdd%3A0x163145da43e6593b!2sDememoria%20-%20Psic.%20Carolina%20S%C3%A1nchez!5e0!3m2!1ses!2ses!4v1789232018184!5m2!1ses!2ses"
              width="100%"
              height="420"
              style={{ display: "block", border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Mapa de Dememoria, consulta de Carolina Sánchez en Arenys de Mar"
            />
          </div>
        </div>
      </section>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div>
            <p className="editorial-section-eyebrow">Quién te atenderá</p>
            <h2>Carolina Sánchez Girona</h2>
            <p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
          </div>
          <div className="seo-authority-copy">
            <p>
              Mi práctica combina clínica de adultos y neuropsicología, con experiencia especialmente vinculada al deterioro cognitivo y las demencias. Trabajo desde una evaluación estructurada, razonamiento clínico y objetivos terapéuticos concretos.
            </p>
            <p>
              También participo en divulgación profesional y publicaciones vinculadas a psicología sanitaria y neuropsicología.
            </p>
            <div className="seo-authority-links">
              <a href="https://psiara.cat/2026/08/06/cuando-el-dolor-no-encuentra-un-lugar/" target="_blank" rel="noopener noreferrer">Publicación en PsiAra: Cuando el dolor no encuentra un lugar ↗</a>
              <a href="https://psiara.cat/2026/08/05/la-capacitat-per-testar-en-el-dret-civil-catala-des-duna-perspectiva-neuropsicologica/" target="_blank" rel="noopener noreferrer">Publicación en PsiAra sobre capacidad testamentaria y neuropsicología ↗</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="editorial-footer">
        <div className="editorial-wrap editorial-footer-inner">
          <div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div>
          <div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
