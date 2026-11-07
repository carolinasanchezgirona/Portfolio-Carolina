import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "¿TDAH, TEA u otra causa? Orientación para adultos en Arenys de Mar",
  description: "Dificultades de atención, organización o interacción social en adultos: cuándo valorar TDAH, TEA, ansiedad, sueño u otras explicaciones. Orientación clínica en Arenys de Mar.",
  alternates: { canonical: "/orientacion-tdah-tea-adultos/" },
  openGraph: {
    title: "¿TDAH, TEA u otra explicación? | Carolina Sánchez",
    description: "Cómo orientar una primera evaluación clínica cuando hay dudas sobre TDAH, autismo u otras causas en la edad adulta.",
    url: "https://carolinasanchezgirona.com/orientacion-tdah-tea-adultos/",
  },
};
const whatsapp = "https://wa.me/34604974857?text=Hola%2C%20quisiera%20informaci%C3%B3n%20administrativa%20sobre%20una%20primera%20visita.";

export default function OrientacionNeurodesarrolloAdultos() {
  return (
    <main className="editorial-site captacion-page-main">
      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span>Orientación antes de evaluar</p>
          <p className="editorial-eyebrow">Neurodesarrollo en adultos · Primera orientación</p>
          <h1>¿TDAH, autismo u otra explicación?</h1>
          <p className="seo-lead">Hay dificultades de atención, organización, interacción social o regulación emocional que pueden parecerse entre sí. No tienes que identificar por tu cuenta qué diagnóstico las explica antes de pedir una primera valoración.</p>
          <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar primera visita</a><a className="editorial-btn editorial-btn-secondary" href={whatsapp} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
          <p className="captacion-disclaimer">WhatsApp solo para disponibilidad y dudas administrativas. No envíes síntomas, informes ni datos de salud por este medio. No es un canal de urgencias.</p>
        </div>
      </section>
      <div className="editorial-wrap">
        <article className="seo-copy">
          <section>
            <p className="editorial-section-eyebrow">Situar bien la pregunta</p>
            <h2>Problemas parecidos pueden tener causas distintas</h2>
            <p>Las etiquetas diagnósticas no se asignan a partir de un rasgo aislado ni de un cuestionario de internet. La evaluación considera la historia desde la infancia, la persistencia y el contexto de las dificultades, el funcionamiento cotidiano y la posibilidad de que coexistan varias condiciones.</p>
            <div className="captacion-grid">
              <div className="captacion-card"><span className="captacion-index">01 / ATENCIÓN Y AUTORREGULACIÓN</span><h3>¿Podría ser TDAH?</h3><p>Dificultades persistentes de atención, organización, inhibición o gestión del tiempo, con repercusión en distintos contextos y antecedentes compatibles con una trayectoria evolutiva.</p><a href="/evaluacion-tdah-adultos/">Cómo evalúo el TDAH adulto →</a></div>
              <div className="captacion-card"><span className="captacion-index">02 / NEURODESARROLLO SOCIAL</span><h3>¿Podría ser TEA?</h3><p>Una historia de diferencias en comunicación e interacción social, patrones de intereses o conductas repetitivas y aspectos sensoriales, interpretada en su contexto evolutivo.</p><a href="/evaluacion-tea-adultos/">Cómo evalúo el TEA adulto →</a></div>
              <div className="captacion-card"><span className="captacion-index">03 / OTRAS HIPÓTESIS</span><h3>¿Y si no es ninguno?</h3><p>Ansiedad, depresión, problemas de sueño, trauma, sobrecarga, dolor, medicación o condiciones médicas pueden explicar o intensificar síntomas similares. También pueden coexistir con TDAH o TEA.</p><a href="/psicologia/">Conocer la atención psicológica →</a></div>
            </div>
          </section>
          <section>
            <h2>¿Cómo se decide qué evaluación tiene sentido?</h2>
            <ol>
              <li><strong>Entrevista y antecedentes.</strong> Motivo de consulta, evolución, historia del desarrollo, contexto emocional, funcionamiento académico, laboral y cotidiano.</li>
              <li><strong>Hipótesis y diagnóstico diferencial.</strong> Se valora si procede estudiar TDAH, TEA, ambas condiciones u otras explicaciones, evitando pruebas innecesarias.</li>
              <li><strong>Valoración ajustada.</strong> Selección de entrevistas, instrumentos e información complementaria según la pregunta clínica. Una prueba neuropsicológica por sí sola no diagnostica TDAH ni TEA.</li>
              <li><strong>Devolución y siguientes pasos.</strong> Explicación de hallazgos y límites de la evaluación, recomendaciones y, cuando corresponda, derivación o coordinación con otros profesionales.</li>
            </ol>
          </section>
          <section className="captacion-feature">
            <p className="editorial-section-eyebrow">Cuando el caso lo necesita</p>
            <h2>Coordinación con otros profesionales, no una valoración aislada</h2>
            <p>Si el motivo de consulta requiere valorar tratamiento farmacológico, diagnósticos médicos, síntomas neurológicos o condiciones que podrían afectar al rendimiento cognitivo, puede ser conveniente la coordinación con medicina de familia, psiquiatría, neurología u otros profesionales implicados.</p>
            <p>La coordinación se plantea de manera individualizada, con información pertinente, consentimiento y respeto a la confidencialidad. No implica que todos los casos requieran derivación ni que exista un equipo médico propio integrado en la consulta.</p>
          </section>
          <section>
            <h2>Antes de reservar</h2>
            <p>Si tienes informes anteriores, puedes traerlos a la primera visita. No es necesario enviarlos por WhatsApp ni describir datos sensibles para solicitar información sobre la reserva. Si no sabes por qué servicio empezar, la primera sesión puede servir para aclarar la indicación clínica.</p>
            <div className="captacion-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Ver disponibilidad y reservar</a><a className="editorial-btn editorial-btn-secondary" href={whatsapp} target="_blank" rel="noopener noreferrer">Pregunta administrativa por WhatsApp</a></div>
          </section>
        </article>
      </div>
    </main>
  );
}
