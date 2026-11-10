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

      <section className="modelo-integrado" aria-labelledby="modelo-adaptacion-title">
        <div className="editorial-wrap modelo-integrado-grid">
          <ModeloVisual />

          <div className="modelo-integrado-copy">
            <p className="editorial-section-eyebrow">El enfoque en consulta</p>
            <h2 id="modelo-adaptacion-title">El proceso se adapta a lo que necesitas</h2>
            <p className="modelo-integrado-lead">
              La evaluación y la formulación clínica ayudan a decidir por dónde empezar.
              Esta estructura organiza mi forma de trabajar, pero no es una terapia nueva
              ni un método validado de manera independiente.
            </p>

            <div className="modelo-ambitos">
              <article className="modelo-ambito">
                <p className="captacion-index">PSICOLOGÍA SANITARIA</p>
                <h3>Intervención psicológica</h3>
                <p>
                  Trabajamos las dificultades emocionales y del comportamiento, atendiendo
                  a su repercusión cotidiana y a los cambios que para ti son importantes.
                </p>
                <a href="/psicologia/">Conocer psicología →</a>
              </article>
              <article className="modelo-ambito">
                <p className="captacion-index">NEUROPSICOLOGÍA</p>
                <h3>Evaluación y orientación</h3>
                <p>
                  La historia clínica, las pruebas indicadas y la funcionalidad permiten
                  interpretar el perfil cognitivo y ofrecer recomendaciones individualizadas.
                </p>
                <a href="/evaluacion-neuropsicologica/">Conocer neuropsicología →</a>
              </article>
            </div>

            <div className="modelo-integrado-footer">
              <h3>Recursos entre sesiones, cuando aportan valor</h3>
              <p>
                Puedo compartir materiales y objetivos concretos en
                <a href="/mi-espacio/"> Mi espacio</a>. Se seleccionan para cada caso y
                no sustituyen las sesiones. Las notas clínicas internas no se publican
                automáticamente en el portal.
              </p>
            </div>

            <aside className="modelo-primera-visita" aria-label="Información de la primera visita">
              <div>
                <strong>Primera visita</strong>
                <p>60 minutos · Presencial en Arenys de Mar u online</p>
              </div>
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Solicitar cita</a>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
