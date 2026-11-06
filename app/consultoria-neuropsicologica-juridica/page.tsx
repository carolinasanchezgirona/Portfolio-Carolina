import type { Metadata } from "next";
import "../seo-pages.css";

const url = "https://carolinasanchezgirona.com/consultoria-neuropsicologica-juridica/";

export const metadata: Metadata = {
  title: "Consultoría neuropsicológica jurídica en Barcelona y Maresme",
  description: "Evaluación neuropsicológica y asesoramiento técnico para abogados, familias y procedimientos judiciales: deterioro cognitivo, autonomía y necesidades de apoyo.",
  alternates: { canonical: "/consultoria-neuropsicologica-juridica/" },
  openGraph: {
    title: "Consultoría neuropsicológica en el ámbito jurídico | Carolina Sánchez",
    description: "Valoraciones cognitivas y funcionales e informes técnicos para profesionales jurídicos y particulares.",
    url,
    type: "website",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Consultoría neuropsicológica en el ámbito jurídico",
  serviceType: "Evaluación neuropsicológica y asesoramiento técnico para procedimientos judiciales",
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
    <main className="editorial-site">
      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Consultoría neuropsicológica jurídica</span></p>
          <p className="editorial-eyebrow">Neuropsicología clínica · Asesoramiento técnico</p>
          <h1>Consultoría neuropsicológica en el ámbito jurídico</h1>
          <p className="seo-lead">Evaluación especializada del funcionamiento cognitivo, la autonomía y las necesidades de apoyo para aportar información técnica rigurosa en procedimientos judiciales y decisiones jurídicas.</p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Consulta%20sobre%20valoraci%C3%B3n%20neuropsicol%C3%B3gica%20jur%C3%ADdica">Solicitar información y presupuesto</a>
            <a className="editorial-btn editorial-btn-secondary" href="#ambitos">Ámbitos de actuación</a>
          </div>
        </div>
      </section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>Una valoración clínica para preguntas jurídicas concretas</h2>
            <p>Los cambios en memoria, juicio, lenguaje o funciones ejecutivas pueden tener repercusiones distintas según la situación personal y las decisiones implicadas. Una evaluación neuropsicológica rigurosa ayuda a describir capacidades preservadas, dificultades y su impacto funcional, sin reducir a la persona a un diagnóstico o una puntuación.</p>
            <p>El servicio se dirige a despachos de abogados, otros profesionales jurídicos, familias y particulares. Cada encargo se delimita de manera individual, respetando la independencia técnica, la confidencialidad y los derechos de la persona evaluada.</p>
          </section>
          <section id="ambitos">
            <h2>Ámbitos de actuación</h2>
            {areas.map((area) => (
              <div key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </div>
            ))}
          </section>
          <section id="proceso">
            <h2>Cómo se desarrolla el trabajo</h2>
            {steps.map((step, index) => (
              <div key={step.title}>
                <h3>{index + 1}. {step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
            <p>Cuando resulte pertinente, puede realizarse una explicación técnica del informe a quien haya contratado el servicio, dentro del alcance acordado y con las garantías de confidencialidad aplicables.</p>
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
            <h2>Presupuesto adaptado a cada caso</h2>
            <p>El presupuesto se establece tras conocer el objeto del encargo, la documentación existente, la complejidad clínica, las pruebas necesarias y las actuaciones solicitadas. No se aplica automáticamente la tarifa de una visita clínica ordinaria a un trabajo de consultoría jurídica.</p>
            <p>La información inicial puede solicitarse sin remitir documentación clínica sensible por correo electrónico. Se acordará un canal adecuado para su intercambio cuando proceda.</p>
          </section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Consultoría especializada</h2>
            <ul className="seo-facts">
              <li><span>Dirigido a</span><strong>Abogados y particulares</strong></li>
              <li><span>Especialidad</span><strong>Neuropsicología clínica</strong></li>
              <li><span>Ámbito</span><strong>Barcelona y Maresme</strong></li>
              <li><span>Honorarios</span><strong>Presupuesto individual</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Consultor%C3%ADa%20neuropsicol%C3%B3gica%20jur%C3%ADdica">Consultar el caso</a>
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
