import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Psicóloga para rupturas de pareja | Arenys de Mar",
  description:
    "Atención psicológica para rupturas de pareja, separación y duelo afectivo en adultos en Arenys de Mar y online. Intervención individualizada para recuperar estabilidad y autonomía.",
  alternates: { canonical: "/rupturas-de-pareja/" },
  openGraph: {
    title: "Rupturas de pareja | Carolina Sánchez Girona",
    description:
      "Psicología sanitaria para afrontar separaciones, duelo afectivo, ambivalencia y dificultad para cerrar una relación.",
    url: "https://carolinasanchezgirona.com/rupturas-de-pareja/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para rupturas de pareja",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Psicóloga General Sanitaria",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en rupturas de pareja y duelo afectivo",
  url: "https://carolinasanchezgirona.com/rupturas-de-pareja/",
};

export default function BreakupPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologia/">Psicología</a>
          <a href="/duelo/">Duelo</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs">
            <a href="/">Inicio</a><span>·</span>
            <a href="/psicologia/">Psicología</a><span>·</span>
            <span>Rupturas de pareja</span>
          </p>
          <p className="editorial-eyebrow">Psicología General Sanitaria · Relaciones</p>
          <h1>Rupturas de pareja y duelo afectivo</h1>
          <p className="seo-lead">
            Una separación puede activar tristeza, ansiedad, rumiación, ambivalencia y una fuerte necesidad de encontrar respuestas. La terapia puede ayudar a ordenar lo ocurrido, recuperar estabilidad y reconstruir una vida que no gire alrededor de la relación perdida.
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
            <h2>Una ruptura también es un proceso de duelo</h2>
            <p>
              El final de una relación implica la pérdida de una persona, pero también de rutinas, proyectos, expectativas y una determinada identidad compartida. Por eso pueden coexistir tristeza, alivio, enfado, culpa, miedo, nostalgia o dudas sobre la decisión tomada.
            </p>
            <p>
              No existe una secuencia emocional obligatoria ni un plazo universal para “superarlo”. Lo clínicamente relevante es valorar cómo evoluciona el proceso y si el malestar empieza a bloquear el funcionamiento cotidiano o a mantener a la persona atrapada en conductas que prolongan el vínculo.
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Cuándo puede ser útil pedir ayuda</h2>
            <ul>
              <li>La ruptura ocupa prácticamente todo el espacio mental del día.</li>
              <li>Revisas mensajes, redes sociales o información sobre la expareja de forma repetitiva.</li>
              <li>Te cuesta aceptar que la relación ha terminado aunque racionalmente lo entiendas.</li>
              <li>Alternas esperanza, enfado, culpa y necesidad de volver a contactar.</li>
              <li>El sueño, el apetito, el trabajo o las relaciones sociales se han deteriorado.</li>
              <li>Te resulta difícil tomar decisiones sin pensar en cómo reaccionaría la expareja.</li>
              <li>La ruptura ha reactivado patrones anteriores de abandono, rechazo o dependencia.</li>
            </ul>
          </section>

          <section>
            <h2>Qué suele mantener el sufrimiento</h2>
            <h3>Búsqueda de una explicación perfecta</h3>
            <p>
              Después de una ruptura es frecuente intentar reconstruir cada conversación para encontrar una respuesta definitiva. A veces esa búsqueda deja de aportar comprensión y se convierte en rumiación.
            </p>
            <h3>Contacto intermitente</h3>
            <p>
              Mensajes ambiguos, encuentros ocasionales o periodos de acercamiento y alejamiento pueden dificultar la adaptación porque mantienen activa la expectativa de recuperación de la relación.
            </p>
            <h3>Idealización selectiva</h3>
            <p>
              En momentos de soledad o dolor, la memoria puede centrarse en los aspectos positivos de la relación y perder de vista los conflictos, incompatibilidades o necesidades no satisfechas que también formaban parte del vínculo.
            </p>
            <h3>Pérdida de estructura propia</h3>
            <p>
              Cuando gran parte de la rutina, las amistades o los planes estaban organizados alrededor de la pareja, la ruptura puede dejar un vacío práctico además de emocional.
            </p>
          </section>

          <section>
            <h2>Cómo se trabaja en terapia</h2>
            <p>
              La intervención puede centrarse en procesar la pérdida, reducir rumiación y conductas de comprobación, trabajar límites de contacto, revisar patrones relacionales y recuperar actividades, vínculos y proyectos propios.
            </p>
            <p>
              También puede ser necesario trabajar ambivalencia, culpa, idealización, miedo a la soledad o dificultad para sostener una decisión cuando la relación ha sido intermitente.
            </p>
          </section>

          <section>
            <h2>Ruptura, duelo y dependencia emocional</h2>
            <p>
              Algunas rupturas generan un duelo intenso sin que exista un patrón de dependencia emocional. En otros casos, la relación se ha sostenido alrededor de miedo al abandono, dificultad para poner límites, necesidad intensa de validación o renuncia continuada a necesidades propias.
            </p>
            <p>
              La formulación clínica ayuda a diferenciar qué pertenece al proceso de pérdida y qué patrones conviene trabajar más allá de esta relación concreta. Si el malestar está ligado principalmente a una pérdida, puedes consultar también la página de <a href="/duelo/">duelo y pérdidas</a>.
            </p>
          </section>

          <section>
            <h2>Cuando hay hijos o asuntos prácticos compartidos</h2>
            <p>
              Si existen hijos, vivienda, economía u otras responsabilidades compartidas, el objetivo no siempre puede ser cortar el contacto. En esos casos se trabaja una comunicación más funcional, límites claros y separación entre asuntos prácticos y conversaciones emocionales que reabren el conflicto.
            </p>
            <div className="seo-callout">
              <strong>Cerrar una relación no significa borrar lo vivido.</strong>
              <span>El objetivo es poder integrar la pérdida sin que siga organizando toda la vida presente.</span>
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
              <a href="/duelo/">Duelo y pérdidas</a>
              <a href="/ansiedad/">Ansiedad</a>
              <a href="/depresion/">Depresión y bajo estado de ánimo</a>
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
              Trabajo con adultos en procesos de pérdida, relaciones y cambios vitales desde una formulación clínica individualizada, con objetivos concretos y estrategias basadas en evidencia.
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
