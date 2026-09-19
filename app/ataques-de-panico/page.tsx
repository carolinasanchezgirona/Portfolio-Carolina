import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Psicóloga para ataques de pánico | Arenys de Mar",
  description:
    "Atención psicológica para ataques de pánico y miedo a nuevas crisis en adultos en Arenys de Mar y online. Evaluación clínica e intervención basada en evidencia.",
  alternates: { canonical: "/ataques-de-panico/" },
  openGraph: {
    title: "Ataques de pánico | Carolina Sánchez Girona",
    description:
      "Psicología sanitaria para crisis de pánico, miedo anticipatorio y evitación asociada.",
    url: "https://carolinasanchezgirona.com/ataques-de-panico/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para ataques de pánico",
  provider: {
    "@type": "Person",
    name: "Carolina Sánchez Girona",
    jobTitle: "Psicóloga General Sanitaria",
    url: "https://carolinasanchezgirona.com",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en ataques de pánico",
  url: "https://carolinasanchezgirona.com/ataques-de-panico/",
};

export default function PanicPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologia/">Psicología</a>
          <a href="/ansiedad/">Ansiedad</a>
              <a href="/ansiedad-por-la-salud-e-hipocondria/">Ansiedad por la salud</a>
              <a href="/pensamientos-intrusivos-y-miedo-a-perder-el-control/">Pensamientos intrusivos</a>
              <a href="/agorafobia-y-miedo-a-salir/">Agorafobia y miedo a salir</a>
              <a href="/fobias-especificas/">Fobias específicas</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs">
            <a href="/">Inicio</a><span>·</span>
            <a href="/psicologia/">Psicología</a><span>·</span>
            <a href="/ansiedad/">Ansiedad</a><span>·</span>
            <span>Ataques de pánico</span>
          </p>
          <p className="editorial-eyebrow">Psicología General Sanitaria · Ansiedad</p>
          <h1>Ataques de pánico y miedo a nuevas crisis</h1>
          <p className="seo-lead">
            Las crisis de pánico pueden aparecer de forma súbita y generar una intensa sensación de pérdida de control, amenaza física o miedo a que vuelva a ocurrir. La intervención psicológica puede ayudar a comprender el ciclo de pánico y reducir la evitación que lo mantiene.
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
            <h2>Qué es un ataque de pánico</h2>
            <p>
              Un ataque de pánico es un episodio de miedo o malestar intenso que alcanza un pico rápidamente y puede acompañarse de palpitaciones, opresión torácica, sensación de falta de aire, mareo, temblor, sudoración, desrealización o miedo a perder el control.
            </p>
            <p>
              Tener una crisis aislada no implica necesariamente un trastorno de pánico. Lo clínicamente relevante es valorar la frecuencia, el miedo anticipatorio, la interpretación de las sensaciones corporales y si empiezan a aparecer conductas de evitación o cambios importantes en la vida cotidiana.
            </p>
          </section>

          <section id="cuando-consultar">
            <h2>Cuándo puede ser útil pedir ayuda</h2>
            <ul>
              <li>Has tenido una o varias crisis intensas y temes que vuelvan a aparecer.</li>
              <li>Evitas conducir, salir sola, usar transporte público, hacer ejercicio o estar lejos de lugares seguros.</li>
              <li>Interpretas sensaciones físicas como señales de peligro inmediato.</li>
              <li>Revisas continuamente tu cuerpo o necesitas comprobar que estás bien.</li>
              <li>La anticipación de una nueva crisis ocupa mucho espacio mental.</li>
              <li>Has acudido varias veces a urgencias o consultas médicas por síntomas que finalmente no explicaban una causa aguda.</li>
            </ul>
          </section>

          <section>
            <h2>Cómo se mantiene el ciclo de pánico</h2>
            <p>
              En muchos casos el problema no es solo la crisis inicial, sino lo que ocurre después. Una sensación corporal se interpreta como peligrosa, aumenta la activación fisiológica y esa activación confirma la idea de que algo grave está pasando. El miedo crece y la persona intenta escapar, evitar o controlar las sensaciones.
            </p>
            <p>
              Estas estrategias pueden aliviar a corto plazo, pero también reforzar la percepción de peligro y hacer que el cuerpo se vuelva un foco constante de vigilancia.
            </p>
          </section>

          <section>
            <h2>Cómo se trabaja en terapia</h2>
            <h3>Psicoeducación sobre el pánico</h3>
            <p>
              Comprender qué ocurre fisiológicamente durante una crisis ayuda a reducir interpretaciones catastróficas y a diferenciar sensaciones intensas de señales de peligro real.
            </p>
            <h3>Exposición a sensaciones y situaciones evitadas</h3>
            <p>
              Cuando está indicado, se trabaja de forma gradual con exposición interoceptiva y situacional para reducir el miedo aprendido a determinadas sensaciones corporales o contextos.
            </p>
            <h3>Reducir conductas de seguridad</h3>
            <p>
              Puede ser necesario revisar comprobaciones, escapes, acompañamientos obligatorios u otras estrategias que mantienen la idea de que la situación solo es tolerable si existe una protección especial.
            </p>
            <h3>Trabajar la interpretación de síntomas</h3>
            <p>
              La intervención también puede centrarse en cómo se interpretan palpitaciones, mareo, sensación de ahogo u otras señales corporales, especialmente cuando se asocian de forma automática a peligro o pérdida de control.
            </p>
          </section>

          <section>
            <h2>Pánico, ansiedad y agorafobia</h2>
            <p>
              El pánico puede aparecer dentro de distintos cuadros de ansiedad. En algunos casos se desarrolla un patrón de evitación de lugares o situaciones en las que escapar parece difícil o donde la persona teme no recibir ayuda si aparece una crisis.
            </p>
            <p>
              Si la preocupación es más generalizada, persistente y no se centra principalmente en crisis de pánico, puede ser útil consultar también la información sobre <a href="/ansiedad/">ansiedad</a>.
            </p>
          </section>

          <section>
            <h2>Cuándo conviene valoración médica</h2>
            <p>
              Cuando los síntomas físicos son nuevos, intensos o no han sido valorados previamente, puede ser necesario descartar causas médicas. La evaluación psicológica no sustituye esa valoración.
            </p>
            <p>
              Si ya se han descartado causas agudas y el miedo a los síntomas sigue generando crisis, evitación o deterioro funcional, la intervención psicológica puede centrarse en el ciclo de pánico y sus factores de mantenimiento.
            </p>
            <div className="seo-callout">
              <strong>El objetivo no es eliminar cualquier sensación corporal.</strong>
              <span>El trabajo consiste en dejar de interpretarlas automáticamente como peligrosas y recuperar libertad de acción.</span>
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
              <a href="/ansiedad/">Ansiedad</a>
              <a href="/depresion/">Depresión y bajo estado de ánimo</a>
              <a href="/psicologia/">Psicología General Sanitaria</a>
              <a href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
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
              Trabajo con adultos desde una formulación clínica individualizada, integrando psicoeducación, exposición, regulación emocional y estrategias cognitivo-conductuales cuando están indicadas.
            </p>
            <div className="seo-authority-links">
              <a href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
              <a href="/ansiedad/">Ver información sobre ansiedad →</a>
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
