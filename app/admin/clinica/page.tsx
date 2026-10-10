import Script from "next/script";
import type { Metadata } from "next";
import PatientBulkImport from "./patient-bulk-import";
import NeuroFollowup from "./neuro-followup";
import "./clinica.css";
import "./clinic-navigation.css";

export const metadata: Metadata = {
  title: "Gestión clínica | Carolina Sánchez",
  description: "Aplicación privada para la gestión clínica de Dememoria.",
  robots: { index: false, follow: false, nocache: true },
};

type ClinicIconName = "today" | "agenda" | "patients" | "pending" | "more" | "refresh";
function ClinicIcon({ name }: { name: ClinicIconName }) {
  return <svg className="clinic-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {name === "today" && <><path d="m3 10 9-7 9 7v10H3V10Z" /><path d="M9 21v-8h6v8" /></>}
    {name === "agenda" && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h3" /></>}
    {name === "patients" && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></>}
    {name === "pending" && <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4.5h6M9 11h6M9 15h6M9 19h4" /></>}
    {name === "more" && <path d="M4 6h16M4 12h16M4 18h16" />}
    {name === "refresh" && <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.8 9a7 7 0 0 1 12.4-2L20 12M4 12l1.8 5a7 7 0 0 0 12.4-2" /></>}
  </svg>;
}

export default function AdminClinicaPage() {
  return (
    <main className="clinic-page">
      <section id="clinic-app" className="clinic-app" hidden>
        <header className="clinic-topbar">
          <div className="clinic-topbar-title">
            <span className="clinic-brand-mark" aria-hidden="true">D</span>
            <div>
              <p className="clinic-eyebrow">Dememoria · Área profesional</p>
              <h1>Gestión clínica</h1>
              <p id="clinic-date" className="clinic-muted" />
            </div>
          </div>
          <div className="clinic-top-actions">
            <button id="clinic-refresh" className="clinic-icon-action" type="button" title="Actualizar información" aria-label="Actualizar información"><ClinicIcon name="refresh" /></button>
          </div>
        </header>

        <nav className="clinic-tabs clinic-navigation" aria-label="Navegación principal de gestión clínica">
          <button id="clinic-view-today" className="active" type="button" aria-current="page"><ClinicIcon name="today" /><span className="clinic-nav-label">Hoy</span></button>
          <a className="clinic-nav-link" href="/admin/agenda/"><ClinicIcon name="agenda" /><span className="clinic-nav-label">Agenda</span></a>
          <button id="clinic-view-patients" type="button"><ClinicIcon name="patients" /><span className="clinic-nav-label">Pacientes</span></button>
          <button id="clinic-view-pending" type="button"><ClinicIcon name="pending" /><span className="clinic-nav-label">Pendientes</span><span id="clinic-pending-badge" className="clinic-tab-badge" aria-label="Número de tareas pendientes">0</span></button>
          <details className="clinic-more-menu">
            <summary><ClinicIcon name="more" /><span className="clinic-nav-label">Más</span></summary>
            <div className="clinic-more-panel">
              <p className="clinic-more-heading">Herramientas</p>
              <a className="clinic-more-item" href="/admin/recursos/">Recursos</a>
              <a className="clinic-more-item" href="/admin/preguntas/">Preguntas</a>
              <a className="clinic-more-item" href="/admin/articulos/">Artículos</a>
              <p className="clinic-more-heading">Administración</p>
              <a className="clinic-more-item" href="/admin/economia/">Contabilidad</a>
              <a className="clinic-more-item" href="/admin/notificaciones/">Centro de avisos</a>
              <a className="clinic-more-item" href="/admin/">Panel general</a>
              <div className="clinic-more-install-slot" />
              <button id="clinic-logout" className="clinic-more-item clinic-more-logout" type="button">Cerrar sesión</button>
            </div>
          </details>
        </nav>

        <p id="clinic-status" className="clinic-message" role="status" aria-live="polite" />

        <section id="clinic-today-view" className="clinic-view">
          <div className="clinic-section-heading">
            <div><p className="clinic-eyebrow">Vista rápida</p><h2>Consultas de hoy</h2></div>
            <a className="clinic-primary" href="/admin/agenda/">Nueva cita</a>
          </div>
          <div className="clinic-summary" aria-label="Resumen del día">
            <article><strong id="clinic-total-today">0</strong><span>Citas hoy</span></article>
            <article><strong id="clinic-confirmed-today">0</strong><span>Confirmadas</span></article>
            <article><strong id="clinic-pending-today">0</strong><span>Citas pendientes</span></article>
            <article><strong id="clinic-finished-today">0</strong><span>Realizadas</span></article>
          </div>
          <div id="clinic-today-list" className="clinic-list" />
        </section>

        <section id="clinic-pending-view" className="clinic-view" hidden>
          <div className="clinic-section-heading"><div><p className="clinic-eyebrow">Carga administrativa</p><h2>Tareas pendientes</h2></div></div>
          <div id="clinic-pending-summary" className="clinic-summary" />
          <div id="clinic-pending-list" className="clinic-pending-list" />
        </section>

        <section id="clinic-patients-view" className="clinic-view clinic-patients-workspace" hidden>
          <div className="clinic-page-heading">
            <div>
              <p className="clinic-eyebrow">Dememoria</p>
              <h2>Pacientes</h2>
              <p className="clinic-section-description">Base clínica, búsqueda y acceso a fichas.</p>
            </div>
            <div className="clinic-patients-actions">
              <div className="clinic-search-field">
                <span className="clinic-search-icon" aria-hidden="true">⌕</span>
                <input id="clinic-patient-search" type="search" placeholder="Buscar paciente, correo, teléfono o mutua" autoComplete="off" />
              </div>
              <label className="clinic-archived-toggle"><input id="clinic-show-archived" type="checkbox" /> Mostrar archivados</label>
              <button id="clinic-new-patient" className="clinic-primary" type="button">+ Nuevo paciente</button>
              <PatientBulkImport />
            </div>
          </div>
          <p className="clinic-inline-info">Las fichas usan el número propio de Dememoria. Los datos de agendas externas se conservan sin importar números de historia ajenos.</p>
          <div id="clinic-patient-list" className="clinic-patient-list" />
        </section>
      </section>

      <dialog id="clinic-new-patient-dialog" className="clinic-dialog clinic-small-dialog">
        <form id="clinic-new-patient-form" className="clinic-dialog-content">
          <div className="clinic-dialog-heading">
            <div><p className="clinic-eyebrow">Alta manual</p><h2>Nuevo paciente</h2></div>
            <button id="clinic-new-patient-close" className="clinic-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <div className="clinic-form-grid">
            <label className="clinic-full">Nombre y apellidos
              <input id="clinic-new-patient-name" type="text" autoComplete="name" required />
            </label>
            <label>Teléfono
              <input id="clinic-new-patient-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Opcional" />
            </label>
            <label>Correo
              <input id="clinic-new-patient-email" type="email" autoComplete="email" placeholder="Opcional" />
            </label>
            <label>Tipo de paciente
              <select id="clinic-new-patient-type">
                <option value="new">Nuevo</option>
                <option value="existing">Ya atendido anteriormente</option>
              </select>
            </label>
            <label>Contexto asistencial
              <select id="clinic-new-patient-context">
                <option value="private_practice">Consulta privada</option>
                <option value="combined">Consulta + centro externo</option>
                <option value="creu_blava">Centro externo</option>
              </select>
            </label>
          </div>
          <p className="clinic-note">El número clínico de Dememoria se genera automáticamente. Si el teléfono o correo ya pertenecen a una ficha existente, el sistema te avisará antes de crear otra.</p>
          <p id="clinic-new-patient-message" className="clinic-message" role="status" aria-live="polite" />
          <div className="clinic-dialog-actions">
            <button id="clinic-new-patient-cancel" className="clinic-text" type="button">Cancelar</button>
            <button id="clinic-new-patient-save" className="clinic-primary" type="submit">Crear ficha</button>
          </div>
        </form>
      </dialog>

      <section id="clinic-patient-dialog" className="clinic-patient-page" hidden>
        <form id="clinic-patient-form" className="clinic-patient-page-content">
          <input id="clinic-patient-id" type="hidden" />
          <header className="clinic-patient-page-header">
            <button id="clinic-patient-close" className="clinic-patient-back" type="button">← Volver a pacientes</button>
            <div>
              <p className="clinic-eyebrow">Ficha clínica</p>
              <h2 id="clinic-patient-name">Paciente</h2>
            </div>
          </header>
          <div id="clinic-patient-contact" className="clinic-contact" />
          <div className="clinic-record-actions">
            <button id="clinic-print-history" className="clinic-secondary" type="button">Imprimir historial clínico</button>
            <button id="clinic-new-report" className="clinic-primary" type="button">Generar informe</button>
            <button id="clinic-archive-patient" className="clinic-text" type="button">Archivar ficha</button>
            <button id="clinic-delete-patient" className="clinic-danger" type="button">Eliminar paciente</button>
          </div>
          <p id="clinic-delete-patient-note" className="clinic-record-action-note">
            Eliminar solo se usa para fichas creadas por error y sin actividad clínica. Si la ficha ya contiene historia, sesiones o documentos, utiliza Archivar.
          </p>

          <details className="clinic-record-section clinic-personal-admin-section" open>
            <summary><span>Datos personales y administrativos</span><small>Identificación, contacto y gestión asistencial</small></summary>
            <div className="clinic-record-section-body clinic-form-grid">
              <label className="clinic-full">Nombre y apellidos
                <input id="clinic-personal-full-name" type="text" autoComplete="name" required />
              </label>
              <label>Fecha de nacimiento
                <input id="clinic-personal-birth-date" type="date" />
              </label>
              <label>Edad
                <input id="clinic-personal-age" type="text" readOnly placeholder="Se calcula automáticamente" />
              </label>
              <label>DNI / NIE
                <input id="clinic-personal-national-id" type="text" autoComplete="off" placeholder="Opcional" />
              </label>
              <label>Teléfono
                <input id="clinic-personal-phone" type="tel" inputMode="tel" autoComplete="tel" />
              </label>
              <label>Correo
                <input id="clinic-personal-email" type="email" autoComplete="email" />
              </label>
              <label className="clinic-full">Dirección
                <input id="clinic-personal-address" type="text" autoComplete="street-address" placeholder="Opcional" />
              </label>
              <label>Profesión / ocupación
                <input id="clinic-personal-occupation" type="text" placeholder="Opcional" />
              </label>
              <label>Estado civil / convivencia
                <input id="clinic-personal-marital-status" type="text" placeholder="Opcional" />
              </label>
              <label>Persona de contacto
                <input id="clinic-personal-emergency-name" type="text" placeholder="Opcional" />
              </label>
              <label>Teléfono de contacto
                <input id="clinic-personal-emergency-phone" type="tel" inputMode="tel" placeholder="Opcional" />
              </label>
              <label>Profesional de referencia
                <input id="clinic-personal-referring-professional" type="text" placeholder="Médico/a u otro profesional, opcional" />
              </label>
              <label>Mutua / cobertura
                <input id="clinic-personal-insurance" type="text" placeholder="Opcional" />
              </label>
              <label>Contexto asistencial
                <select id="clinic-personal-care-context">
                  <option value="private_practice">Consulta privada</option>
                  <option value="combined">Consulta + centro externo</option>
                  <option value="creu_blava">Centro externo</option>
                </select>
              </label>
              <label>Centro / proveedor externo
                <input id="clinic-personal-external-provider" type="text" placeholder="Opcional" />
              </label>
              <label className="clinic-full">Observaciones administrativas
                <textarea id="clinic-personal-admin-notes" rows={3} placeholder="Información administrativa útil. No incluir aquí contenido clínico." />
              </label>
            </div>
          </details>

          <section className="clinic-preparation">
            <p className="clinic-eyebrow">Preparar sesión</p>
            <div id="clinic-preparation-content" />
          </section>

          <div className="clinic-form-grid">
            <label className="clinic-full">Síntesis clínica<textarea id="clinic-summary-note" rows={4} placeholder="Problemas actuales, contexto y evolución relevante…" /></label>
            <label>Para la próxima sesión<textarea id="clinic-next-focus" rows={3} placeholder="Cuestiones pendientes y focos posibles…" /></label>
            <label>Medicación registrada<textarea id="clinic-medication" rows={3} placeholder="Fármaco, dosis, fecha y fuente…" /></label>
          </div>
          <div className="clinic-form-actions">
            <p id="clinic-patient-message" className="clinic-message" role="status" />
            <button className="clinic-primary" type="submit">Guardar ficha</button>
          </div>

          <section className="clinic-record-sections" aria-label="Historia clínica estructurada">
            <details className="clinic-record-section" open>
              <summary><span>Historia y antecedentes</span><small>Motivo, evolución, antecedentes y contexto</small></summary>
              <div className="clinic-record-section-body clinic-form-grid">
                <label className="clinic-full">Motivo de consulta<textarea id="clinic-reason-consultation" rows={3} placeholder="Demanda principal, quién solicita la consulta, motivo referido y expectativas…" /></label>
                <label className="clinic-full">Historia del problema actual<textarea id="clinic-problem-history" rows={4} placeholder="Inicio, evolución, desencadenantes, fluctuaciones, impacto funcional y estrategias utilizadas…" /></label>
                <label>Antecedentes psicológicos / psiquiátricos<textarea id="clinic-psych-history" rows={4} placeholder="Episodios previos, diagnósticos, tratamientos, ingresos, profesionales y evolución…" /></label>
                <label>Antecedentes médicos<textarea id="clinic-medical-history" rows={4} placeholder="Patologías relevantes, intervenciones, antecedentes neurológicos, dolor, sueño y otros factores médicos…" /></label>
                <label className="clinic-full">Antecedentes familiares<textarea id="clinic-family-history" rows={3} placeholder="Antecedentes psicológicos, psiquiátricos, neurológicos o médicos familiares relevantes…" /></label>
                <label>Contexto personal y familiar<textarea id="clinic-personal-family-context" rows={4} placeholder="Convivencia, relaciones significativas, apoyos, conflictos y acontecimientos familiares relevantes…" /></label>
                <label>Contexto social<textarea id="clinic-social-context" rows={4} placeholder="Red de apoyo, amistades, aislamiento, actividades, participación social y recursos comunitarios…" /></label>
                <label>Contexto académico / laboral<textarea id="clinic-work-academic-context" rows={4} placeholder="Estudios, ocupación, funcionamiento actual, bajas, conflictos, cambios y factores de estrés…" /></label>
                <label>Acontecimientos vitales relevantes<textarea id="clinic-life-events" rows={4} placeholder="Pérdidas, separaciones, enfermedad, migraciones, accidentes, cambios vitales u otros acontecimientos significativos…" /></label>
              </div>
            </details>

            <details className="clinic-record-section">
              <summary><span>Evaluación y diagnóstico</span><small>Exploración clínica, pruebas e hipótesis</small></summary>
              <div className="clinic-record-section-body clinic-form-grid">
                <label className="clinic-full">Exploración clínica<textarea id="clinic-clinical-examination" rows={4} placeholder="Estado emocional, conducta, discurso, pensamiento, percepción, cognición, insight y otros hallazgos relevantes…" /></label>
                <label>Evaluación psicométrica<textarea id="clinic-psychometric-assessment" rows={4} placeholder="Prueba, fecha, puntuaciones, interpretación clínica y limitaciones…" /></label>
                <label>Evaluación neuropsicológica<textarea id="clinic-neuropsych-assessment" rows={4} placeholder="Funciones exploradas, pruebas administradas, resultados, perfil cognitivo e interpretación…" /></label>
                <label className="clinic-full">Diagnósticos registrados<textarea id="clinic-diagnoses" rows={4} placeholder="Diagnóstico, código DSM-5-TR/CIE-11, fecha, profesional y estado…" /></label>
                <label>Hipótesis diagnósticas<textarea id="clinic-diagnostic-hypotheses" rows={4} placeholder="Hipótesis de trabajo, datos que la apoyan, datos que la cuestionan y aspectos por explorar…" /></label>
                <label>Diagnóstico diferencial<textarea id="clinic-differential-diagnosis" rows={4} placeholder="Alternativas consideradas y elementos clínicos a favor o en contra…" /></label>
              </div>
            </details>

            <details className="clinic-record-section">
              <summary><span>Formulación clínica</span><small>Problemas y factores explicativos del caso</small></summary>
              <div className="clinic-record-section-body clinic-form-grid">
                <label className="clinic-full">Problemas clínicos actuales<textarea id="clinic-current-problems" rows={4} placeholder="Dificultades principales que requieren intervención o seguimiento…" /></label>
                <label>Factores predisponentes<textarea id="clinic-predisposing-factors" rows={4} placeholder="Variables biográficas, temperamentales, familiares, médicas o contextuales que aumentan vulnerabilidad…" /></label>
                <label>Factores precipitantes<textarea id="clinic-precipitating-factors" rows={4} placeholder="Acontecimientos o cambios asociados temporalmente al inicio o empeoramiento…" /></label>
                <label>Factores perpetuantes<textarea id="clinic-perpetuating-factors" rows={4} placeholder="Conductas, cogniciones, dinámicas relacionales o factores ambientales que mantienen el problema…" /></label>
                <label>Factores protectores<textarea id="clinic-protective-factors" rows={4} placeholder="Apoyos, capacidades, recursos personales, motivación y condiciones favorables…" /></label>
                <label className="clinic-full">Formulación clínica integradora<textarea id="clinic-integrative-formulation" rows={5} placeholder="Hipótesis explicativa integradora del caso y relación entre problemas, antecedentes y mecanismos de mantenimiento…" /></label>
              </div>
            </details>

            <details className="clinic-record-section">
              <summary><span>Tratamiento y evolución</span><small>Objetivos, plan e integración longitudinal</small></summary>
              <div className="clinic-record-section-body clinic-form-grid">
                <label>Objetivos terapéuticos<textarea id="clinic-therapeutic-goals" rows={4} placeholder="Objetivo, prioridad, indicadores de cambio, estado y evolución…" /></label>
                <label>Plan terapéutico<textarea id="clinic-treatment-plan" rows={4} placeholder="Focos de intervención, estrategias previstas, frecuencia y criterios de revisión…" /></label>
                <label>Intervenciones realizadas<textarea id="clinic-interventions-summary" rows={4} placeholder="Técnicas utilizadas, objetivo, respuesta observada y resultado clínico relevante…" /></label>
                <label>Evolución clínica<textarea id="clinic-evolution-summary" rows={4} placeholder="Cambios en síntomas, funcionamiento, recursos, dificultades y respuesta al tratamiento…" /></label>
              </div>
            </details>

            <details className="clinic-record-section">
              <summary><span>Seguridad y coordinación</span><small>Riesgo, profesionales y observaciones relevantes</small></summary>
              <div className="clinic-record-section-body clinic-form-grid">
                <label className="clinic-full">Riesgo y seguridad<textarea id="clinic-risk-safety" rows={4} placeholder="Ideación autolesiva/suicida, planificación, antecedentes, factores de riesgo, protectores y medidas adoptadas…" /></label>
                <label>Coordinación con otros profesionales<textarea id="clinic-professional-coordination" rows={4} placeholder="Profesional, fecha, motivo, información intercambiada y acuerdos…" /></label>
                <label>Observaciones clínicas<textarea id="clinic-clinical-observations" rows={4} placeholder="Información relevante que no encaja en los apartados anteriores…" /></label>
              </div>
            </details>
          </section>

          <div className="clinic-form-actions clinic-form-actions-bottom">
            <span id="clinic-patient-save-state" className="clinic-save-indicator" role="status" aria-live="polite">Ficha guardada</span>
            <button className="clinic-primary" type="submit">Guardar ficha completa</button>
          </div>

          <section className="clinic-exercises-section">
            <div className="clinic-goals-heading"><div><p className="clinic-eyebrow">Continuidad terapéutica</p><h3>Material entre sesiones</h3></div><button id="clinic-new-exercise" className="clinic-secondary" type="button">Asignar material</button></div>
            <div id="clinic-exercise-suggestions" className="clinic-exercise-suggestions" />
            <div id="clinic-patient-exercises" className="clinic-history" />
            <NeuroFollowup />
          </section>

          <section className="clinic-patient-tools-grid">
            <article>
              <div className="clinic-goals-heading"><h3>Cronología clínica</h3><button id="clinic-refresh-timeline" className="clinic-text" type="button">Actualizar</button></div>
              <div id="clinic-patient-timeline" className="clinic-timeline" />
            </article>
            <article>
              <div className="clinic-goals-heading"><h3>Documentos y archivos compartidos</h3><button id="clinic-add-document" className="clinic-secondary" type="button">Subir archivo</button></div>
              <div id="clinic-patient-documents" className="clinic-history" />
            </article>
            <article>
              <div className="clinic-goals-heading"><h3>Escalas y puntuaciones</h3><button id="clinic-add-scale" className="clinic-secondary" type="button">Añadir medición</button></div>
              <div id="clinic-patient-scales" className="clinic-history" />
            </article>
          </section>

          <h3>Informes guardados</h3>
          <div id="clinic-patient-reports" className="clinic-history" />

          <h3>Sesiones y citas</h3>
          <div id="clinic-patient-history" className="clinic-history" />
        </form>
      </section>

      <dialog id="clinic-document-dialog" className="clinic-dialog clinic-small-dialog">
        <form id="clinic-document-form" className="clinic-dialog-content">
          <div className="clinic-dialog-heading"><div><p className="clinic-eyebrow">Archivo privado</p><h2>Subir documento</h2></div><button id="clinic-document-close" className="clinic-close" type="button">×</button></div>
          <label>Título<input id="clinic-document-title" required /></label>
          <label>Categoría<select id="clinic-document-category"><option value="intervention_plan">Plan de intervención</option><option value="information_notice">Circular informativa</option><option value="relaxation_audio">Audio de relajación</option><option value="external_report">Informe externo</option><option value="referral">Derivación</option><option value="consent">Consentimiento</option><option value="test_result">Resultado de prueba</option><option value="attendance">Justificante</option><option value="other">Otro</option></select></label>
          <label>Fecha del documento<input id="clinic-document-date" type="date" /></label>
          <label>Archivo<input id="clinic-document-file" type="file" accept=".pdf,.jpg,.jpeg,.png,.docx,.mp3,.m4a,.wav,.ogg,.webm" required /></label>
          <label>Notas internas (no visibles para el paciente)<textarea id="clinic-document-notes" rows={3} /></label>
          <label>Mensaje para el paciente (opcional)<textarea id="clinic-document-patient-note" rows={2} maxLength={500} placeholder="Por ejemplo: escucha el audio cuando necesites practicar la relajación." /></label>
          <label className="clinic-document-share-option"><input id="clinic-document-share" type="checkbox" /> Publicar también en «Mi espacio» de este paciente</label>
          <p className="clinic-note">El archivo será privado salvo que actives «Publicar». Al compartirlo se enviará automáticamente un aviso neutro por correo, sin nombre del documento ni adjuntos. Si el aviso falla, podrás reintentarlo desde la ficha. PDF, Word, imágenes y audio, hasta 25 MB.</p>
          <p id="clinic-document-message" className="clinic-message" />
          <div className="clinic-dialog-actions"><button className="clinic-primary" type="submit">Subir documento</button></div>
        </form>
      </dialog>

      <dialog id="clinic-scale-dialog" className="clinic-dialog clinic-small-dialog">
        <form id="clinic-scale-form" className="clinic-dialog-content">
          <div className="clinic-dialog-heading"><div><p className="clinic-eyebrow">Medición longitudinal</p><h2>Añadir escala</h2></div><button id="clinic-scale-close" className="clinic-close" type="button">×</button></div>
          <label>Instrumento<input id="clinic-scale-instrument" list="clinic-scale-options" required /><datalist id="clinic-scale-options"><option value="PHQ-9" /><option value="GAD-7" /><option value="PCL-5" /><option value="MoCA" /><option value="MMSE" /><option value="ACE-III" /><option value="TMT-A" /><option value="TMT-B" /></datalist></label>
          <label>Fecha<input id="clinic-scale-date" type="date" required /></label>
          <label>Puntuación total<input id="clinic-scale-score" type="number" step="0.01" /></label>
          <label>Interpretación clínica<textarea id="clinic-scale-interpretation" rows={3} /></label>
          <label>Notas<textarea id="clinic-scale-notes" rows={3} /></label>
          <p id="clinic-scale-message" className="clinic-message" />
          <div className="clinic-dialog-actions"><button className="clinic-primary" type="submit">Guardar medición</button></div>
        </form>
      </dialog>

      <dialog id="clinic-report-dialog" className="clinic-dialog clinic-report-dialog clinic-report-workspace" aria-label="Editor clínico de informes">
        <form id="clinic-report-form" className="clinic-dialog-content">
          <input id="clinic-report-id" type="hidden" />
          <div className="clinic-dialog-heading">
            <div><p className="clinic-eyebrow">Documento clínico · Editor de trabajo</p><h2 id="clinic-report-heading">Informe</h2><p className="clinic-muted">Revisa la redacción, guarda el borrador y descarga el Word. Los campos identificativos se obtienen de la ficha del paciente.</p></div>
            <button id="clinic-report-close" className="clinic-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <div className="clinic-form-grid clinic-report-settings">
            <label>Tipo de informe<select id="clinic-report-type"><option value="evolution_health">Evolución y seguimiento · Profesional sanitario</option><option value="evolution">Informe de evolución</option><option value="clinical_summary">Resumen clínico</option><option value="referral">Informe de derivación</option></select></label>
            <label>Destinatario<input id="clinic-report-recipient" placeholder="Paciente, profesional, entidad…" /></label>
            <label className="clinic-full">Finalidad<input id="clinic-report-purpose" placeholder="Finalidad asistencial del documento…" /></label>
            <label>Desde<input id="clinic-report-start" type="date" /></label>
            <label>Hasta<input id="clinic-report-end" type="date" /></label>
          </div>
          <div className="clinic-report-toolbar">
            <button id="clinic-generate-report" className="clinic-secondary" type="button">Autogenerar borrador</button>
            <span>Se incluirán únicamente registros aprobados del periodo seleccionado. Los cambios hechos posteriormente en Word se adjuntan desde «Adjuntar Word revisado». El borrador se guarda automáticamente cuando tiene finalidad y contenido suficientes.</span>
          </div>
          <section id="clinic-report-sheet" className="clinic-report-sheet" aria-label="Contenido clínico editable">
            <header><p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p><h1 id="clinic-report-title-preview">Informe de evolución</h1><p id="clinic-report-meta" /></header>
            <label>Motivo y contexto<textarea id="clinic-report-context" rows={5} /></label>
            <label>Evolución clínica<textarea id="clinic-report-evolution" rows={8} /></label>
            <label>Intervenciones realizadas<textarea id="clinic-report-interventions" rows={7} /></label>
            <label>Situación actual y recomendaciones<textarea id="clinic-report-current" rows={6} /></label>
            <footer><p id="clinic-report-signature" /></footer>
          </section>
          <p id="clinic-report-save-state" className="clinic-report-save-state" role="status" aria-live="polite">Sin cambios</p>
          <p id="clinic-report-message" className="clinic-message" role="status" />
          <div className="clinic-dialog-actions">
            <button id="clinic-save-report" className="clinic-secondary" type="button">Guardar borrador</button>
            <button id="clinic-approve-report" className="clinic-secondary" type="button">Aprobar informe</button>
            <button id="clinic-print-report" className="clinic-primary" type="button">Imprimir / guardar PDF</button>
            <button id="clinic-upload-revised-word" className="clinic-secondary" type="button">Adjuntar Word revisado</button>
          </div>
        </form>
      </dialog>

      <dialog id="clinic-exercise-dialog" className="clinic-dialog clinic-exercise-dialog">
        <form id="clinic-exercise-form" className="clinic-dialog-content">
          <input id="clinic-exercise-template-id" type="hidden" />
          <div className="clinic-dialog-heading">
            <div><p className="clinic-eyebrow">Entre Sesiones</p><h2>Crear material para el paciente</h2><p className="clinic-muted">Elige cómo empezar, revisa la ficha y después guárdala o envíala. Las opciones avanzadas quedan disponibles cuando las necesites.</p></div>
            <button id="clinic-exercise-close" className="clinic-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <p id="clinic-exercise-patient-code" className="clinic-note" />
          <div className="clinic-material-area">
            <label>Área de intervención
              <select id="clinic-clinical-area" defaultValue="psychology">
                <option value="psychology">Psicología</option>
                <option value="neuropsychology">Neuropsicología</option>
              </select>
            </label>
            <p id="clinic-clinical-area-hint" className="clinic-material-helper">Se conserva íntegramente el generador de materiales psicológicos.</p>
          </div>
          <fieldset id="clinic-neuro-settings" className="clinic-neuro-settings" hidden>
            <legend>1 · Planifica el trabajo neuropsicológico</legend>
            <div className="clinic-neuro-grid clinic-neuro-mode-grid">
              <label>¿Qué quieres preparar?
                <select id="clinic-neuro-mode" defaultValue="weekly">
                  <option value="weekly">Cuaderno completo · 7 días</option>
                  <option value="single">Ficha por función cognitiva</option>
                </select>
              </label>
              <div className="clinic-neuro-mode-action"><p id="clinic-neuro-mode-note">7 días orientativos, 14 ejercicios distintos y cobertura de 13 dominios.</p><button id="clinic-neuro-generate" className="clinic-primary" type="button">Crear borrador del material</button></div>
            </div>
            <div className="clinic-neuro-library-picker">
              <label>Biblioteca inicial de actividades (borradores pendientes de revisión clínica)
                <select id="clinic-neuro-starter" defaultValue="">
                  <option value="">Elegir actividad neuropsicológica...</option>
                </select>
              </label>
              <button id="clinic-neuro-starter-load" className="clinic-secondary" type="button">Cargar propuesta</button>
            </div>
            <p className="clinic-material-helper">Puedes partir de una de las 24 fichas existentes o crear un material nuevo con una colección ampliada de actividades y estímulos originales. Todo borrador requiere revisión clínica.</p>
            <p className="clinic-neuro-week-note"><strong>Plan semanal individualizado.</strong> La cobertura es multicomponente y flexible: no implica completar tareas inadecuadas o mantener una práctica diaria si hay fatiga. Revisa la evolución antes de generar la semana siguiente.</p>
            <div className="clinic-neuro-grid">
              <label>Semana del programa
                <input id="clinic-neuro-week-number" type="number" min={1} max={52} defaultValue={1} inputMode="numeric" aria-label="Número de semana del programa neuropsicológico" />
              </label>
              <label>Dominio cognitivo
                <select id="clinic-neuro-domain" defaultValue="">
                  <option value="">Seleccionar...</option>
                  <option value="multidominio">Todas las funciones (cuaderno semanal)</option>
                  <option value="orientacion_temporal">Orientación temporal</option>
                  <option value="orientacion_espacial">Orientación espacial</option>
                  <option value="orientacion_personal">Orientación personal</option>
                  <option value="atencion">Atención</option>
                  <option value="memoria">Memoria</option>
                  <option value="funciones_ejecutivas">Funciones ejecutivas</option>
                  <option value="lenguaje">Lenguaje</option>
                  <option value="praxias_gnosias">Praxias y gnosias</option>
                  <option value="visuoespacial">Funciones visuoespaciales</option>
                  <option value="cognicion_funcional">Cognición funcional</option>
                  <option value="calculo">Cálculo funcional</option>
                  <option value="cognicion_social">Cognición social</option>
                  <option value="velocidad_procesamiento">Velocidad de procesamiento</option>
                </select>
              </label>
              <label>Tipo de intervención
                <select id="clinic-neuro-intervention" defaultValue="estimulacion">
                  <option value="estimulacion">Estimulación cognitiva</option>
                  <option value="entrenamiento">Entrenamiento específico</option>
                  <option value="rehabilitacion">Rehabilitación funcional</option>
                  <option value="compensacion">Estrategias compensatorias</option>
                </select>
              </label>
              <label>Demanda de la tarea
                <select id="clinic-neuro-level" defaultValue="">
                  <option value="">Seleccionar...</option>
                  <option value="apoyo_alto">Apoyo alto</option>
                  <option value="apoyo_moderado">Apoyo moderado</option>
                  <option value="autonomo">Mayor autonomía</option>
                </select>
              </label>
              <label>Tema estacional o autobiográfico (opcional)
                <input id="clinic-neuro-theme" placeholder="Ej. La Castanyada, el barrio, mi calendario..." />
              </label>
            </div>
            <div className="clinic-neuro-grid">
              <label>Modalidad de respuesta preferida
                <select id="clinic-neuro-response-mode" defaultValue="flexible">
                  <option value="flexible">Flexible, según capacidad</option>
                  <option value="verbal">Oral</option>
                  <option value="escrita">Escrita</option>
                  <option value="senalamiento">Señalamiento o elección</option>
                </select>
              </label>
              <label>Adaptaciones de accesibilidad
                <input id="clinic-neuro-accessibility" maxLength={220} placeholder="Ej. letra grande, contraste alto, claves auditivas..." />
              </label>
            </div>
            <label>Objetivo funcional
              <textarea id="clinic-neuro-functional-goal" rows={2} placeholder="Conducta observable o aplicación cotidiana..." />
            </label>
            <p className="clinic-material-helper">Evita tareas infantilizantes y el uso de ítems protegidos de pruebas estandarizadas. No interpreta resultados como puntuaciones diagnósticas.</p>
          </fieldset>
          <label className="clinic-material-context">Objetivo o contexto para personalizar <span>(sin nombres ni datos identificativos, solo profesional)</span><textarea id="clinic-exercise-rationale" rows={2} placeholder="¿Qué se busca trabajar? ¿Qué apoyos, límites o preferencias hay que contemplar?" /></label>
          <div className="clinic-material-picker">
            <div className="clinic-material-picker-heading"><strong>2 · Empieza por una ficha de la biblioteca o por la IA</strong><p>Buscar no modifica los materiales existentes hasta que decidas guardarlos.</p></div>
            <label>Buscar en la biblioteca
              <input id="clinic-material-search" type="search" placeholder="Buscar por título, proceso o tipo…" autoComplete="off" />
            </label>
            <label>Biblioteca clínica
              <select id="clinic-exercise-library" aria-label="Biblioteca de material entre sesiones">
                <option value="">Seleccionar material…</option>
              </select>
            </label>
            <div id="clinic-material-not-found" className="clinic-material-not-found" hidden>
              <div>
                <strong>No existe en la biblioteca</strong>
                <p>La IA puede comprobar equivalencias y, si realmente falta, preparar una nueva ficha compatible con el material actual.</p>
              </div>
              <div className="clinic-material-not-found-actions">
                <button id="clinic-material-use-search" className="clinic-secondary" type="button">Usar búsqueda como título</button>
              </div>
            </div>
            <button id="clinic-material-ai-create" className="clinic-secondary clinic-material-generate-action" type="button">Crear nueva ficha con IA a partir de la búsqueda</button>
          </div>
          <details className="clinic-material-advanced"><summary>Opciones de biblioteca y categoría</summary><div className="clinic-material-create-row">
            <label>Tipo
              <select id="clinic-material-type">
                <option value="exercise">Ejercicio</option>
                <option value="psychoeducation">Psicoeducación</option>
              </select>
            </label>
            <label>Proceso / categoría
              <select id="clinic-material-process">
                <option value="">Seleccionar categoría…</option>
              </select>
            </label>
            <button id="clinic-add-material-library" className="clinic-secondary" type="button">Añadir a la biblioteca</button>
          </div></details>
          <label>Título<input id="clinic-exercise-title" required /></label>
          <section className="clinic-patient-document">
            <h3 className="clinic-material-section-title">3 · Contenido que recibirá el paciente</h3>
            <div className="clinic-patient-document-heading">
              <div>
                <p className="clinic-eyebrow">Documento para el paciente</p>
                <p className="clinic-material-helper">Esta información aparecerá en la lectura online y en el PDF descargable.</p>
              </div>
              <button id="clinic-material-ai-enrich" className="clinic-secondary" type="button">Completar ficha con IA</button>
            </div>
            <div id="clinic-material-quality" className="clinic-material-quality" role="status">
              <strong id="clinic-material-quality-label">Ficha básica</strong>
              <span id="clinic-material-quality-note">Recomendable completar antes de enviar.</span>
            </div>
            <div className="clinic-material-meta-grid">
              <label>Tiempo aproximado
                <div className="clinic-inline-field"><input id="clinic-exercise-duration" type="number" min={1} max={180} inputMode="numeric" /><span>min</span></div>
              </label>
              <label>Frecuencia sugerida<input id="clinic-exercise-frequency" placeholder="Ej. 3 veces esta semana" /></label>
            </div>
            <label>Introducción breve<textarea id="clinic-exercise-introduction" rows={2} required /></label>
            <label>Por qué hacemos este ejercicio<textarea id="clinic-exercise-why" rows={4} required /></label>
            <p id="clinic-material-period-help">Psicología: materiales para dos semanas. Neuropsicología: ficha por función o cuaderno semanal multicomponente. Revisa el contenido y los apoyos antes de enviarlo.</p>
            <label>Cómo hacerlo / contenido<textarea id="clinic-exercise-content" rows={10} required /></label>
            <details className="clinic-material-details">
              <summary>Completar objetivo, ejemplo, registro, seguridad y cierre</summary>
              <div className="clinic-material-details-grid">
                <label>Objetivo<input id="clinic-exercise-objective" /></label>
                <label>Ejemplo para el paciente<textarea id="clinic-exercise-example" rows={4} /></label>
                <label>Qué observar o registrar<textarea id="clinic-exercise-record" rows={3} /></label>
                <label>Si resulta demasiado intenso <span>(opcional)</span><textarea id="clinic-exercise-safety" rows={3} /></label>
                <label>Qué conviene recordar<textarea id="clinic-exercise-remember" rows={3} /></label>
                <label>Para comentar en sesión <span>(una pregunta por línea)</span><textarea id="clinic-exercise-session-questions" rows={3} /></label>
              </div>
            </details>
          </section>
          <details id="clinic-visual-details" className="clinic-neuro-visual-section" aria-label="Recursos multimodales">
            <summary>4 · Recursos visuales: imágenes, tablas, calendarios y gráficos</summary>
            <p className="clinic-material-helper">Añade estímulos únicamente cuando aporten valor a la tarea. Se mostrarán en la vista online y en el PDF. Revisa la precisión de todos los datos y fotografías.</p>
            <div className="clinic-visual-toolbar">
              <label>Recurso
                <select id="clinic-visual-type" defaultValue="table">
                  <option value="image">Imagen educativa</option>
                  <option value="table">Tabla</option>
                  <option value="chart">Gráfico de barras</option>
                  <option value="diagram">Secuencia visual</option>
                  <option value="calendar">Calendario</option>
                </select>
              </label>
              <button id="clinic-visual-add" className="clinic-secondary" type="button">Añadir recurso</button>
            </div>
            <div id="clinic-visual-block-list" />
            <p className="clinic-material-helper">Máximo 8 recursos por ficha. Los gráficos deben tener datos correctos; las imágenes generadas se revisan antes del envío. No incluyas datos identificativos.</p>
          </details>
          <label id="clinic-neuro-review-wrapper" className="clinic-neuro-review" hidden>
            <input id="clinic-neuro-reviewed" type="checkbox" />
            He comprobado consignas, estímulos, respuestas, accesibilidad y adecuación individual antes de prescribir este material.
          </label>
          <label>Correo destinatario<input id="clinic-exercise-email" type="email" required /></label>
          <p className="clinic-note">El correo será neutro. El paciente podrá leer el material online y descargar un PDF profesional. El enlace personal caduca en 7 días.</p>
          <p id="clinic-exercise-message" className="clinic-message" role="status" />
          <div className="clinic-material-review-actions"><details><summary>Comprobar vista previa y PDF</summary><div className="clinic-material-review-buttons"><button id="clinic-preview-material" className="clinic-secondary" type="button">Vista del paciente</button><button id="clinic-preview-pdf" className="clinic-secondary" type="button">PDF de prueba</button></div></details></div>
          <div className="clinic-dialog-actions clinic-material-actions">
            <button id="clinic-save-exercise" className="clinic-secondary" type="button">Guardar borrador</button>
            <button className="clinic-primary" type="submit">Guardar y enviar al paciente</button>
          </div>
        </form>
      </dialog>

      <dialog id="clinic-session-dialog" className="clinic-dialog clinic-session-dialog">
        <form id="clinic-session-form" className="clinic-dialog-content">
          <input id="clinic-session-id" type="hidden" />
          <input id="clinic-session-patient-id" type="hidden" />
          <input id="clinic-session-appointment-id" type="hidden" />
          <div className="clinic-dialog-heading">
            <div><p className="clinic-eyebrow">Sesión clínica</p><h2 id="clinic-session-title">Sesión</h2></div>
            <button id="clinic-session-close" className="clinic-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <p id="clinic-session-state" className="clinic-note" />
          <section id="clinic-session-brief" className="clinic-session-brief" aria-label="Preparación de la sesión"></section>
          <section className="clinic-consultation-tools">
            <div>
              <p className="clinic-eyebrow">Procesos observados o referidos</p>
              <div id="clinic-process-markers" className="clinic-marker-grid">
                {["Rumiación", "Preocupación", "Intolerancia a la incertidumbre", "Evitación", "Comprobación", "Insomnio", "Activación fisiológica", "Bajo estado de ánimo", "Regulación emocional", "Autocrítica", "Autoestima", "Perfeccionismo", "Necesidad de aprobación", "Asertividad", "Límites interpersonales", "Activación conductual", "Procrastinación", "Resolución de problemas", "Sexualidad", "Adicciones", "Habilidades sociales infantil", "TDAH adulto", "TDAH infantil", "TEA infantil", "TEA adulto", "Duelo", "Trauma", "Pareja", "Dependencia emocional", "Celos", "Ira", "TOC", "Pánico", "Ansiedad social", "Fobias", "Sueño", "Dolor crónico", "Alimentación", "Habilidades parentales", "Neuropsicología"].map((item) => (
                  <label key={item}><input type="checkbox" value={item} />{item}</label>
                ))}
              </div>
            </div>
            <div>
              <p className="clinic-eyebrow">Intervenciones realizadas</p>
              <div id="clinic-intervention-markers" className="clinic-marker-grid">
                {["Psicoeducación", "Análisis funcional", "Exposición", "Activación conductual", "Defusión", "Reestructuración cognitiva", "Regulación emocional", "Resolución de problemas"].map((item) => (
                  <label key={item}><input type="checkbox" value={item} />{item}</label>
                ))}
              </div>
            </div>
            <div>
              <p className="clinic-eyebrow">Evolución desde la sesión anterior</p>
              <div className="clinic-evolution-grid">
                {["Sueño", "Ansiedad", "Estado de ánimo", "Funcionamiento", "Tarea"].map((item) => (
                  <label key={item}>{item}<select data-evolution={item}><option value="not_assessed">No valorado</option><option value="better">Mejor</option><option value="similar">Similar</option><option value="worse">Peor</option><option value="fluctuating">Fluctuante</option></select></label>
                ))}
              </div>
            </div>
            <div>
              <div className="clinic-goals-heading"><p className="clinic-eyebrow">Objetivos activos</p><button id="clinic-add-goal" className="clinic-text" type="button">+ Añadir objetivo</button></div>
              <div id="clinic-session-goals" className="clinic-session-goals" />
            </div>
          </section>
          <label className="clinic-session-field">Notas de trabajo
            <span className="clinic-dictation-actions"><button id="clinic-dictate" className="clinic-secondary" type="button">Iniciar dictado</button><span id="clinic-dictation-state" className="clinic-muted" /></span>
            <textarea id="clinic-work-notes" rows={5} placeholder="Apuntes breves durante la consulta. No forman parte del registro aprobado." /></label>
          <div className="clinic-draft-generator">
            <div><strong>Cierre asistido</strong><p>Organiza tus notas y marcadores en los apartados clínicos. Podrás revisar todo antes de aprobar.</p></div>
            <button id="clinic-generate-draft" className="clinic-secondary" type="button">Generar borrador</button>
          </div>
          <div className="clinic-form-grid">
            <label>Evolución<textarea id="clinic-evolution-note" rows={4} /></label>
            <label>Intervención<textarea id="clinic-intervention-note" rows={4} /></label>
            <label>Respuesta<textarea id="clinic-response-note" rows={3} /></label>
            <label>Acuerdos<textarea id="clinic-agreements-note" rows={3} /></label>
            <label>Tarea o ejercicio<textarea id="clinic-homework-note" rows={3} /></label>
            <label>Próxima sesión<textarea id="clinic-next-session-note" rows={3} /></label>
          </div>
          <p id="clinic-session-autosave-state" className="clinic-save-indicator" role="status" aria-live="polite">Sesión nueva · sin guardar</p>
          <p id="clinic-session-message" className="clinic-message" role="status" />
          <div className="clinic-dialog-actions">
            <button id="clinic-save-draft" className="clinic-secondary" type="button">Guardar borrador</button>
            <button id="clinic-approve-session" className="clinic-primary" type="submit">Aprobar y cerrar</button>
          </div>
        </form>
      </dialog>

      <Script src="/clinic-neuro-materials.js?v=20261010-ux-1" strategy="afterInteractive" />
      <Script src="/clinic-neuro-weekly-composer.js?v=20261010-1" strategy="afterInteractive" />
      <Script src="/admin-clinica.js?v=20261010-ux-1" strategy="afterInteractive" />
      <Script src="/clinical-smart-intake.js?v=20261005-smart-state-5" strategy="afterInteractive" />
      <Script src="/clinical-diagnostic-assistant.js?v=20261007-dx-2" strategy="afterInteractive" />
      <Script src="/admin-clinica-audit-fixes.js?v=20260915-1" strategy="afterInteractive" />
    </main>
  );
}
