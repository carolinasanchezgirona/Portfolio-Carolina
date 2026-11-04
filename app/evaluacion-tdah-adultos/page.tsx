import type { Metadata } from "next";
import "../seo-pages.css";
import "./tdah.css";

const baseUrl = "https://carolinasanchezgirona.com/evaluacion-tdah-adultos/";

export const metadata: Metadata = {
  title: "Evaluación del TDAH en adultos en Arenys de Mar y Maresme",
  description:
    "Evaluación de TDAH adulto en Arenys de Mar. Precio cerrado: 450 € o 600 €, con sesiones de evaluación, informe y devolución incluidos.",
  alternates: { canonical: "/evaluacion-tdah-adultos/" },
  openGraph: {
    title: "Evaluación del TDAH en adultos | Carolina Sánchez",
    description:
      "Valoración diagnóstica individualizada del TDAH adulto en Arenys de Mar: 450 € o 600 € según el alcance de la exploración.",
    url: baseUrl,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Evaluación del TDAH en adultos | Carolina Sánchez",
    description: "Evaluación diagnóstica y neuropsicológica del TDAH adulto en Arenys de Mar.",
  },
};

const modalities = [
  {
    title: "Evaluación diagnóstica del TDAH adulto",
    price: 450,
    time: "Orientativamente, 2–3 sesiones · Precio cerrado",
    description:
      "Para estudiar la posible presencia de TDAH y su repercusión en la vida cotidiana mediante una valoración clínica estructurada.",
    features: [
      "Entrevista clínica, anamnesis e historia evolutiva desde la infancia.",
      "Entrevista diagnóstica estructurada e instrumentos clínicos pertinentes.",
      "Valoración de síntomas, repercusión funcional y diagnóstico diferencial.",
      "Integración clínica, informe escrito con recomendaciones y sesión de devolución.",
    ],
  },
  {
    title: "Evaluación neuropsicológica ampliada",
    price: 600,
    time: "Orientativamente, 3–4 sesiones · Precio cerrado",
    description:
      "Cuando, además de la valoración diagnóstica, está clínicamente justificado estudiar con mayor detalle el funcionamiento cognitivo.",
    features: [
      "Todo el proceso de evaluación diagnóstica estándar.",
      "Exploración cognitiva individualizada, según indicación, de atención, memoria, funciones ejecutivas y otros dominios.",
      "Análisis integrado de resultados y funcionamiento cotidiano.",
      "Informe neuropsicológico ampliado, sesión de devolución y recomendaciones individualizadas.",
    ],
  },
];

