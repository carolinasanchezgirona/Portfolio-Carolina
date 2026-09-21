import Script from "next/script";
import type { Metadata } from "next";
import PatientBulkImport from "./patient-bulk-import";
import "./clinica.css";

export const metadata: Metadata = {
  title: "Gestión clínica | Carolina Sánchez",
  description: "Aplicación privada para la gestión clínica de Dememoria.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminClinicaPage() {
  return (
    <main className="clinic-page">
      <section id="clinic-login" className="clinic-login-shell">
        <form id="clinic-login-form" className="clinic-login-card">
          <p className="clinic-eyebrow">Dememoria · Área privada</p>
          <h1>Gestión clínica</h1>
          <p>Acceso reservado a Carolina Sánchez.</p>
          <label>Correo<input id="clinic-email" type="email" autoComplete="username" required /></label>
          <label>Contraseña<input id="clinic-password" type="password" autoComplete="current-password" required /></label>
          <p id="clinic-login-message" className="clinic-message" role="status" />
          <button className="clinic-primary clinic-login-button" type="submit">Entrar</button>
          <a className="clinic-back" href="/admin/agenda/">Volver a la agenda</a>
        </form>
      </section>

      <section id="clinic-app" className="clinic-app" hidden>
        <header className="clinic-topbar">
          <div>
            <p className="clinic-eyebrow">Dememoria</p>
            <h1>Gestión clínica</h1>
            <p id="clinic-date" className="clinic-muted" />
          </div>
          <div className="clinic-top-actions">
            <a className="clinic-secondary" href="/admin/agenda/">Agenda</a>
            <a className="clinic-secondary" href="/admin/articulos/">Artículos</a>
            <a className="clinic-secondary" href="/admin/recursos/">Recursos</a>
            <button id="clinic-refresh" className="clinic-secondary" type="button">Actualizar</button>
            <button id="clinic-logout" className="clinic-text" type="button">Cerrar sesión</button>
          </div>
        </header>

        <nav className="clinic-tabs" aria-label="Vistas de gestión clínica">
          <button id="clinic-view-today" className="active" type="button">Hoy</button>
          <button id="clinic-view-patients" type="button">Pacientes</button>
          <button id="clinic-view-pending" type="button">Pendientes <span id="clinic-pending-badge" className="clinic-tab-badge">0</span></button>
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
            <article><strong id="clinic-pending-today">0</strong><span>Pendientes</span></article>
            <article><strong id="clinic-finished-today">0</strong><span>Realizadas</span></article>
          </div>
          <div id="clinic-today-list" className="clinic-list" />
        </section>

        <section id="clinic-pending-view" className="clinic-view" hidden>
          <div className="clinic-section-heading"><div><p className="clinic-eyebrow">Carga administrativa</p><h2>Pendientes</h2></div></div>
          <div id="clinic-pending-summary" className="clinic-summary" />
          <div id="clinic-pending-list" className="clinic-pending-list" />
        </section>

        <section id="clinic-patients-view" className="clinic-view" hidden>
          <div className="clinic-section-heading clinic-patients-heading">
            <div><p className="clinic-eyebrow">Dememoria</p><h2>Pacientes</h2></div>
            <div className="clinic-patients-actions">
              <input id="clinic-patient-search" type="search" placeholder="Buscar por nombre, correo, teléfono o mutua" autoComplete="off" />
              <PatientBulkImport />
            </div>
          </div>
          <p className="clinic-note">Las fichas clínicas usan el número propio de Dememoria. Las agendas externas conservan teléfono, mutua, centro, fecha y hora, pero nunca el número de historia de la clínica externa.</p>
          <div id="clinic-patient-list" className="clinic-patient-list" />
        </section>
      </section>

      <dialog id="clinic-patient-dialog" className="clinic-dialog clinic-patient-dialog">
        <form id="clinic-patient-form" className="clinic-dialog-content">
          <input id="clinic-patient-id" type="hidden" />
          <div className="clinic-dialog-heading">
            <div><p className="clinic-eyebrow">Ficha clínica</p><h2 id="clinic-patient-name">Paciente</h2></div>
            <button id="clinic-patient-close" className="clinic-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <div id="clinic-patient-contact" className="clinic-contact" />
          <div className="clinic-record-actions">
            <button id="clinic-print-history" className="clinic-secondary" type="button">Imprimir historial clínico</button>
            <button id="clinic-new-report" className="clinic-primary" type="button">Generar informe</button>
          </div>

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

          <section className="clinic-exercises-section">
            <div className="clinic-goals-heading"><div><p className="clinic-eyebrow">Continuidad terapéutica</p><h3>Ejercicios</h3></div><button id="clinic-new-exercise" className="clinic-secondary" type="button">Asignar ejercicio</button></div>
            <div id="clinic-exercise-suggestions" className="clinic-exercise-suggestions" />
            <div id="clinic-patient-exercises" className="clinic-history" />
          </section>

          <section className="clinic-patient-tools-grid">
            <article>
              <div className="clinic-goals-heading"><h3>Cronología clínica</h3><button id="clinic-refresh-timeline" className="clinic-text" type="button">Actualizar</button></div>
              <div id="clinic-patient-timeline" className="clinic-timeline" />
            </article>
            <article>
              <div className="clinic-goals-heading"><h3>Documentos</h3><button id="clinic-add-document" className="clinic-secondary" type="button">Subir documento</button></div>
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
      </dialog>

      <dialog id="clinic-document-dialog" className="clinic-dialog clinic-small-dialog">
        <form id="clinic-document-form" className="clinic-dialog-content">
          <div className="clinic-dialog-heading"><div><p className="clinic-eyebrow">Archivo privado</p><h2>Subir documento</h2></div><button id="clinic-document-close" className="clinic-close" type="button">×</button></div>
          <label>Título<input id="clinic-document-title" required /></label>
          <label>Categoría<select id="clinic-document-category"><option value="external_report">Informe externo</option><option value="referral">Derivación</option><option value="consent">Consentimiento</option><option value="test_result">Resultado de prueba</option><option value="attendance">Justificante</option><option value="other">Otro</option></select></label>
          <label>Fecha del documento<input id="clinic-document-date" type="date" /></label>
          <label>Archivo<input id="clinic-document-file" type="file" accept=".pdf,.jpg,.jpeg,.png,.docx" required /></label>
          <label>Notas<textarea id="clinic-document-notes" rows={3} /></label>
          <p className="clinic-note">Máximo 10 MB. El archivo se guardará en almacenamiento privado.</p>
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

      <dialog id="clinic-report-dialog" className="clinic-dialog clinic-report-dialog">
        <form id="clinic-report-form" className="clinic-dialog-content">
          <input id="clinic-report-id" type="hidden" />
          <div className="clinic-dialog-heading">
            <div><p className="clinic-eyebrow">Documento clínico</p><h2 id="clinic-report-heading">Informe</h2></div>
            <button id="clinic-report-close" className="clinic-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <div className="clinic-form-grid clinic-report-settings">
            <label>Tipo de informe<select id="clinic-report-type"><option value="evolution">Informe de evolución</option><option value="clinical_summary">Resumen clínico</option><option value="referral">Informe de derivación</option></select></label>
            <label>Destinatario<input id="clinic-report-recipient" placeholder="Paciente, profesional, entidad…" /></label>
            <label className="clinic-full">Finalidad<input id="clinic-report-purpose" placeholder="Finalidad asistencial del documento…" /></label>
            <label>Desde<input id="clinic-report-start" type="date" /></label>
            <label>Hasta<input id="clinic-report-end" type="date" /></label>
          </div>
          <div className="clinic-report-toolbar">
            <button id="clinic-generate-report" className="clinic-secondary" type="button">Autogenerar borrador</button>
            <span>Se incluirán únicamente registros aprobados del periodo seleccionado.</span>
          </div>
          <section id="clinic-report-sheet" className="clinic-report-sheet">
            <header><p>Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga</p><h1 id="clinic-report-title-preview">Informe de evolución</h1><p id="clinic-report-meta" /></header>
            <label>Motivo y contexto<textarea id="clinic-report-context" rows={5} /></label>
            <label>Evolución clínica<textarea id="clinic-report-evolution" rows={8} /></label>
            <label>Intervenciones realizadas<textarea id="clinic-report-interventions" rows={7} /></label>
            <label>Situación actual y recomendaciones<textarea id="clinic-report-current" rows={6} /></label>
            <footer><p id="clinic-report-signature" /></footer>
          </section>
          <p id="clinic-report-message" className="clinic-message" role="status" />
          <div className="clinic-dialog-actions">
            <button id="clinic-save-report" className="clinic-secondary" type="button">Guardar borrador</button>
            <button id="clinic-approve-report" className="clinic-secondary" type="button">Aprobar informe</button>
            <button id="clinic-print-report" className="clinic-primary" type="button">Imprimir / guardar PDF</button>
          </div>
        </form>
      </dialog>

      <dialog id="clinic-exercise-dialog" className="clinic-dialog clinic-exercise-dialog">
        <form id="clinic-exercise-form" className="clinic-dialog-content">
          <input id="clinic-exercise-template-id" type="hidden" />
          <div className="clinic-dialog-heading">
            <div><p className="clinic-eyebrow">Material para el paciente</p><h2>Preparar ejercicio</h2></div>
            <button id="clinic-exercise-close" className="clinic-close" type="button" aria-label="Cerrar">×</button>
          </div>
          <p id="clinic-exercise-patient-code" className="clinic-note" />
          <label>Título<input id="clinic-exercise-title" required /></label>
          <label>Contenido<textarea id="clinic-exercise-content" rows={12} required /></label>
          <label>Motivo de la sugerencia<textarea id="clinic-exercise-rationale" rows={2} /></label>
          <label>Correo destinatario<input id="clinic-exercise-email" type="email" required /></label>
          <p className="clinic-note">El correo será neutro. El contenido se abrirá mediante un enlace personal que caduca en 7 días.</p>
          <p id="clinic-exercise-message" className="clinic-message" role="status" />
          <div className="clinic-dialog-actions">
            <button id="clinic-save-exercise" className="clinic-secondary" type="button">Guardar sin enviar</button>
            <button className="clinic-primary" type="submit">Guardar y enviar enlace</button>
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
          <section className="clinic-consultation-tools">
            <div>
              <p className="clinic-eyebrow">Procesos observados o referidos</p>
              <div id="clinic-process-markers" className="clinic-marker-grid">
                {["Rumiación", "Evitación", "Comprobación", "Insomnio", "Activación fisiológica", "Bajo estado de ánimo", "Autocrítica"].map((item) => (
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
          <p id="clinic-session-message" className="clinic-message" role="status" />
          <div className="clinic-dialog-actions">
            <button id="clinic-save-draft" className="clinic-secondary" type="button">Guardar borrador</button>
            <button id="clinic-approve-session" className="clinic-primary" type="submit">Aprobar y cerrar</button>
          </div>
        </form>
      </dialog>

      <Script src="/admin-clinica.js?v=20260914-5" strategy="afterInteractive" />
      <Script src="/admin-clinica-audit-fixes.js?v=20260915-1" strategy="afterInteractive" />
    </main>
  );
}
