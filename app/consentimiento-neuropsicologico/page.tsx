import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Consentimiento informado neuropsicológico | Carolina Sánchez Girona",
  description: "Consentimiento informado para intervención neuropsicológica en Dememoria.",
};

export default function NeuropsychologicalConsentPage() {
  return (
    <main className="legal-page" lang="es">
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
          <h1>Consentimiento informado para intervención neuropsicológica</h1>
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
            <p><strong>Centro:</strong> Dememoria – Neuropsicología y Rehabilitación Neuropsicológica</p>
          </div>
        </section>

        <section>
          <h2>1. Introducción</h2>
          <p>Este documento tiene como objetivo proporcionar información clara y detallada sobre la intervención neuropsicológica que se llevará a cabo en Dememoria. La firma de este consentimiento indica que el paciente ha comprendido la información y acepta voluntariamente el tratamiento propuesto.</p>
        </section>

        <section>
          <h2>2. Objetivo de la intervención</h2>
          <p>El tratamiento neuropsicológico tiene como finalidad:</p>
          <ul>
            <li>Evaluar, diagnosticar y/o rehabilitar alteraciones cognitivas, emocionales y conductuales derivadas de daño cerebral, deterioro cognitivo u otras condiciones neurológicas.</li>
            <li>Mejorar o compensar dificultades en funciones cognitivas como memoria, atención, lenguaje y funciones ejecutivas.</li>
            <li>Favorecer la autonomía en la vida diaria a través de estrategias adaptadas.</li>
            <li>Proporcionar apoyo emocional y psicoeducación al paciente y su familia.</li>
          </ul>
        </section>

        <section>
          <h2>3. Naturaleza del tratamiento y procedimientos</h2>
          <p>La intervención neuropsicológica incluirá:</p>
          <h3>Evaluación neuropsicológica inicial</h3>
          <ul>
            <li>Entrevista clínica detallada con el paciente y, si es necesario, con familiares.</li>
            <li>Aplicación de pruebas estandarizadas para evaluar las funciones cognitivas, emocionales y conductuales.</li>
            <li>Análisis de resultados para diseñar un plan de intervención individualizado.</li>
          </ul>
          <h3>Intervención neuropsicológica</h3>
          <ul>
            <li>Rehabilitación cognitiva: Ejercicios dirigidos a mejorar funciones cognitivas afectadas.</li>
            <li>Estimulación cognitiva: Técnicas para mantener y potenciar el rendimiento cognitivo.</li>
            <li>Entrenamiento en estrategias compensatorias: Enseñanza de técnicas para minimizar el impacto de los déficits en la vida diaria.</li>
            <li>Psicoeducación: Información y orientación para el paciente y su entorno sobre su condición.</li>
            <li>Apoyo emocional y psicológico: Gestión del impacto emocional derivado de los déficits cognitivos.</li>
          </ul>
          <h3>Seguimiento y ajuste del tratamiento</h3>
          <ul>
            <li>Revisión periódica de la evolución del paciente.</li>
            <li>Modificación del plan de intervención si es necesario.</li>
            <li>Informe final con recomendaciones para la vida diaria.</li>
          </ul>
          <p>Las sesiones podrán ser presenciales y/o telemáticas, según las necesidades del paciente.</p>
        </section>

        <section>
          <h2>4. Beneficios esperados</h2>
          <p>Los beneficios potenciales incluyen:</p>
          <ul>
            <li>Mejora en el rendimiento cognitivo y funcional.</li>
            <li>Mayor independencia en actividades diarias.</li>
            <li>Desarrollo de estrategias para compensar déficits cognitivos.</li>
            <li>Reducción del impacto emocional de las dificultades cognitivas.</li>
            <li>Mejora en la calidad de vida del paciente y su entorno.</li>
          </ul>
        </section>

        <section>
          <h2>5. Riesgos y limitaciones</h2>
          <p>Si bien la intervención neuropsicológica puede ser beneficiosa, existen algunas consideraciones:</p>
          <ul>
            <li>No se garantiza una recuperación total de las funciones cognitivas afectadas.</li>
            <li>La intervención puede generar frustración o fatiga en algunos momentos.</li>
            <li>La efectividad del tratamiento depende del compromiso y la continuidad del paciente.</li>
            <li>En algunos casos, se podrá recomendar la derivación a otros profesionales de la salud.</li>
          </ul>
        </section>

        <section>
          <h2>6. Confidencialidad y protección de datos</h2>
          <ul>
            <li>Toda la información obtenida durante el proceso es confidencial y se protege según la Ley de Protección de Datos vigente en España (LOPDGDD y RGPD).</li>
            <li>Los datos solo podrán compartirse con terceros (otros profesionales de la salud) con el consentimiento expreso del paciente, excepto en situaciones de riesgo para la vida del paciente o terceros, o cuando lo requiera la ley.</li>
            <li>Las sesiones no podrán ser grabadas sin el consentimiento explícito de ambas partes.</li>
          </ul>
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
          <p>Declaro haber leído y comprendido la información contenida en este documento. Se me han explicado los objetivos, beneficios, riesgos y limitaciones de la intervención neuropsicológica. He tenido la oportunidad de formular preguntas y todas han sido respondidas satisfactoriamente.</p>
          <p>Autorizo voluntariamente a Dememoria y al profesional responsable a llevar a cabo la intervención neuropsicológica descrita.</p>
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
