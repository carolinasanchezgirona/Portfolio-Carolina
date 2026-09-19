import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Psicóloga para duelo en Arenys de Mar y online",
  description:
    "Acompañamiento psicológico en procesos de duelo y pérdida para adultos en Arenys de Mar y online. Rupturas, fallecimientos, cambios vitales y otras pérdidas significativas.",
  alternates: { canonical: "/duelo/" },
  openGraph: {
    title: "Psicóloga para duelo | Carolina Sánchez Girona",
    description: "Atención psicológica en procesos de duelo, presencial en Arenys de Mar y online.",
    url: "https://carolinasanchezgirona.com/duelo/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Atención psicológica en duelo",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria" },
  areaServed: ["Arenys de Mar", "Maresme", "España"],
  serviceType: "Psicología General Sanitaria para duelo y pérdidas",
  url: "https://carolinasanchezgirona.com/duelo/",
};

export default function GriefPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologia/">Psicología</a>
          <a href="/psicologa-arenys-de-mar/">Arenys de Mar</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Duelo</span></p>
          <p className="editorial-eyebrow">Psicología General Sanitaria · Adultos</p>
          <h1>Psicóloga para duelo en Arenys de Mar y online</h1>
          <p className="seo-lead">
            El duelo no aparece solo tras una muerte. También puede acompañar una ruptura, una pérdida de salud, un cambio de rol, una separación familiar o el final de una etapa importante. La terapia ofrece un espacio para integrar lo ocurrido sin apresurar el proceso.
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
            <h2>El duelo es un proceso, no una secuencia fija</h2>
            <p>
              No existe una única manera correcta de vivir una pérdida. Algunas personas sienten tristeza intensa; otras alternan dolor, enfado, alivio, culpa, bloqueo o momentos de aparente normalidad. La experiencia cambia según el vínculo, las circunstancias de la pérdida, el apoyo disponible y la historia previa de la persona.
            </p>
            <p>
              La terapia no pretende borrar el dolor ni imponer un calendario. El objetivo es ayudar a comprender lo que está ocurriendo, facilitar la adaptación y recuperar progresivamente una vida que pueda incorporar la pérdida sin quedar completamente organizada alrededor de ella.
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Cuándo puede ser útil pedir ayuda</h2>
            <ul>
              <li>Cuando el dolor se mantiene con una intensidad difícil de sostener.</li>
              <li>Si aparece culpa persistente, autorreproche o necesidad de revisar continuamente lo ocurrido.</li>
              <li>Cuando cuesta retomar tareas, relaciones o responsabilidades básicas.</li>
              <li>Si una ruptura mantiene un ciclo repetido de búsqueda, contacto, esperanza y nueva desregulación.</li>
              <li>Cuando la pérdida reactiva duelos anteriores o experiencias que parecían cerradas.</li>
              <li>Si la persona siente que no encuentra un lugar donde hablar de lo ocurrido sin sentirse juzgada o apremiada.</li>
            </ul>
          </section>

          <section>
            <h2>Qué se trabaja en terapia</h2>
            <p>
              El trabajo puede incluir la comprensión de las emociones asociadas a la pérdida, la revisión de pensamientos de culpa o responsabilidad, el manejo de recuerdos y desencadenantes, la reorganización de rutinas y vínculos, y la recuperación de actividades que vuelvan a dar estructura y sentido al día a día.
            </p>
            <p>
              En procesos de ruptura también puede ser necesario trabajar límites, dependencia emocional, idealización, búsqueda de respuestas o dificultad para tolerar la ambivalencia. Cada duelo tiene una lógica propia y requiere una formulación ajustada a la persona.
            </p>
            <div className="seo-callout">
              <strong>El objetivo no es olvidar.</strong>
              <span>Es poder integrar lo ocurrido, conservar lo significativo y recuperar capacidad de vivir sin que la pérdida ocupe todo el espacio psicológico.</span>
            </div>
          </section>

          <section>
            <h2>Duelo por fallecimiento, ruptura y otras pérdidas</h2>
            <p>
              Aunque el fallecimiento de una persona cercana es una de las formas más reconocibles de duelo, también pueden generar un impacto profundo una separación, una enfermedad, la pérdida de un proyecto de vida, un cambio laboral, una migración, el deterioro de un familiar o una transformación importante de la propia identidad.
            </p>
            <p>
              Reconocer la pérdida concreta ayuda a entender por qué duele y qué necesita ser elaborado. A veces lo que se pierde no es solo una persona o una situación, sino también una expectativa de futuro, un rol o una sensación de seguridad.
            </p>
          </section>

          <section>
            <h2>Primera visita</h2>
            <p>
              La primera sesión dura 60 minutos y permite situar qué ha ocurrido, cómo está afectando la pérdida y qué apoyos o dificultades existen en este momento. No necesitas llegar con una explicación ordenada ni tener claro qué deberías estar sintiendo.
            </p>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Sesión de psicología</h2>
            <ul className="seo-facts">
              <li><span>Duración</span><strong>60 minutos</strong></li>
              <li><span>Tarifa</span><strong>60 €</strong></li>
              <li><span>Modalidad</span><strong>Presencial y online</strong></li>
              <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
          </div>
          <div className="seo-card">
            <h3>Relacionados</h3>
            <div className="seo-related">
              <a href="/psicologia/">Psicología General Sanitaria</a>
              <a href="/ansiedad/">Ansiedad</a>
              <a href="/depresion/">Depresión y bajo estado de ánimo</a>
              <a href="/cambios-vitales-y-adaptacion/">Cambios vitales y adaptación</a>
              <a href="/rupturas-de-pareja/">Rupturas de pareja</a>
              <a href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
            </div>
          </div>
        </aside>
      </div>

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
