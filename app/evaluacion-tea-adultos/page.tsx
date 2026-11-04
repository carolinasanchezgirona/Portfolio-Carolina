import type { Metadata } from "next";
import "../seo-pages.css";
import "../evaluacion-tdah-adultos/tdah.css";
import "./tea.css";

const baseUrl = "https://carolinasanchezgirona.com/evaluacion-tea-adultos/";

export const metadata: Metadata = {
  title: "Evaluación del TEA en adultos en Arenys de Mar | Carolina Sánchez",
  description: "Evaluación clínica del autismo (TEA) en adultos en Arenys de Mar: modalidad diagnóstica 550 € y neuropsicológica ampliada 750 €, con informe y devolución.",
  alternates: { canonical: "/evaluacion-tea-adultos/" },
  openGraph: {
    title: "Evaluación del autismo (TEA) en adultos | Carolina Sánchez",
    description: "Dos modalidades de evaluación clínica del TEA adulto, con precio cerrado, informe y devolución.",
    url: baseUrl,
    type: "website",
  },
};

const modalities = [
  {
    title: "Evaluación clínica diagnóstica del TEA",
    price: 550,
    time: "Orientativamente, 3–4 sesiones · Precio cerrado",
    description: "Exploración clínica integral para determinar si la trayectoria evolutiva y el funcionamiento actual son compatibles con los criterios diagnósticos del espectro autista, considerando otras explicaciones posibles.",
    features: [
      "Entrevista clínica, historia del neurodesarrollo y antecedentes desde la infancia.",
      "Exploración de comunicación e interacción social, patrones repetitivos, intereses y perfil sensorial.",
      "Observación clínica, información contextual y cuestionarios complementarios cuando resulten pertinentes.",
      "Análisis del impacto funcional, diagnóstico diferencial y condiciones concurrentes.",
      "Informe clínico escrito, sesión de devolución y recomendaciones individualizadas.",
    ],
  },
  {
    title: "Evaluación neuropsicológica ampliada",
    price: 750,
    time: "Orientativamente, 4–5 sesiones · Precio cerrado",
    description: "Incluye la evaluación diagnóstica y una exploración individualizada de funciones cognitivas y funcionamiento adaptativo cuando existe una pregunta clínica que justifica ampliar el estudio.",
    features: [
      "Todo el proceso de evaluación clínica diagnóstica.",
      "Exploración selectiva de atención, memoria, funciones ejecutivas y/o cognición social según indicación.",
      "Evaluación ampliada del funcionamiento adaptativo cuando sea pertinente.",
      "Integración del perfil neuropsicológico con la historia clínica y las dificultades cotidianas.",
      "Informe ampliado, devolución y recomendaciones específicas.",
    ],
  },
];

