import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Consentimiento informado psicológico | Carolina Sánchez Girona",
  description: "Consentimiento informado para intervención psicológica en Dememoria.",
};

export default function PsychologicalConsentPage() {
  return (
    <main className="legal-page">
      <header className="legal-wrap legal-header">
        <a className="legal-brand" href="/">
          <strong>Carolina Sánchez</strong>
          <span>Psicóloga · Neuropsicóloga</span>
        </a>
        <a className="legal-back" href="/cita/">Volver a la cita</a>
      </header>

      <section className="legal-hero">
        <div className="legal-wrap">
          <p className="legal-eyebrow">Dememoria · Consentimiento informado</p>
          <h1>Consentimiento informado para intervención psicológica</h1>
        </div>
      </section>

      <article className="legal-wrap legal-document">
        <section>
          <div className="legal-data">
            <p><strong>Nombre del paciente:</strong> __________________________</p>
            <p><strong>Fecha de nacimiento:</strong> __________________________</p>
            <p><strong>DNI/NIE:</strong> __________________________</p>
            <p><strong>Dirección:</strong> __________________________</p>
            <p><strong>Teléfono de contacto:</strong> __________________________</p>
            <p><strong>Correo electrónico:</strong> __________________________</p>
            <p><strong>Fecha de la firma:</strong> __________________________</p>
            <p><strong>Nombre del profesional:</strong> Carolina Sánchez Girona</p>
            <p><strong>Centro:</strong> Dememoria – Neuropsicología y Psicología</p>
          </div>
        </section>

        <section>
          <h2>1. Introducción</h2>
          <p>Este documento tiene como objetivo proporcionar información clara y detallada sobre la intervención psicológica que se llevará a cabo en Dememoria. La firma de este consentimiento indica que el paciente ha comprendido la información y acepta voluntariamente el tratamiento propuesto.</p>
        </section>

        <section>
          <h2>2. Objetivo de la intervención</h2>
          <p>El tratamiento psicológico tiene como finalidad:</p>
          <ul>
            <li>Brindar apoyo psicológico para mejorar el bienestar emocional y la calidad de vida.</li>
            <li>Identificar y abordar dificultades emocionales, cognitivas y conductuales.</li>
            <li>Proporcionar estrategias para el manejo del estrés, ansiedad, depresión, duelo u otras dificultades psicológicas.</li>
            <li>Facilitar herramientas para mejorar la autoestima, las habilidades sociales y la regulación emocional.</li>
            <li>Acompañar en procesos de cambio y adaptación a nuevas situaciones vitales.</li>
          </ul>
        </section>

        <section>
          <h2>3. Naturaleza del tratamiento y procedimientos</h2>
          <p>La intervención psicológica incluirá:</p>
          <ul>
            <li>Evaluación inicial: Entrevistas y cuestionarios para comprender la situación del paciente.</li>
            <li>Terapia psicológica: Sesiones individuales con técnicas basadas en evidencia científica (ej. terapia cognitivo-conductual, terapia de aceptación y compromiso, etc.).</li>
            <li>Estrategias de afrontamiento: Técnicas para mejorar la gestión emocional y la toma de decisiones.</li>
            <li>Seguimiento y ajuste del tratamiento según la evolución del paciente.</li>
            <li>Sesiones presenciales y/o telemáticas, según disponibilidad y necesidades.</li>
          </ul>
          <p>La duración del tratamiento dependerá de la problemática del paciente y la valoración del profesional.</p>
        </section>

        <section>
          <h2>4. Beneficios esperados</h2>
          <p>Los beneficios potenciales incluyen:</p>
          <ul>
            <li>Reducción del malestar emocional.</li>
            <li>Mejora en la capacidad para afrontar situaciones difíciles.</li>
            <li>Aumento de la autoestima y autoconfianza.</li>
            <li>Desarrollo de estrategias para gestionar emociones y pensamientos.</li>
            <li>Mejora en las relaciones interpersonales.</li>
          </ul>
        </section>

        <section>
          <h2>5. Riesgos y limitaciones</h2>
          <p>Si bien la intervención psicológica puede ser beneficiosa, existen algunas consideraciones:</p>
          <ul>
            <li>Los cambios pueden requerir tiempo y esfuerzo.</li>
            <li>Algunas sesiones pueden generar malestar emocional temporal al abordar experiencias difíciles.</li>
            <li>La terapia no garantiza resultados específicos, ya que el éxito depende de múltiples factores.</li>
            <li>En casos graves, puede recomendarse la derivación a otro profesional o tratamiento complementario.</li>
          </ul>
        </section>

        <section>
          <h2>6. Confidencialidad y protección de datos</h2>
          <p>Toda la información obtenida durante la terapia es confidencial y se protege según la Ley de Protección de Datos vigente en España (LOPDGDD y RGPD).</p>
          <p>Los datos solo podrán compartirse con terceros (otros profesionales de la salud) con el consentimiento expreso del paciente, excepto en situaciones de riesgo para la vida del paciente o terceros, o cuando lo requiera la ley.</p>
          <p>Las sesiones no podrán ser grabadas sin el consentimiento explícito de ambas partes.</p>
        </section>

        <section>
          <h2>7. Derechos y responsabilidades del paciente</h2>
          <h3>Derechos</h3>
          <ul>
            <li>Recibir información clara y comprensible sobre el tratamiento.</li>
            <li>Expresar dudas y preguntas en cualquier momento.</li>
            <li>Modificar o retirar su consentimiento en cualquier momento sin justificación.</li>
            <li>Acceder a sus datos personales y solicitar su eliminación según la normativa vigente.</li>
          </ul>
          <h3>Responsabilidades</h3>
          <ul>
            <li>Asistir con puntualidad a las sesiones programadas.</li>
            <li>Informar sobre cambios en su estado de salud o medicación que puedan afectar el tratamiento.</li>
            <li>Seguir las recomendaciones terapéuticas para optimizar los resultados.</li>
          </ul>
        </section>

        <section>
          <h2>8. Consentimiento</h2>
          <p>Declaro haber leído y comprendido la información contenida en este documento. Se me han explicado los objetivos, beneficios, riesgos y limitaciones de la intervención psicológica. He tenido la oportunidad de formular preguntas y todas han sido respondidas satisfactoriamente.</p>
          <p>Autorizo voluntariamente a Dememoria y al profesional responsable a llevar a cabo la intervención psicológica descrita.</p>
          <p><strong>Firma del paciente o representante legal</strong></p>
          <p>Firma: __________________________</p>
          <p>Fecha: __________________________</p>
          <p><strong>Firma del profesional responsable</strong></p>
          <p>Firma: __________________________</p>
          <p>Fecha: __________________________</p>
        </section>
      </article>

      <footer className="legal-footer">
        <div className="legal-wrap">© 2026 Carolina Sánchez Girona · Dememoria</div>
      </footer>
    </main>
  );
}
