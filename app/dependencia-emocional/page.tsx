import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Dependencia emocional en pareja | Psicóloga en Arenys de Mar",
  description:
    "Atención psicológica para dependencia emocional, miedo al abandono y dificultad para poner límites en relaciones de pareja. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/dependencia-emocional/" },
  openGraph: {
    title: "Dependencia emocional | Carolina Sánchez Girona",
    description:
      "Psicología sanitaria para trabajar miedo al abandono, límites, necesidad intensa de validación y patrones relacionales repetitivos.",
    url: "https://carolinasanchezgirona.com/dependencia-emocional/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para dependencia emocional",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Psicóloga General Sanitaria",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en dependencia emocional y patrones relacionales",
  url: "https://carolinasanchezgirona.com/dependencia-emocional/",
};

export default function EmotionalDependencyPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologia/">Psicología</a>
          <a href="/rupturas-de-pareja/">Rupturas</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs">
            <a href="/">Inicio</a><span>·</span>
            <a href="/psicologia/">Psicología</a><span>·</span>
            <span>Dependencia emocional</span>
          </p>
          <p className="editorial-eyebrow">Psicología General Sanitaria · Relaciones</p>
          <h1>Dependencia emocional y miedo al abandono</h1>
          <p className="seo-lead">
            Algunas relaciones se viven con una intensidad marcada por miedo a perder al otro, dificultad para poner límites, necesidad constante de confirmación o sensación de no poder estar bien sin la relación. La terapia puede ayudar a comprender y modificar estos patrones.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>Qué entendemos por dependencia emocional</h2>
            <p>
              La dependencia emocional no es una etiqueta diagnóstica única ni significa simplemente querer mucho a una pareja. Se utiliza para describir patrones en los que la relación se convierte en la principal fuente de seguridad, valoración o estabilidad, hasta el punto de dificultar decisiones, límites y autonomía.
            </p>
            <p>
              Puede aparecer en relaciones actuales o repetirse a lo largo del tiempo con distintas parejas. Para entenderlo bien es importante valorar la historia relacional, el miedo al abandono, las creencias sobre uno mismo y los patrones de interacción que se han ido reforzando.
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Cuándo puede ser útil pedir ayuda</h2>
            <ul>
              <li>Te cuesta poner límites por miedo a que la relación termine.</li>
              <li>Necesitas confirmación frecuente de que la otra persona te quiere o no va a dejarte.</li>
              <li>Te resulta difícil tomar decisiones sin consultar o anticipar la reacción de la pareja.</li>
              <li>Has renunciado repetidamente a necesidades, amistades o proyectos para mantener la relación.</li>
              <li>Una discusión o un distanciamiento breve generan una angustia muy intensa.</li>
              <li>Vuelves a relaciones que sabes que te hacen daño porque la separación resulta insoportable.</li>
              <li>La autoestima depende en gran medida de la atención o aprobación de la otra persona.</li>
            </ul>
          </section>

          <section>
            <h2>Qué puede mantener este patrón</h2>
            <h3>Miedo al abandono</h3>
            <p>
              Cuando la posibilidad de perder la relación se vive como una amenaza muy intensa, pueden aparecer conductas de control, búsqueda de seguridad, cesión excesiva o dificultad para expresar desacuerdo.
            </p>
            <h3>Validación externa</h3>
            <p>
              Si la valoración personal depende casi por completo de cómo responde la pareja, cualquier cambio en su atención puede activar inseguridad, comparación o necesidad de comprobación.
            </p>
            <h3>Dificultad para tolerar distancia o incertidumbre</h3>
            <p>
              Mensajes no respondidos, cambios de planes o periodos de menor contacto pueden convertirse en señales interpretadas como rechazo, aunque existan otras explicaciones posibles.
            </p>
            <h3>Patrones aprendidos en relaciones anteriores</h3>
            <p>
              Experiencias previas de abandono, invalidación, relaciones inestables o vínculos muy impredecibles pueden influir en la forma de interpretar y responder dentro de relaciones actuales.
            </p>
          </section>

          <section>
            <h2>Cómo se trabaja en terapia</h2>
            <p>
              La intervención suele centrarse en identificar el ciclo relacional, trabajar miedo al abandono y rumiación, entrenar límites, recuperar espacios propios, revisar creencias sobre valía personal y practicar decisiones menos dependientes de la respuesta de la pareja.
            </p>
            <p>
              También puede ser útil trabajar tolerancia a la incertidumbre, regulación emocional y capacidad para sostener desacuerdos sin interpretarlos automáticamente como una amenaza de ruptura.
            </p>
          </section>

          <section>
            <h2>Dependencia emocional no significa que toda la relación sea disfuncional</h2>
            <p>
              Es posible experimentar dependencia emocional dentro de una relación que también contiene afecto, apoyo y aspectos valiosos. El objetivo terapéutico no es etiquetar a la pareja ni decidir por la persona, sino entender qué patrones generan sufrimiento y qué cambios pueden aumentar autonomía y capacidad de elección.
            </p>
          </section>

          <section>
            <h2>Cuando aparece tras una ruptura</h2>
            <p>
              A veces el patrón se hace especialmente visible cuando la relación termina: contacto repetido, dificultad para aceptar la separación, idealización, búsqueda de señales de reconciliación o sensación de no poder avanzar sin una respuesta definitiva.
            </p>
            <p>
              En esos casos puede ser útil trabajar de forma conjunta el patrón de dependencia y el <a href="/rupturas-de-pareja/">duelo por la ruptura</a>.
            </p>
            <div className="seo-callout">
              <strong>Autonomía no significa indiferencia.</strong>
              <span>El objetivo es poder vincularse sin que el miedo a perder al otro decida por ti.</span>
            </div>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Sesión de psicología</h2>
            <ul className="seo-facts">
              <li><span>Duración</span><strong>60 minutos</strong></li>
              <li><span>Tarifa</span><strong>60 €</strong></li>
              <li><span>Modalidad</span><strong>Presencial y online</strong></li>
              <li><span>Pacientes</span><strong>Adultos</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>
          <div className="seo-card">
            <h3>Áreas relacionadas</h3>
            <div className="seo-related">
              <a href="/rupturas-de-pareja/">Rupturas de pareja</a>
              <a href="/limites-y-relaciones-dificiles/">Límites y relaciones difíciles</a>
              <a href="/autoestima-y-autocritica/">Autoestima y autocrítica</a>
              <a href="/miedo-al-rechazo-y-necesidad-de-aprobacion/">Miedo al rechazo y necesidad de aprobación</a>
              <a href="/ansiedad/">Ansiedad</a>
              <a href="/duelo/">Duelo y pérdidas</a>
              <a href="/psicologia/">Psicología General Sanitaria</a>
            </div>
          </div>
        </aside>
      </div>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div>
            <p className="editorial-section-eyebrow">Profesional responsable</p>
            <h2>Carolina Sánchez Girona</h2>
            <p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
          </div>
          <div className="seo-authority-copy">
            <p>
              Trabajo con adultos en dificultades relacionales, límites, ansiedad y procesos de ruptura desde una formulación clínica individualizada y orientada a aumentar autonomía y capacidad de elección.
            </p>
            <div className="seo-authority-links">
              <a href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
              <a href="/psicologia/">Ver Psicología General Sanitaria →</a>
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