const faq = [
  {
    question: "¿Un test de atención confirma el TDAH?",
    answer:
      "No. Ninguna prueba de atención por sí sola confirma o descarta el TDAH. La conclusión se basa en la historia del desarrollo, los síntomas, su repercusión, la información disponible de distintos contextos y el diagnóstico diferencial.",
  },
  {
    question: "¿Necesito la evaluación neuropsicológica ampliada?",
    answer:
      "No necesariamente. Se recomienda solo cuando existe una pregunta clínica concreta que justifica explorar el perfil cognitivo con mayor profundidad.",
  },
  {
    question: "¿Cuántas sesiones necesitaré?",
    answer: "Se prevén orientativamente 2–3 sesiones en la evaluación estándar y 3–4 en la ampliada. La organización se adapta a las necesidades del caso y no supone un número rígido.",
  },
  {
    question: "¿Las sesiones se cobran aparte?",
    answer: "No. Los 450 € o 600 € son precios cerrados que incluyen las sesiones necesarias para completar la evaluación acordada, las pruebas, el informe escrito y la devolución. Los tratamientos o seguimientos posteriores se contratan por separado.",
  },
  {
    question: "¿Puedo tener TDAH aunque nunca me diagnosticaran en la infancia?",
    answer: "Sí. Algunas personas llegan a la edad adulta sin una valoración previa. La evaluación revisa si existían manifestaciones desde etapas tempranas y cómo han evolucionado.",
  },
  {
    question: "¿Necesito aportar informes escolares o información familiar?",
    answer: "No es imprescindible para solicitar la evaluación. Cuando están disponibles, los antecedentes escolares o la información de familiares, con consentimiento, pueden contribuir a reconstruir la trayectoria evolutiva.",
  },
  {
    question: "¿Recibiré un informe por escrito?",
    answer: "Sí. Ambas modalidades incluyen un informe clínico escrito y una sesión de devolución para explicar las conclusiones y recomendaciones.",
  },
  {
    question: "¿Incluye medicación?",
    answer: "No. La evaluación psicológica y neuropsicológica no incluye prescripción farmacológica. Cuando resulte indicado, se orientará hacia valoración médica especializada.",
  },
  {
    question: "¿El informe garantiza un diagnóstico de TDAH?",
    answer:
      "No. El objetivo de la evaluación es obtener una conclusión clínica fundamentada. Puede apoyar un diagnóstico de TDAH, identificar otras condiciones o dejar cuestiones pendientes de aclaración o derivación.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación clínica y neuropsicológica del TDAH en adultos",
  url: baseUrl,
  description:
    "Evaluación de TDAH en adultos con precio cerrado, sesiones clínicas, informe y devolución incluidos. Modalidad diagnóstica y ampliada según indicación.",
  provider: { "@id": "https://carolinasanchezgirona.com/#dememoria" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Modalidades de evaluación",
    itemListElement: modalities.map((item) => ({
      "@type": "Offer",
      name: item.title,
      price: String(item.price),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: baseUrl,
    })),
  },
};

export default function AdultAdhdAssessmentPage() {
  return (
    <main className="editorial-site tdah-page">
      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs">
            <a href="/">Inicio</a><span>·</span>
            <a href="/neuropsicologia/">Neuropsicología</a><span>·</span>
            <span>Evaluación de TDAH adulto</span>
          </p>
          <p className="editorial-eyebrow">Neuropsicología clínica · Arenys de Mar, Maresme</p>
          <h1>Evaluación del TDAH en adultos</h1>
          <p className="seo-lead">
            ¿Te cuesta mantener la atención, organizarte, gestionar el tiempo o terminar lo que empiezas?
            Una valoración clínica permite comprender el origen de estas dificultades, estudiar su evolución desde la infancia
            y valorar su repercusión en tu vida diaria, sin dar por hecho ningún diagnóstico.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20evaluacion%20TDAH%20adulto">Solicitar evaluación de TDAH</a>
            <a className="editorial-btn editorial-btn-secondary" href="#modalidades">Ver modalidades y precios</a>
          </div>
          <p className="tdah-hero-note">Atención presencial en Arenys de Mar · Psicóloga General Sanitaria y Neuropsicóloga · COPC 24892</p>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section>
            <h2>¿Cuándo puede ser recomendable una evaluación?</h2>
            <p>Algunas personas consultan porque las siguientes dificultades interfieren de forma persistente en su día a día:</p>
            <ul>
              <li>Problemas para mantener la atención en tareas o conversaciones.</li>
              <li>Procrastinación y dificultad para iniciar o terminar actividades.</li>
              <li>Olvidos frecuentes, desorganización o pérdida de objetos.</li>
              <li>Dificultades para planificar, priorizar o gestionar el tiempo.</li>
              <li>Sensación de inquietud interna o impulsividad.</li>
              <li>Repercusión en el trabajo, los estudios o las relaciones.</li>
            </ul>
            <p>Estas manifestaciones no implican por sí mismas un TDAH. Lo relevante es estudiar su origen, su historia y su impacto funcional.</p>
          </section>

          <section>
            <h2>Una evaluación clínica, no solo un cuestionario</h2>
            <p>
              Las dificultades de concentración, planificación o autorregulación no son exclusivas del TDAH.
              El sueño, la ansiedad, el estado de ánimo, el estrés, los efectos de la medicación y otras condiciones
              también pueden producir manifestaciones similares o coexistir con el trastorno.
            </p>
            <p>
              Por ello, la valoración integra entrevista clínica, historia evolutiva, información contextual,
              instrumentos apropiados y diagnóstico diferencial. Las pruebas neuropsicológicas se utilizan
              cuando aportan respuesta a una pregunta clínica concreta.
            </p>
          </section>

          <section id="modalidades">
            <h2>Modalidades y precios</h2>
            <p>
              Dos opciones con alcances diferentes. La modalidad se determina en función de la necesidad clínica,
              no de la expectativa de obtener una determinada etiqueta diagnóstica.
            </p>
            <div className="tdah-modalities">
              {modalities.map((item) => (
                <article className="tdah-modality" key={item.title}>
                  <div className="tdah-modality-top">
                    <h3>{item.title}</h3>
                    <strong className="tdah-price">{item.price} €</strong>
                  </div>
                  <p className="tdah-time">{item.time}</p>
                  <p>{item.description}</p>
                  <ul>
                    {item.features.map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <a className="editorial-btn editorial-btn-primary" href={`mailto:contact@carolinasanchezgirona.com?subject=${encodeURIComponent(`Solicitud de evaluación TDAH adulto: ${item.title}`)}`}>Solicitar esta evaluación</a>
                </article>
              ))}
            </div>
            <div className="tdah-included" role="note">
              <h3>Precio cerrado, todo incluido</h3>
              <p>Los 450 € o 600 € incluyen las entrevistas y sesiones de evaluación necesarias para completar el proceso acordado,
                la administración y corrección de instrumentos, la interpretación clínica, el informe escrito y la sesión de devolución.
                <strong> No se cobra cada sesión de evaluación por separado.</strong></p>
              <p>El número indicado de sesiones es orientativo y se adapta al caso. Los seguimientos, tratamientos posteriores
                y valoraciones externas no están incluidos y se informan por separado. El alcance y las condiciones de pago
                se concretan antes de iniciar la evaluación.</p>
              <p>La modalidad ampliada no es necesariamente más precisa para diagnosticar TDAH; se recomienda cuando existe
                una pregunta clínica que justifica explorar el perfil cognitivo con más detalle.</p>
            </div>
          </section>

          <section>
            <h2>Cómo se realiza la valoración</h2>
            <div className="tdah-steps">
              <div><span>01</span><div><h3>Entrevista clínica y evolutiva</h3><p>Motivo de consulta, antecedentes, síntomas actuales y reconstrucción del funcionamiento desde la infancia.</p></div></div>
              <div><span>02</span><div><h3>Exploración estructurada</h3><p>Entrevistas e instrumentos pertinentes, valoración del funcionamiento en distintos ámbitos e información de otras fuentes, cuando sea posible y con consentimiento.</p></div></div>
              <div><span>03</span><div><h3>Diagnóstico diferencial</h3><p>Análisis de síntomas, dificultades coexistentes y otras explicaciones clínicas. Si procede, exploración neuropsicológica complementaria.</p></div></div>
              <div><span>04</span><div><h3>Informe y devolución</h3><p>Integración de la información, explicación de las conclusiones y recomendaciones adaptadas a la situación de la persona.</p></div></div>
            </div>
          </section>

          <section>
            <h2>¿Qué ocurre después de la evaluación?</h2>
            <p>Recibirás conclusiones clínicas y recomendaciones individualizadas, tanto si se identifica un TDAH como si
              las dificultades se explican por otros factores. Según los resultados, puede recomendarse intervención psicológica,
              estrategias de organización y autorregulación, adaptaciones funcionales o valoración por otro profesional sanitario.</p>
            <p>El tratamiento farmacológico, cuando está indicado, requiere valoración y prescripción médica y no está incluido en estas modalidades.</p>
          </section>

          <section>
            <h2>Preguntas frecuentes</h2>
            <div className="tdah-faq">
              {faq.map(({ question, answer }) => (
                <div key={question}>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información y reserva">
          <div className="seo-card">
            <h2>Evaluación de TDAH adulto</h2>
            <ul className="seo-facts">
              <li><span>Diagnóstica</span><strong>450 €</strong></li>
              <li><span>Ampliada</span><strong>600 €</strong></li>
              <li><span>Consulta</span><strong>Arenys de Mar</strong></li>
              <li><span>Precio</span><strong>Todo incluido</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20evaluacion%20TDAH%20adulto">Solicitar evaluación de TDAH</a>
            <p className="seo-local-note">Para consultar qué modalidad se ajusta mejor a tu situación, puedes escribir a <a href="mailto:contact@carolinasanchezgirona.com?subject=Informacion%20evaluacion%20TDAH%20adulto">contact@carolinasanchezgirona.com</a>.</p>
          </div>
          <div className="seo-card">
            <h3>Profesional responsable</h3>
            <p>Carolina Sánchez Girona</p>
            <p>Psicóloga General Sanitaria y Neuropsicóloga</p>
            <p>Colegiada COPC 24892</p>
            <div className="seo-related">
              <a href="/neuropsicologia/">Neuropsicología clínica</a>
              <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
              <a href="/psicologa-arenys-de-mar/">La consulta en Arenys de Mar</a>
            </div>
          </div>
        </aside>
      </div>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div>
            <p className="editorial-section-eyebrow">Atención individualizada</p>
            <h2>Comprender antes de concluir</h2>
          </div>
          <div className="seo-authority-copy">
            <p>El objetivo es responder a la pregunta clínica con rigor y traducir las conclusiones en información útil para la vida diaria, la intervención psicológica o, cuando corresponda, la coordinación con otros profesionales sanitarios.</p>
            <div className="seo-authority-links"><a href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20evaluacion%20TDAH%20adulto">Solicitar evaluación de TDAH →</a></div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
