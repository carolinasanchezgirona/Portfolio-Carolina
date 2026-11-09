import PrintLegal from "./print-legal";
import "../legal.css";

type Kind = "psychological" | "neuropsychological";
const VERSION = "2026-11-09";

const details = {
  psychological: {
    title: "Consentimiento informado para atención psicológica",
    lead: "Evaluación clínica inicial e intervención psicológica sanitaria individualizada.",
    procedures: [
      "Entrevistas clínicas, recogida de antecedentes relevantes y, cuando proceda, cuestionarios o instrumentos de evaluación.",
      "Formulación del caso y propuesta de objetivos y plan de intervención, revisables de forma conjunta.",
      "Intervenciones psicológicas seleccionadas según la indicación clínica, su evidencia disponible y las preferencias de la persona atendida.",
      "Seguimiento de los cambios, revisión de objetivos y, cuando corresponda, coordinación o derivación motivada a otros recursos.",
    ],
    effects: "Al abordar experiencias y emociones difíciles pueden aparecer malestar temporal, cansancio o cambios en la percepción de los problemas. La respuesta al tratamiento es variable; no se garantizan resultados específicos.",
    scope: "Acepto iniciar el proceso de evaluación e intervención psicológica descrito, con posibilidad de solicitar aclaraciones y reconsiderar procedimientos concretos.",
  },
  neuropsychological: {
    title: "Consentimiento informado para atención neuropsicológica",
    lead: "Evaluación del funcionamiento cognitivo y/o intervención neuropsicológica, según la indicación clínica acordada.",
    procedures: [
      "Entrevista clínica y funcional, revisión de antecedentes e informes aportados voluntariamente.",
      "Administración y corrección de pruebas estandarizadas o tareas clínicas de memoria, atención, lenguaje, funciones ejecutivas y otros dominios pertinentes.",
      "Integración de los hallazgos con el contexto, los factores emocionales, la escolaridad y las limitaciones de las pruebas; devolución de resultados y recomendaciones.",
      "Cuando proceda, planificación de rehabilitación, estimulación, estrategias compensatorias, psicoeducación y seguimiento.",
    ],
    effects: "Las pruebas pueden producir fatiga, frustración o malestar transitorio. Los resultados dependen de múltiples factores y no determinan por sí solos un diagnóstico, capacidad jurídica o grado de discapacidad. La intervención no garantiza recuperación cognitiva.",
    scope: "Señalamos el alcance concreto autorizado para este proceso:",
  },
} as const;