const faq = [
  {
    question: "¿Es necesario realizar el ADOS-2 para diagnosticar autismo en adultos?",
    answer: "No siempre. La evaluación diagnóstica se fundamenta en la historia del neurodesarrollo, la entrevista clínica, la observación, el funcionamiento cotidiano y el diagnóstico diferencial. En estas modalidades no se administra ADOS-2. Si una situación requiere una valoración observacional estandarizada adicional, se explicará y se orientará hacia una ampliación o derivación específica.",
  },
  {
    question: "¿Qué diferencia hay entre la modalidad diagnóstica y la ampliada?",
    answer: "La modalidad diagnóstica estudia el TEA y su diagnóstico diferencial. La ampliada añade una exploración neuropsicológica individualizada cuando es útil para describir el perfil cognitivo, las dificultades asociadas y las necesidades de apoyo. La modalidad ampliada no garantiza mayor certeza diagnóstica del TEA.",
  },
  {
    question: "¿Cómo sé qué evaluación necesito?",
    answer: "No tienes que decidirlo por tu cuenta. Antes de iniciar el proceso valoraremos el motivo de consulta y la indicación clínica para recomendar una modalidad.",
  },
  {
    question: "¿Puedo ampliar la evaluación después?",
    answer: "Sí. Si surge una indicación clínica durante el mismo proceso, puedes ampliar de la modalidad diagnóstica a la neuropsicológica abonando la diferencia de 200 €, siempre que se aproveche el trabajo realizado. Se acordará antes de administrar pruebas adicionales.",
  },
  {
    question: "¿Qué ocurre si no tengo informes de la infancia?",
    answer: "La ausencia de documentación escolar o familiar no impide solicitar una valoración. Se reconstruirá la historia evolutiva con las fuentes disponibles y se explicarán las limitaciones diagnósticas si no se dispone de información suficiente.",
  },
  {
    question: "¿Se puede diagnosticar autismo por cuestionarios?",
    answer: "No. Los cuestionarios pueden complementar la exploración, pero sus resultados no establecen por sí solos un diagnóstico. Es necesaria una integración clínica y una evaluación diferencial rigurosa.",
  },
  {
    question: "¿Incluye un informe escrito?",
    answer: "Sí. Ambas modalidades incluyen informe, devolución y recomendaciones. Si la información disponible no permite una conclusión definitiva, el informe señalará la incertidumbre y los pasos de evaluación recomendados.",
  },
  {
    question: "¿Las sesiones se cobran aparte?",
    answer: "No. Los precios publicados incluyen las sesiones de evaluación acordadas, pruebas, interpretación, informe y devolución. Los tratamientos posteriores se contratan por separado.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Evaluación clínica y neuropsicológica del TEA en adultos",
  description: "Evaluación del espectro autista en adultos mediante entrevista clínica, historia del desarrollo, observación y diagnóstico diferencial. Dos modalidades con informe y devolución.",
  provider: { "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  url: baseUrl,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Modalidades de evaluación de TEA adulto",
    itemListElement: modalities.map((item) => ({
      "@type": "Offer",
      name: item.title,
      price: String(item.price),
      priceCurrency: "EUR",
      url: baseUrl,
    })),
  },
};

export default function AdultAutismAssessmentPage() {
  return (
    <main className="editorial-site tdah-page tea-page">
      <section className="seo-hero">
        <div className="editorial-wrap tdah-hero-grid">
          <div className="tdah-hero-copy">
            <p className="seo-breadcrumbs">
              <a href="/">Inicio</a><span>·</span>
              <a href="/neuropsicologia/">Neuropsicología</a><span>·</span>
              <span>Evaluación de TEA adulto</span>
            </p>
            <p className="editorial-eyebrow">Neuropsicología clínica · Arenys de Mar, Maresme</p>
            <h1>Evaluación del autismo (TEA) en adultos</h1>
            <p className="seo-lead">
              ¿Desde hace años percibes diferencias en tu forma de comunicarte, relacionarte,
              procesar estímulos o adaptarte a determinadas situaciones? Una evaluación clínica
              permite explorar tu trayectoria del neurodesarrollo y comprender tu funcionamiento
              sin dar por hecho ningún diagnóstico.
            </p>
            <div className="seo-actions">
              <a className="editorial-btn editorial-btn-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20evaluacion%20TEA%20adulto">Solicitar valoración de TEA</a>
              <a className="editorial-btn editorial-btn-secondary" href="#modalidades">Ver modalidades y precios</a>
            </div>
            <p className="tdah-hero-note">Atención presencial en Arenys de Mar · Psicóloga General Sanitaria y Neuropsicóloga · COPC 24892</p>
          </div>
          <figure className="tdah-hero-photo tea-hero-photo">
            <img src="https://images.pexels.com/photos/7584238/pexels-photo-7584238.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1200" alt="Persona adulta leyendo junto a una ventana en un entorno tranquilo de trabajo" width="1200" height="800" fetchPriority="high" decoding="async" />
          </figure>
        </div>
      </section>

      <div className="editorial-wrap tdah-main">
        <article className="seo-copy">
          <section className="tdah-method-grid">
            <div>
              <h2>Una evaluación clínica integral, no solo cuestionarios</h2>
              <p>Los rasgos asociados al autismo pueden presentarse de formas diversas en la edad adulta. La valoración examina la comunicación e interacción social, los patrones restringidos o repetitivos, la sensibilidad sensorial, el desarrollo temprano y la repercusión funcional.</p>
              <p>También se consideran otras condiciones, como TDAH, ansiedad social, trauma y dificultades emocionales, que pueden coexistir o requerir un diagnóstico diferencial.</p>
            </div>
            <div className="tdah-method-aside">
              <span className="tdah-method-number">ORIENTACIÓN CLÍNICA</span>
              <h3>No tienes que decidir la modalidad por tu cuenta</h3>
              <p>Se elegirá la opción adecuada a partir del motivo de consulta y la información que sea necesario obtener.</p>
            </div>
          </section>

          <section id="modalidades" className="tea-pricing">
            <h2>Modalidades y precios</h2>
            <p>Ambas modalidades incluyen una evaluación clínica diagnóstica del TEA. La ampliada añade exploración neuropsicológica cuando está justificada, no un diagnóstico más válido por acumular pruebas.</p>
            <div className="tdah-modalities">
              {modalities.map((item) => (
                <article className="tdah-modality" key={item.title}>
                  <div className="tdah-modality-top">
                    <h3>{item.title}</h3>
                    <strong className="tdah-price">{item.price} €</strong>
                  </div>
                  <p className="tdah-time">{item.time}</p>
                  <p>{item.description}</p>
                  <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="tdah-choice">
              <div>
                <h3>¿Necesitas ampliar la valoración?</h3>
                <p>Si resulta clínicamente indicado durante el mismo proceso, podrás pasar a la modalidad ampliada abonando solamente la diferencia de <strong>200 €</strong>, antes de realizar las pruebas adicionales.</p>
              </div>
            </div>
            <p className="tdah-price-summary"><strong>Precios cerrados.</strong> Incluyen sesiones de evaluación, pruebas pertinentes, integración clínica, informe y devolución. El ADOS-2 no está incluido en ninguna modalidad; si se considera indicado, se recomendará una valoración complementaria específica.</p>
          </section>

          <section className="tea-process">
            <h2>Cómo se realiza la valoración</h2>
            <div className="tdah-steps">
              <div><span>01</span><h3>Entrevista</h3><p>Motivo de consulta, antecedentes y trayectoria evolutiva desde la infancia.</p></div>
              <div><span>02</span><h3>Exploración</h3><p>Observación e instrumentos individualizados; información contextual cuando sea posible.</p></div>
              <div><span>03</span><h3>Integración</h3><p>Criterios diagnósticos, funcionamiento y diagnóstico diferencial.</p></div>
              <div><span>04</span><h3>Devolución</h3><p>Informe escrito y recomendaciones ajustadas al caso.</p></div>
            </div>
          </section>

          <section className="tea-questions">
            <h2>Preguntas frecuentes</h2>
            <div className="tdah-faq">
              {faq.map(({ question, answer }) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
            </div>
          </section>
        </article>
      </div>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div><p className="editorial-section-eyebrow">Atención individualizada</p><h2>Comprender antes de concluir</h2></div>
          <div className="seo-authority-copy">
            <p>El objetivo es ofrecer una comprensión clínica fundamentada del funcionamiento de cada persona y orientar decisiones útiles. Cuando no hay evidencia suficiente para una conclusión diagnóstica, se explican los límites y los pasos que se recomiendan.</p>
            <div className="seo-authority-links"><a href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20evaluacion%20TEA%20adulto">Solicitar valoración de TEA →</a></div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
