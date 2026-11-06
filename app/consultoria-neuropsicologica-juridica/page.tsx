import type { Metadata } from "next";
import "../seo-pages.css";
import "./consultoria.css";

const url = "https://carolinasanchezgirona.com/consultoria-neuropsicologica-juridica/";

export const metadata: Metadata = {
  title: "Consultoría neuropsicológica en Barcelona y Maresme",
  description: "Consultoría neuropsicológica para particulares, psicólogos y profesionales: evaluación en el ámbito jurídico y revisión técnica preliminar de casos.",
  alternates: { canonical: "/consultoria-neuropsicologica-juridica/" },
  openGraph: {
    title: "Consultoría neuropsicológica | Carolina Sánchez",
    description: "Valoraciones cognitivas y funcionales e informes técnicos para profesionales jurídicos y particulares.",
    url,
    type: "website",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Consultoría neuropsicológica",
  serviceType: "Evaluación neuropsicológica en el ámbito jurídico y consultoría técnica para profesionales",
  provider: { "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "Cataluña"],
  url,
};

const areas = [
  { title: "Medidas judiciales de apoyo", description: "Análisis del funcionamiento cognitivo y de las necesidades de apoyo para el ejercicio de la capacidad jurídica, considerando la voluntad y preferencias de la persona." },
  { title: "Deterioro cognitivo y demencias", description: "Evaluación de memoria, lenguaje, atención y funciones ejecutivas ante enfermedad de Alzheimer, otras demencias o sospecha de trastorno neurocognitivo." },
  { title: "Autonomía y toma de decisiones", description: "Exploración de comprensión, razonamiento y comunicación de decisiones en contextos concretos, con atención a los apoyos y factores que pueden influir en el rendimiento." },
  { title: "Informes neuropsicológicos", description: "Documentos técnicos que integran entrevista, antecedentes, pruebas estandarizadas, información funcional y limitaciones de la evaluación." },
  { title: "Asesoramiento a profesionales jurídicos", description: "Identificación de preguntas clínicas relevantes, revisión documental y orientación sobre la utilidad y el alcance de posibles valoraciones neuropsicológicas." },
];

const steps = [
  { title: "Análisis de la demanda", description: "Delimitamos las preguntas técnicas y comprobamos la viabilidad del encargo." },
  { title: "Revisión documental", description: "Estudiamos la información clínica y los antecedentes pertinentes y disponibles." },
  { title: "Evaluación individualizada", description: "Seleccionamos entrevistas, pruebas y medidas funcionales según el motivo de valoración y las características de la persona." },
  { title: "Integración e informe", description: "Contrastamos hallazgos, factores de confusión y límites de interpretación antes de emitir conclusiones y recomendaciones." },
];

export default function ConsultoriaNeuropsicologicaJuridicaPage() {
  return (
    <main className="editorial-site consultoria-page">
      <section className="seo-hero consultoria-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Consultoría neuropsicológica</span></p>
          <div className="consultoria-hero-grid">
            <div className="consultoria-hero-copy">
              <p className="editorial-eyebrow">Neuropsicología clínica · Asesoramiento técnico</p>
              <h1>Consultoría neuropsicológica</h1>
              <p className="seo-lead">Valoraciones neuropsicológicas en el ámbito jurídico y revisión técnica especializada de casos para particulares y profesionales.</p>
              <div className="seo-actions">
                <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Consulta%20sobre%20valoraci%C3%B3n%20neuropsicol%C3%B3gica%20jur%C3%ADdica">Solicitar información</a>
                <a className="editorial-btn editorial-btn-secondary" href="#servicios">Ver servicios</a>
                <a className="consultoria-text-link" href="/tarifas-consultoria-neuropsicologica.pdf" download>Descargar tarifas (PDF)</a>
              </div>
            </div>
            <figure className="consultoria-hero-photo">
              <img src="https://images.unsplash.com/photo-1758691463198-dc663b8a64e4?auto=format&fit=crop&w=1100&q=85" alt="Consulta clínica presencial con una profesional y una paciente conversando" width="880" height="924" loading="eager" decoding="async" />
            </figure>
          </div>
        </div>
      </section>
      <section id="servicios" className="consultoria-services">
        <div className="editorial-wrap">
          <div className="consultoria-services-intro">
            <div>
              <p className="consultoria-section-kicker">SERVICIOS</p>
              <h2>Dos formas de acompañar cada caso</h2>
            </div>
            <p>Un servicio ajustado a lo que necesitas: una valoración neuropsicológica en el ámbito jurídico o una segunda revisión técnica para orientar decisiones profesionales.</p>
          </div>
          <div className="consultoria-service-grid">
            <article className="consultoria-service-card">
              <div className="consultoria-service-top"><span>01</span><span>PARTICULARES Y FAMILIAS</span></div>
              <h3>Valoración neuropsicológica en el ámbito jurídico</h3>
              <p>Exploración del funcionamiento cognitivo y de su repercusión en situaciones concretas con implicaciones jurídicas.</p>
              <ul>
                <li>Entrevista y revisión de antecedentes</li>
                <li>Evaluación cognitiva y funcional individualizada</li>
                <li>Conclusiones e informe técnico o pericial, según el encargo</li>
              </ul>
              <a href="mailto:contact@carolinasanchezgirona.com?subject=Valoraci%C3%B3n%20neuropsicol%C3%B3gica%20jur%C3%ADdica">Consultar una valoración <span aria-hidden="true">→</span></a>
            </article>
            <article className="consultoria-service-card">
              <div className="consultoria-service-top"><span>02</span><span>PSICÓLOGOS Y OTROS PROFESIONALES</span></div>
              <h3>Consultoría neuropsicológica preliminar</h3>
              <p>Revisión especializada de documentación para identificar indicadores relevantes y orientar los siguientes pasos del caso.</p>
              <ul>
                <li>Análisis documental y coherencia clínica</li>
                <li>Valoración funcional y viabilidad pericial preliminar</li>
                <li>Documento escrito de conclusiones (1–2 páginas)</li>
              </ul>
              <a href="mailto:contact@carolinasanchezgirona.com?subject=Consultor%C3%ADa%20para%20profesionales">Solicitar consultoría <span aria-hidden="true">→</span></a>
            </article>
          </div>
          <div className="consultoria-service-footer">
            <span>La revisión preliminar no equivale a una evaluación directa ni a un informe pericial judicial.</span>
            <a href="/tarifas-consultoria-neuropsicologica.pdf" download>Consultar tarifas y condiciones (PDF) <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>Valoración rigurosa para preguntas concretas</h2>
            <p>Los cambios en memoria, juicio, lenguaje o funciones ejecutivas pueden tener repercusiones distintas según la situación personal y las decisiones implicadas. Una evaluación neuropsicológica rigurosa ayuda a describir capacidades preservadas, dificultades y su impacto funcional, sin reducir a la persona a un diagnóstico o una puntuación.</p>
            <p>El servicio se dirige a despachos de abogados, otros profesionales jurídicos, familias y particulares. Cada encargo se delimita de manera individual, respetando la independencia técnica, la confidencialidad y los derechos de la persona evaluada.</p>
          </section>
          <section id="ambitos" className="consultoria-section">
            <div className="consultoria-section-heading">
              <p className="consultoria-section-kicker">ÁREAS DE ESPECIALIZACIÓN</p>
              <h2>Ámbitos de actuación</h2>
              <p>Un análisis individualizado de las capacidades cognitivas y funcionales, según las cuestiones concretas del encargo.</p>
            </div>
            <div className="consultoria-areas-grid">
              {areas.map((area, index) => (
                <div className="consultoria-area-card" key={area.title}>
                  <span className="consultoria-area-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              ))}
            </div>
          </section>
          <section id="proceso" className="consultoria-section">
            <div className="consultoria-section-heading">
              <p className="consultoria-section-kicker">METODOLOGÍA</p>
              <h2>Cómo se desarrolla el trabajo</h2>
              <p>Un proceso estructurado, con criterios clínicos explícitos y conclusiones ajustadas a los datos disponibles.</p>
            </div>
            <ol className="consultoria-process-list">
              {steps.map((step, index) => (
                <li className="consultoria-process-step" key={step.title}>
                  <span className="consultoria-process-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
            <p className="consultoria-process-note">Cuando resulte pertinente, puede realizarse una explicación técnica del informe a quien haya contratado el servicio, dentro del alcance acordado y con las garantías de confidencialidad aplicables.</p>
          </section>
          <section>
            <h2>Rigor, independencia y límites de la evaluación</h2>
            <p>Las conclusiones dependen de la evidencia efectivamente examinada y de la calidad de los datos disponibles. Se consideran las condiciones sensoriales, emocionales y médicas, el nivel educativo y los posibles factores de confusión. Si una cuestión no puede resolverse con suficiente fundamento, se hará constar expresamente.</p>
            <div className="seo-callout">
              <strong>El diagnóstico no determina por sí solo la capacidad jurídica.</strong>
              <span>La neuropsicología aporta evidencia clínica sobre funcionamiento y apoyos. Las decisiones jurídicas corresponden a los órganos competentes.</span>
            </div>
          </section>
          <section>
            <h2>Tarifas y condiciones del servicio</h2>
            <p>Las tarifas se presentan en un documento descargable, con apartados diferenciados para particulares y profesionales. Los presupuestos de las evaluaciones jurídicas dependen del objeto del encargo, la complejidad y las actuaciones necesarias.</p>
            <p>La consultoría preliminar para profesionales se abona por adelantado. El plazo orientativo de entrega es de 3 a 5 días hábiles desde la recepción completa de la documentación. La información inicial puede solicitarse sin remitir documentación clínica sensible por correo electrónico; se acordará un canal adecuado cuando proceda.</p>
            <div className="seo-actions consultoria-prices-action"><a className="editorial-btn editorial-btn-primary" href="/tarifas-consultoria-neuropsicologica.pdf" download>Descargar tarifas (PDF)</a></div>
          </section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Consultoría especializada</h2>
            <ul className="seo-facts">
              <li><span>Dirigido a</span><strong>Particulares y profesionales</strong></li>
              <li><span>Especialidad</span><strong>Neuropsicología clínica</strong></li>
              <li><span>Ámbito</span><strong>Barcelona y Maresme</strong></li>
              <li><span>Tarifas</span><strong>Disponibles en PDF</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Consultor%C3%ADa%20neuropsicol%C3%B3gica%20jur%C3%ADdica">Consultar el caso</a>
            <a className="editorial-btn editorial-btn-secondary" href="/tarifas-consultoria-neuropsicologica.pdf" download>Descargar tarifas (PDF)</a>
            <p className="seo-local-note">Atención presencial en Arenys de Mar y asesoramiento online cuando sea clínicamente apropiado.</p>
          </div>
          <div className="seo-card">
            <h3>Servicios relacionados</h3>
            <div className="seo-related">
              <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
              <a href="/neuropsicologia/">Neuropsicología</a>
              <a href="/sobre-mi/">Trayectoria profesional</a>
            </div>
          </div>
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
