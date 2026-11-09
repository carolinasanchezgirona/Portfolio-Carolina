import type { Metadata } from "next";
import "../seo-pages.css";
import "../evaluacion-tdah-adultos/tdah.css";

const path = "/evaluacion-dislexia/";
const url = `https://carolinasanchezgirona.com${path}`;
const title = "Evaluación de dislexia en adultos";
const description = "Valoración presencial de dislexia en adultos en Arenys de Mar. Evaluación de la lectura y la escritura con informe, devolución y recomendaciones individualizadas.";
const photo = "/images/evaluacion-dislexia.webp";
const photoAlt = "Persona adulta leyendo un libro y tomando notas en una mesa";
const booking = "/cita/#neuropsicologia";

export const metadata: Metadata = {
  title: `${title} en Arenys de Mar`,
  description,
  alternates: { canonical: path },
  openGraph: {
    title: `${title} | Carolina Sánchez`,
    description,
    url,
    type: "website",
    images: [{ url: photo, alt: photoAlt, width: 1050, height: 700 }],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: title,
  description,
  serviceType: "Evaluación neuropsicológica de la dislexia",
  provider: { "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  url,
};

const steps = [
  { title: "Entrevista clínica", detail: "Historia escolar, aprendizaje de la lectura y la escritura, lenguas de uso y dificultades actuales." },
  { title: "Pruebas de lectura y escritura", detail: "Exploración de la precisión y la fluidez lectora y de la ortografía, con pruebas adecuadas al perfil de la persona." },
  { title: "Integración clínica", detail: "Interpretación de las pruebas junto con la historia y el impacto en la vida diaria. Se consideran otras dificultades si procede." },
  { title: "Informe y devolución", detail: "Explicación de los resultados, conclusiones clínicas y recomendaciones para los estudios, el trabajo o el día a día." },
];

const faqs = [
  {
    question: "¿Puedo hacer la evaluación si nunca me valoraron de pequeña o pequeño?",
    answer: "Sí. En la entrevista revisaremos cómo aprendiste a leer y escribir, qué dificultades recuerdas y cuáles persisten hoy. Si conservas informes escolares o evaluaciones previas, puedes traerlos a la visita.",
  },
  {
    question: "¿Se tiene en cuenta si uso catalán y castellano?",
    answer: "Sí. La interpretación tiene en cuenta en qué lenguas aprendiste a leer y escribir, cuáles utilizas actualmente y qué referencias normativas están disponibles para las pruebas seleccionadas.",
  },
  {
    question: "¿El informe puede servir para solicitar adaptaciones?",
    answer: "El informe puede documentar las dificultades y orientar posibles apoyos. Cada centro, universidad u organismo establece los requisitos para solicitar adaptaciones. Si tienes un trámite concreto, puedes traer esos requisitos a la primera visita.",
  },
  {
    question: "¿Cuánto cuesta la evaluación completa?",
    answer: "El presupuesto de la evaluación completa se comunica antes de iniciar las pruebas, una vez acordado el alcance de la valoración.",
  },
];

export default function DyslexiaAssessmentPage() {
  return (
    <main className="editorial-site tdah-page">
      <section className="seo-hero">
        <div className="editorial-wrap tdah-hero-grid">
          <div className="tdah-hero-copy">
            <p className="seo-breadcrumbs">
              <a href="/">Inicio</a><span>·</span>
              <a href="/neuropsicologia/">Neuropsicología</a><span>·</span>
              <span>Dislexia en adultos</span>
            </p>
            <p className="editorial-eyebrow">Neuropsicología clínica · Arenys de Mar, Maresme</p>
            <h1>{title}</h1>
            <p className="seo-lead">
              Si leer te lleva más tiempo del que esperas o escribir sin faltas te exige mucho esfuerzo desde la etapa escolar, una valoración puede ayudarte a entender esas dificultades y a identificar qué apoyos te servirían hoy.
            </p>
            <div className="seo-actions">
              <a className="editorial-btn editorial-btn-primary" href={booking}>Pedir primera visita</a>
              <a className="editorial-btn editorial-btn-secondary" href="#proceso">Cómo es la evaluación</a>
            </div>
            <p className="tdah-hero-note">Evaluación presencial en Arenys de Mar · Psicóloga General Sanitaria y Neuropsicóloga · COPC 24892</p>
          </div>
          <figure className="tdah-hero-photo">
            <img src={photo} alt={photoAlt} width="1050" height="700" fetchPriority="high" decoding="async" />
          </figure>
        </div>
      </section>

      <div className="editorial-wrap tdah-main">
        <article className="seo-copy">
          <section className="tdah-method-grid">
            <div>
              <h2>Cuándo puede ayudarte una valoración</h2>
              <p>En la edad adulta, las dificultades de lectura y escritura pueden hacerse más evidentes al retomar los estudios, preparar una oposición o asumir un trabajo con más exigencias de lectura.</p>
              <ul>
                <li>Lees despacio, te cuesta leer en voz alta o tropiezas con palabras poco familiares.</li>
                <li>Las faltas de ortografía persisten y necesitas dedicar mucho tiempo a revisar lo que escribes.</li>
                <li>Estas dificultades vienen de la etapa escolar y todavía afectan a tus estudios, al trabajo o a tareas cotidianas.</li>
              </ul>
            </div>
            <div className="tdah-method-aside">
              <span className="tdah-method-number">ORIENTACIÓN CLÍNICA</span>
              <h3>La historia de aprendizaje ayuda a interpretar los resultados</h3>
              <p>La valoración reúne lo que ha ocurrido desde la infancia, el rendimiento actual en las pruebas y cómo repercuten las dificultades en tu vida.</p>
            </div>
          </section>

          <section id="proceso">
            <h2>Cómo es la evaluación</h2>
            <div className="tdah-steps">
              {steps.map(({ title, detail }, index) => (
                <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{detail}</p></div>
              ))}
            </div>
          </section>

          <section>
            <h2>Preguntas frecuentes</h2>
            <div className="tdah-faq">
              {faqs.map(({ question, answer }) => (
                <details key={question}><summary>{question}</summary><p>{answer}</p></details>
              ))}
            </div>
          </section>
        </article>
      </div>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div><p className="editorial-section-eyebrow">Consulta en Arenys de Mar</p><h2>Tu primera visita</h2></div>
          <div className="seo-authority-copy">
            <p>En la primera visita revisaremos tu motivo de consulta y qué preguntas te gustaría resolver con la valoración.</p>
            <div className="seo-authority-links"><a href={booking}>Consultar disponibilidad →</a></div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
