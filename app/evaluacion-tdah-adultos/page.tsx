import type { Metadata } from "next";
import Image from "next/image";
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
      "Evaluación de TDAH adulto en Arenys de Mar: dos modalidades con precio cerrado, informe y devolución. Orientación profesional para elegir la adecuada.",
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
    title: "Evaluación diagnóstica del TDAH",
    price: 450,
    time: "Orientativamente, 2–3 sesiones · Precio cerrado",
    description:
      "Una evaluación clínica completa para determinar si las dificultades cumplen criterios de TDAH, valorar otras posibles explicaciones y obtener conclusiones diagnósticas fundamentadas.",
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
      "Incorpora la evaluación diagnóstica y una exploración más extensa del funcionamiento cognitivo cuando existe una indicación clínica concreta.",
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
    question: "¿Cómo sé qué modalidad necesito?",
    answer:
      "No tienes que decidirlo por tu cuenta. Antes de iniciar el proceso te orientaré sobre qué evaluación se ajusta mejor a tu motivo de consulta. Ambas son completas para su finalidad: la ampliada añade una exploración cognitiva más detallada cuando está clínicamente indicada.",
  },
  {
    question: "¿Puedo ampliar la evaluación si resulta necesario?",
    answer: "Sí. Si durante el proceso se identifica una indicación clínica para ampliar la exploración, podrás pasar de la modalidad diagnóstica a la neuropsicológica ampliada abonando únicamente la diferencia de 150 €, siempre que sea el mismo proceso y pueda aprovecharse la evaluación realizada. Lo acordaremos contigo antes de aplicar pruebas adicionales.",
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
    question: "¿Qué resultados obtendré de la evaluación?",
    answer:
      "Recibirás un informe clínico con los resultados, conclusiones y recomendaciones individualizadas. Valoraremos si las dificultades cumplen criterios de TDAH o responden a otros factores. Si la información no permite una conclusión definitiva, se explicará por qué y cuáles serían los siguientes pasos.",
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
        <div className="editorial-wrap tdah-hero-grid"><div className="tdah-hero-copy">
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
            <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20evaluacion%20TDAH%20adulto">Solicitar valoración de TDAH</a>
            <a className="editorial-btn editorial-btn-secondary" href="#modalidades">Ver modalidades y precios</a>
          </div>
          <p className="tdah-hero-note">Atención presencial en Arenys de Mar · Psicóloga General Sanitaria y Neuropsicóloga · COPC 24892</p>
          </div>
          <figure className="tdah-hero-photo"><Image src="/carolina-sanchez-sobre-mi.webp" alt="Carolina Sánchez Girona, psicóloga y neuropsicóloga" width={540} height={810} sizes="(max-width: 720px) 230px, 280px" priority /></figure>
        </div>
      </section>

      <div className="editorial-wrap tdah-main">
        <article className="seo-copy">
          <section className="tdah-method-grid">
            <div>
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
            </div>
            <div className="tdah-method-aside"><span className="tdah-method-number">ORIENTACIÓN CLÍNICA</span><h3>No tienes que decidir la modalidad por tu cuenta</h3><p>Valoraremos tu motivo de consulta y te orientaré sobre qué evaluación puede aportar la información que necesitas.</p></div>
          </section>

          <section id="modalidades">
            <h2>Modalidades y precios</h2>
            <p>
              Ambas modalidades ofrecen una evaluación completa para su finalidad. No necesitas elegir por tu cuenta:
              te orientaré sobre cuál se ajusta mejor a tu motivo de consulta antes de iniciar el proceso.
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

                </article>
              ))}
            </div>
            <div className="tdah-choice">
              <div>
                <h3>¿No sabes cuál necesitas?</h3>
                <p>La modalidad se acuerda contigo según la indicación clínica. Si procede ampliar la valoración dentro del mismo proceso, solo abonarás la diferencia de <strong>150 €</strong>, antes de realizar pruebas adicionales.</p>
              </div>
              <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20evaluacion%20TDAH%20adulto">Solicitar valoración</a>
            </div>
            <p className="tdah-price-summary"><strong>Precio cerrado, todo incluido.</strong> Sesiones de evaluación, pruebas, interpretación clínica, informe escrito y devolución. Los tratamientos posteriores se contratan por separado.</p>
          </section>

          <section>
            <h2>Cómo se realiza la valoración</h2>
            <div className="tdah-steps">
              <div><span>01</span><h3>Entrevista</h3><p>Motivo de consulta, antecedentes y evolución desde la infancia.</p></div>
              <div><span>02</span><h3>Exploración</h3><p>Entrevistas e instrumentos según la necesidad clínica.</p></div>
              <div><span>03</span><h3>Integración</h3><p>Análisis de resultados y diagnóstico diferencial.</p></div>
              <div><span>04</span><h3>Devolución</h3><p>Informe escrito, explicación y recomendaciones.</p></div>
            </div>
          </section>

          <section className="tdah-document-section">
            <div className="tdah-download">
              <figure className="tdah-download-photo"><Image src="/consulta-carolina-sanchez-despacho.webp" alt="Consulta de Carolina Sánchez en Arenys de Mar" width={1448} height={1086} sizes="(max-width: 720px) 100vw, 190px" loading="lazy" /></figure>
              <div className="tdah-download-text">
                <h3>Información sobre el proceso de evaluación</h3>
                <p>Modalidades, procedimiento, precios y condiciones de contratación.</p>
              </div>
              <a className="editorial-btn editorial-btn-secondary" href="/informacion-evaluacion-tdah-adultos.pdf" download="Informacion_evaluacion_TDAH_adultos.pdf" type="application/pdf">Descargar PDF</a>
            </div>
          </section>

          <section>
            <h2>Preguntas frecuentes</h2>
            <div className="tdah-faq">
              {faq.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

      </div>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div>
            <p className="editorial-section-eyebrow">Atención individualizada</p>
            <h2>Comprender antes de concluir</h2>
          </div>
          <div className="seo-authority-copy">
            <p>El objetivo es responder a la pregunta clínica con rigor y traducir las conclusiones en información útil para la vida diaria, la intervención psicológica o, cuando corresponda, la coordinación con otros profesionales sanitarios.</p>
            <div className="seo-authority-links"><a href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20evaluacion%20TDAH%20adulto">Solicitar valoración de TDAH →</a></div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