export default function ClinicalConsentTemplate({ kind }: { kind: Kind }) {
  const doc = details[kind];
  return <main className="legal-page clinical-consent-page" lang="es">
    <header className="legal-wrap legal-header">
      <a className="legal-brand" href="/"><strong>Carolina Sánchez</strong><span>Psicóloga · Neuropsicóloga</span></a>
      <a className="legal-back" href="/consentimientos/">Todos los consentimientos</a>
    </header>
    <section className="legal-hero"><div className="legal-wrap">
      <p className="legal-eyebrow">Carolina Sánchez Girona · Consentimiento clínico</p>
      <h1>{doc.title}</h1>
      <p>Versión {VERSION}. Modelo para información, revisión y firma presencial. No se firma ni se envía automáticamente desde esta página.</p>
      <PrintLegal />
    </div></section>
    <article className="legal-wrap legal-document">
      <section>
        <h2>Datos de identificación</h2>
        <div className="legal-data legal-consent-fields">
          <p>Nombre y apellidos: __________________________________</p>
          <p>Fecha de nacimiento: _________________________________</p>
          <p>DNI/NIE (si procede): __________________________________</p>
          <p>Fecha y lugar: _______________________________________</p>
          <p>Representante legal (si procede): _______________________</p>
          <p>Relación y acreditación de representación: ________________</p>
        </div>
        <p><strong>Profesional responsable:</strong> Carolina Sánchez Girona, Psicóloga General Sanitaria y neuropsicóloga, COPC 24892.</p>
      </section>
      <section>
        <h2>1. Finalidad y alcance</h2>
        <p>{doc.lead} La información y los procedimientos se adaptarán al motivo de consulta, a la situación clínica y a las necesidades de la persona atendida. Antes de iniciar actuaciones diferentes o que requieran información específica, se explicarán y acordarán por separado.</p>
      </section>
      <section>
        <h2>2. Procedimientos previstos</h2>
        <ul>{doc.procedures.map(item => <li key={item}>{item}</li>)}</ul>
        <p>La periodicidad, duración y modalidades de atención se acordarán según las necesidades clínicas. La propuesta puede modificarse con la evolución del proceso.</p>
      </section>
      <section>
        <h2>3. Beneficios, alternativas y limitaciones</h2>
        <p>Se persigue comprender las dificultades, identificar recursos preservados y orientar decisiones clínicas o estrategias para mejorar el funcionamiento y la calidad de vida. Como alternativas pueden valorarse otras intervenciones, derivación, una evaluación distinta o no iniciar el procedimiento propuesto, con sus posibles consecuencias.</p>
        <p>{doc.effects}</p>
      </section>
      <section>
        <h2>4. Confidencialidad y comunicación de información</h2>
        <p>La información clínica está sujeta a secreto profesional y a las excepciones establecidas por la legislación aplicable. La comunicación de informes a familiares, centros educativos, empleadores u otros destinatarios requiere valorar una habilitación jurídica suficiente y, cuando sea preciso, una autorización específica; este documento no constituye una autorización general de cesión de información.</p>
        <p>Las grabaciones de audio o vídeo, el uso de imágenes, la difusión de testimonios y la utilización de datos identificables para docencia o investigación no están autorizados mediante este documento y requerirían información y habilitación independientes.</p>
      </section>
      <section>
        <h2>5. Modalidad presencial y telemática</h2>
        <p>Cuando se acuerden sesiones online, se informará del canal utilizado y de sus limitaciones de privacidad y funcionamiento. Cada parte procurará un espacio que preserve la confidencialidad. No se grabarán sesiones por defecto. Si una prueba no puede administrarse con garantías suficientes a distancia, se propondrá una alternativa adecuada.</p>
      </section>
      <section>
        <h2>6. Información sobre datos personales</h2>
        <p>La responsable del tratamiento es Carolina Sánchez Girona. Los datos necesarios para la prestación sanitaria y la historia clínica se tratan conforme a las bases jurídicas aplicables, incluidos los arts. 6.1.b/6.1.c y 9.2.h del RGPD. <strong>Este consentimiento clínico no es un consentimiento RGPD para el tratamiento asistencial</strong>. Los derechos, plazos de conservación, proveedores y destinatarios figuran en la <a href="/privacidad/">política de privacidad</a>, disponible también en consulta.</p>
      </section>
      <section>
        <h2>7. Derecho a decidir y retirar el consentimiento</h2>
        <p>La persona atendida puede formular preguntas, rechazar procedimientos concretos o retirar su consentimiento para la actuación sanitaria. Se explicarán las consecuencias clínicas de cada decisión, sin perjuicio de las obligaciones legales de conservación de la historia clínica. En menores o personas que precisen apoyos para decidir se aplicará la normativa de capacidad, representación y participación en la decisión; la firma de un representante se verificará cuando corresponda.</p>
      </section>
      <section className="legal-signature-section">
        <h2>8. Declaración de consentimiento</h2>
        <p>Declaro que he recibido información suficiente sobre el objeto, los procedimientos, los beneficios posibles, los riesgos y las alternativas, que he podido plantear preguntas y que mi decisión es libre.</p>
        <p>{doc.scope}</p>
        {kind === "neuropsychological" && <div className="legal-choices"><p>☐ Evaluación neuropsicológica</p><p>☐ Intervención o seguimiento neuropsicológico</p><p>☐ Ambas actuaciones, según el plan acordado</p></div>}
        <div className="legal-choices"><p>☐ Presto mi consentimiento clínico para el alcance indicado.</p></div>
        <div className="legal-signature-grid">
          <div><strong>Paciente o representante acreditado</strong><p>Nombre: ______________________________</p><p>Firma: ________________________________</p><p>Fecha: _______________________________</p></div>
          <div><strong>Profesional que informa</strong><p>Carolina Sánchez Girona</p><p>Firma: ________________________________</p><p>Fecha: _______________________________</p></div>
        </div>
        <p className="legal-consent-note">Una copia del documento firmado podrá archivarse en la historia clínica. Marcar una casilla en papel o consultar esta página no acredita por sí solo la obtención del consentimiento.</p>
      </section>
    </article>
    <footer className="legal-footer"><div className="legal-wrap"><a href="/consentimientos/">Volver a los documentos</a> · <a href="/privacidad/">Protección de datos</a><p>© 2026 Carolina Sánchez Girona</p></div></footer>
  </main>;
}
