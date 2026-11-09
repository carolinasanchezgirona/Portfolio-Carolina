import type { Metadata } from "next";
import "../seo-pages.css";
import "./neuropsychology-visual.css";

export const metadata: Metadata = {
  title: "Neuropsicóloga en Arenys de Mar y Maresme",
  description:
    "Neuropsicóloga en Arenys de Mar (Maresme). Evaluación de memoria, atención y deterioro cognitivo, seguimiento de demencias y orientación a familiares.",
  alternates: { canonical: "/neuropsicologia/" },
  twitter: { card: "summary", title: "Neuropsicóloga en Arenys de Mar y Maresme | Carolina Sánchez", description: "Neuropsicóloga en Arenys de Mar (Maresme). Evaluación de memoria, atención y deterioro cognitivo, seguimiento de demencias y orientación a familiares." },
  openGraph: {
    title: "Neuropsicóloga en Arenys de Mar y Maresme | Carolina Sánchez",
    description:
      "Neuropsicóloga en Arenys de Mar (Maresme). Evaluación de memoria, atención y deterioro cognitivo, seguimiento de demencias y orientación a familiares.",
    url: "https://carolinasanchezgirona.com/neuropsicologia/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Neuropsicología",
  provider: {
    "@id": "https://carolinasanchezgirona.com/#carolina-sanchez-girona",
  },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
  serviceType: "Evaluación e intervención neuropsicológica",
  url: "https://carolinasanchezgirona.com/neuropsicologia/",
};

export default function NeuropsychologyPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="/psicologa-arenys-de-mar/">Arenys de Mar</a>
          <a href="/psicologia/">Psicología</a>
          <a className="nav-cta" href="/cita/">Pedir cita</a>
        </nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner service-hero-grid"><div className="service-hero-copy">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Neuropsicología</span></p>
          <p className="editorial-eyebrow">Evaluación e intervención neuropsicológica</p>
          <h1>Neuropsicología en Arenys de Mar</h1>
          <p className="seo-lead">
            Evaluación del funcionamiento cognitivo y acompañamiento neuropsicológico cuando existen cambios o dificultades en memoria, atención, lenguaje, funciones ejecutivas o autonomía cotidiana.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a>
          </div>
        </div><figure className="service-hero-visual"><img src="/images/neuropsicologia-hero.webp" alt="Material de evaluación neuropsicológica en una consulta: modelo cerebral y pruebas cognitivas" width="720" height="850" loading="eager" decoding="async" /></figure></div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section className="neuro-illustrated neuro-illustrated-right">
            <h2>¿Qué evalúa la neuropsicología?</h2>
            <figure className="neuro-section-photo"><img src="/images/neuro-evaluacion.webp" alt="Ejemplo ilustrativo de una evaluación cognitiva con ejercicios de lápiz y papel" width="706" height="718" loading="lazy" decoding="async" /></figure>
            <p>
              La neuropsicología estudia cómo funcionan procesos cognitivos como la memoria, la atención, el lenguaje, la planificación, la velocidad de procesamiento o la regulación de la conducta, y cómo ese funcionamiento se relaciona con la vida cotidiana de la persona.
            </p>
            <p>
              Una evaluación no consiste únicamente en obtener puntuaciones. El objetivo es integrar entrevista clínica, historia, observación, pruebas estandarizadas y funcionamiento diario para construir un perfil cognitivo que sea clínicamente útil. <a href="/evaluacion-neuropsicologica/">Ver cómo se realiza una evaluación neuropsicológica.</a>
            </p>
          </section>

          <section id="cuando-consultar" className="neuro-consult-section">
            <h2>Cuándo puede ser útil una valoración neuropsicológica</h2>
            <ul className="neuro-reasons-grid">
              <li>Olvidos o cambios de memoria que generan preocupación.</li>
              <li>Dificultades para mantener la atención o seguir tareas complejas, incluido el estudio clínico del <a href="/evaluacion-tdah-adultos/">TDAH en adultos</a> cuando corresponda.</li>
              <li>Consulta sobre posibles características del espectro autista en la edad adulta: <a href="/evaluacion-tea-adultos/">evaluación del TEA en adultos</a>.</li>
              <li>Dificultades persistentes de lectura y escritura desde la etapa escolar: <a href="/evaluacion-dislexia/">evaluación de dislexia en adultos</a>.</li>
              <li>Problemas de lenguaje, planificación u organización.</li>
              <li>Cambios cognitivos asociados al envejecimiento o a una enfermedad neurológica.</li>
              <li>Dudas sobre deterioro cognitivo o evolución de una demencia.</li>
              <li>Necesidad de seguimiento para comparar cambios a lo largo del tiempo.</li>
            </ul>
            <p>
              No toda queja cognitiva implica una enfermedad neurodegenerativa. El sueño, el estado de ánimo, la ansiedad, el dolor, la medicación, el estrés y otros factores médicos también pueden influir en el rendimiento. Por eso es importante interpretar los resultados dentro del contexto completo de la persona. Si la preocupación principal son los olvidos, puedes consultar <a href="/problemas-de-memoria/">problemas de memoria</a>.
            </p>
          </section>


          <section className="captacion-feature" aria-labelledby="neuro-utilidad-clinica">
            <p className="editorial-section-eyebrow">Más allá de las puntuaciones</p>
            <h2 id="neuro-utilidad-clinica">¿En qué situaciones aporta valor una evaluación?</h2>
            <div className="captacion-grid two">
              <div className="captacion-card"><h3>Cuando hay una duda clínica concreta</h3><p>Por ejemplo, distinguir dificultades atencionales relacionadas con el estado emocional de un patrón más persistente, caracterizar cambios de memoria o estudiar sus posibles causas junto al seguimiento médico.</p></div>
              <div className="captacion-card"><h3>Cuando el funcionamiento diario ha cambiado</h3><p>Ayuda a describir el impacto en la autonomía, la organización, el trabajo o la vida familiar, y a identificar capacidades preservadas, apoyos y estrategias útiles.</p></div>
              <div className="captacion-card"><h3>Cuando es necesario establecer un punto de partida</h3><p>Permite comparar resultados en revisiones posteriores, interpretar la evolución y orientar decisiones clínicas o funcionales.</p></div>
              <div className="captacion-card"><h3>Cuando se necesita un informe fundamentado</h3><p>La integración de entrevista, pruebas estandarizadas y contexto funcional permite elaborar conclusiones con sus límites e indicaciones.</p></div>
            </div>
            <p>Si las dudas giran en torno a características del <a href="/evaluacion-tdah-adultos/">TDAH</a>, el <a href="/evaluacion-tea-adultos/">TEA</a> o condiciones que pueden parecerse, consulta la <a href="/orientacion-tdah-tea-adultos/">orientación previa para adultos</a>.</p>
          </section>
          <section className="neuro-illustrated neuro-illustrated-left">
            <h2>Cómo es una evaluación neuropsicológica</h2>
            <figure className="neuro-section-photo"><img src="/images/neuro-entrevista.webp" alt="Escena ilustrativa de entrevista clínica entre profesional y paciente" width="706" height="718" loading="lazy" decoding="async" /></figure>
            <h3>1. Entrevista clínica</h3>
            <p>
              Se revisa el motivo de consulta, la evolución de los cambios, antecedentes médicos y neurológicos, medicación, funcionamiento diario y cualquier información relevante. Cuando es útil y la persona lo autoriza, puede incorporarse información de familiares o cuidadores.
            </p>
            <h3>2. Exploración cognitiva</h3>
            <p>
              Se seleccionan pruebas estandarizadas según la pregunta clínica. No todas las evaluaciones requieren exactamente los mismos instrumentos: el protocolo se adapta al objetivo, la edad, los antecedentes y las dificultades observadas.
            </p>
            <h3>3. Integración e interpretación</h3>
            <p>
              Los resultados se interpretan junto con la historia y el funcionamiento cotidiano. La finalidad es diferenciar capacidades preservadas, áreas de dificultad y posibles factores que estén influyendo en el rendimiento.
            </p>
            <h3>4. Devolución y recomendaciones</h3>
            <p>
              Se explican los resultados de forma comprensible y se plantean recomendaciones. Según el caso, puede ser conveniente seguimiento, intervención cognitiva, estrategias compensatorias, coordinación con otros profesionales o nueva valoración en el futuro.
            </p>
          </section>

          <section>
            <h2>Cambios cognitivos en enfermedades neurológicas</h2>
            <p>
              La neuropsicología también puede ser útil cuando aparecen cambios cognitivos asociados a enfermedades neurológicas o médicas, por ejemplo en esclerosis múltiple, epilepsia o COVID persistente. En estos casos pueden verse afectadas la atención, la velocidad de procesamiento, la memoria, las funciones ejecutivas o la tolerancia a la fatiga.
            </p>
            <p>
              La interpretación debe considerar siempre el contexto clínico completo: evolución, medicación, sueño, dolor, fatiga y estado emocional pueden influir de forma importante en el rendimiento. La evaluación neuropsicológica complementa el seguimiento médico y ayuda a objetivar qué dificultades están presentes y cómo repercuten en la vida diaria.
            </p>
          </section>

          <section className="neuro-illustrated neuro-illustrated-right">
            <h2>Deterioro cognitivo y demencias</h2>
            <figure className="neuro-section-photo"><img src="/images/neuro-familia.webp" alt="Dos generaciones de mujeres conversan en un entorno familiar, imagen ilustrativa del acompañamiento" width="706" height="718" loading="lazy" decoding="async" /></figure>
            <p>
              En personas mayores, la valoración neuropsicológica puede ayudar a distinguir entre cambios esperables asociados a la edad, dificultades relacionadas con factores emocionales o médicos y patrones que requieren una exploración más profunda.
            </p>
            <p>
              Ante cambios cognitivos, la valoración permite caracterizar las dificultades, estimar su repercusión funcional y orientar la necesidad de seguimiento médico o apoyos específicos. <a href="/evaluacion-neuropsicologica/">Más información sobre la evaluación neuropsicológica.</a> Para el entorno cercano, puedes consultar también la <a href="/familiares-y-cuidadores-de-personas-con-demencia/">atención a familiares y cuidadores de personas con demencia</a>.
            </p>
          </section>


          <section className="captacion-feature" aria-labelledby="neuro-coordinacion">
            <p className="editorial-section-eyebrow">Atención ajustada a cada caso</p>
            <h2 id="neuro-coordinacion">Coordinación interdisciplinar cuando está indicada</h2>
            <p>La evaluación neuropsicológica complementa, pero no sustituye, la valoración médica. Ante sospecha de enfermedad neurológica, necesidad de revisar tratamientos o cuestiones psiquiátricas que requieran seguimiento específico, puedo recomendar la valoración por medicina de familia, neurología o psiquiatría, y coordinar información clínica pertinente con los profesionales implicados.</p>
            <p>Estas actuaciones se plantean según la necesidad clínica y con el consentimiento correspondiente. No supone que todos los casos requieran derivación ni que estos profesionales formen parte de la plantilla de la consulta.</p>
          </section>
          <section>
            <h2>Qué traer a la primera visita</h2>
            <p>
              Si dispones de informes de neurología, psiquiatría, psicología, geriatría u otras especialidades, resultados de pruebas, informes hospitalarios o información sobre tratamientos actuales, puedes traerlos a la sesión. Esa documentación puede ayudar a reconstruir la evolución clínica y evitar repetir información innecesariamente.
            </p>
            <p>
              No es necesario enviarla previamente a través del formulario de reserva. La primera visita permite valorar qué documentación es realmente relevante para el proceso.
            </p>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card">
            <h2>Consulta de neuropsicología</h2>
            <ul className="seo-facts">
              <li><span>Primera sesión</span><strong>60 minutos</strong></li>
              <li><span>Tarifa sesión</span><strong>75 €</strong></li>
              <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
              <li><span>Área</span><strong>Maresme</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a>
            <p className="seo-local-note">La sesión de neuropsicología dura 60 minutos y cuesta 75 €. Las evaluaciones completas que requieran varias sesiones, pruebas específicas o informe se presupuestan aparte.</p>
          </div>
          <div className="seo-card">
            <h3>Áreas relacionadas</h3>
            <div className="seo-related">
              <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
              <a href="/evaluacion-tdah-adultos/">Evaluación del TDAH en adultos</a>
              <a href="/evaluacion-tea-adultos/">Evaluación del TEA en adultos</a>
              <a href="/evaluacion-dislexia/">Evaluación de dislexia en adultos</a>
              <a href="/evaluacion-neuropsicologica/">Evaluación de memoria y funcionamiento cognitivo</a>
              <a href="/evaluacion-altas-capacidades-adultos/">Altas capacidades en adultos</a>
              <a href="/problemas-de-memoria/">Problemas de memoria y olvidos</a>
              
              <a href="/demencias/">Demencias y Alzheimer</a>
              <a href="/estimulacion-cognitiva/">Estimulación cognitiva</a>
              <a href="/familiares-y-cuidadores-de-personas-con-demencia/">Familiares y cuidadores</a>
                            <a href="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral adquirido</a>
              <a href="/parkinson-y-cambios-cognitivos/">Parkinson y cambios cognitivos</a>
              <a href="/rehabilitacion-neuropsicologica/">Rehabilitación neuropsicológica</a>
                            <a href="/alzheimer-primeros-sintomas-y-evaluacion/">Alzheimer: primeros síntomas y evaluación</a>
              <a href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
              <a href="/psicologa-maresme/">Atención neuropsicológica en el Maresme</a>
              <a href="/psicologia/">Psicología General Sanitaria</a>
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
              Mi experiencia profesional abarca la evaluación neuropsicológica en adultos y personas mayores, el trabajo en consulta, residencias y centros de día y el abordaje del deterioro cognitivo y las demencias. Integro historia clínica, pruebas estandarizadas, repercusión funcional y seguimiento para emitir conclusiones clínicamente útiles. Soy Psicóloga General Sanitaria, colegiada COPC 24892 y autora de publicaciones de divulgación profesional en PsiAra.
            </p>
            <div className="seo-authority-links">
              <a href="/sobre-mi/">Trayectoria y referencias profesionales →</a>
              <a href="https://psiara.cat/2026/08/05/la-capacitat-per-testar-en-el-dret-civil-catala-des-duna-perspectiva-neuropsicologica/" target="_blank" rel="noopener noreferrer">Leer publicación en PsiAra sobre capacidad y evaluación neuropsicológica ↗</a>
              <a href="https://www.linkedin.com/in/carolina-s%C3%A1nchez-girona-43b3b94a/" target="_blank" rel="noopener noreferrer">Perfil profesional en LinkedIn ↗</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="editorial-footer">
        <div className="editorial-wrap editorial-footer-inner">
          <div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Consulta de Psicología Sanitaria y Neuropsicología</p></div>
          <div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div>
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
