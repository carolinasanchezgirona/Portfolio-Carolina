import type { Metadata } from "next";
import "../seo-pages.css";
import ModeloVisual from "./modelo-visual";

export const metadata: Metadata = {
  title: "Cómo trabajo | Psicología y neuropsicología en Arenys de Mar",
  description:
    "Conoce cómo trabajo en consulta: comprender, definir objetivos, intervenir, medir y ajustar, y consolidar. Un proceso clínico individualizado en psicología y neuropsicología.",
  alternates: { canonical: "/como-trabajo/" },
  openGraph: {
    title: "Cómo trabajo | Carolina Sánchez, psicóloga y neuropsicóloga",
    description:
      "Una forma de trabajar estructurada, flexible y basada en la evaluación clínica, los objetivos compartidos y la revisión del proceso.",
    url: "https://carolinasanchezgirona.com/como-trabajo/",
  },
};

export default function ComoTrabajoPage() {
  return (
    <main className="editorial-site">
      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Cómo trabajo</span></p>
          <p className="editorial-eyebrow">Psicología sanitaria y neuropsicología</p>
          <h1>Mi forma de trabajar</h1>
          <p className="seo-lead">
            Un proceso claro, adaptado a cada persona. La evaluación, las hipótesis clínicas
            y los objetivos compartidos orientan qué hacemos en consulta. Las decisiones
            se apoyan en la evidencia disponible, sin aplicar técnicas de forma automática.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#etapas">Ver el proceso</a>
          </div>
        </div>
      </section>

      <ModeloVisual />

      <section className="modelo-extra" aria-labelledby="modelo-adaptacion-title">
        <div className="editorial-wrap modelo-extra-grid">
          <div className="modelo-extra-main">
            <h2 id="modelo-adaptacion-title">La forma de trabajar se adapta a lo que necesitas</h2>
            <p>
              Este esquema organiza mi práctica clínica, pero no es una terapia nueva ni un
              método validado de forma independiente. Según el motivo de consulta,
              el proceso puede centrarse en la intervención psicológica o en una evaluación
              neuropsicológica específica.
            </p>

            <div className="modelo-domain-grid">
              <article className="captacion-card">
                <p className="captacion-index">PSICOLOGÍA SANITARIA</p>
                <h3>Intervención psicológica</h3>
                <p>
                  El trabajo se orienta a las dificultades emocionales o del comportamiento
                  y a su repercusión en la vida cotidiana, con objetivos acordados contigo.
                </p>
                <a href="/psicologia/">Conocer psicología →</a>
              </article>
              <article className="captacion-card">
                <p className="captacion-index">NEUROPSICOLOGÍA</p>
                <h3>Evaluación y orientación</h3>
                <p>
                  Se integran la historia clínica, las pruebas indicadas y el funcionamiento
                  cotidiano para comprender el perfil cognitivo y orientar recomendaciones.
                </p>
                <a href="/evaluacion-neuropsicologica/">Conocer neuropsicología →</a>
              </article>
            </div>

            <div className="modelo-extras-footer">
              <h3>¿Y entre sesiones?</h3>
              <p>
                Cuando aporta valor, podemos utilizar <a href="/mi-espacio/">Mi espacio</a> para
                compartir materiales y objetivos concretos. Los contenidos se facilitan de
                forma individualizada: las notas clínicas internas no se publican
                automáticamente y los ejercicios no sustituyen las sesiones.
              </p>
            </div>
          </div>

          <aside className="seo-sidebar" aria-label="Información práctica">
            <div className="seo-card">
              <h2>Tu primera visita</h2>
              <p>
                Es un espacio para explicar qué te preocupa, aportar antecedentes
                relevantes y valorar juntos los siguientes pasos.
              </p>
              <ul className="seo-facts">
                <li><span>Duración</span><strong>60 minutos</strong></li>
                <li><span>Modalidades</span><strong>Presencial y online</strong></li>
                <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
              </ul>
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Solicitar cita</a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
