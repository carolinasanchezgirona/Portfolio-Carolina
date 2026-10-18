import Script from "next/script";
import type { Metadata } from "next";
import "./external-library.css";

export const metadata: Metadata = {
  title: "Materiales externos | EntreSesiones",
  description: "Biblioteca privada de cuadernos, fichas y solucionarios clínicos.",
  robots: { index: false, follow: false, nocache: true },
};

export default function ClinicalExternalMaterialsPage() {
  return <main className="external-library">
    <div id="ext-loading" className="ext-loading" role="status">Comprobando acceso profesional…</div>
    <section id="ext-app" hidden>
      <header className="ext-topbar">
        <div>
          <p className="ext-eyebrow">Dememoria · EntreSesiones · Área profesional</p>
          <h1>Materiales ya elaborados</h1>
          <p className="ext-description">Añade, edita, clasifica, descarga, archiva y asigna materiales clínicos, con solucionarios privados y sin volver a generarlos.</p>
        </div>
        <div className="ext-top-actions">
          <a className="ext-quiet" href="/admin/clinica/?panel=1">← Gestión clínica</a>
          <button className="ext-primary" id="ext-open-form" type="button">Añadir material</button>
        </div>
      </header>

      <div className="ext-privacy-note">
        <span aria-hidden="true">◈</span>
        <span><strong>Biblioteca profesional privada.</strong> Solo el archivo del paciente se puede prescribir. Los solucionarios no aparecen en «Mi espacio».</span>
      </div>

      <section id="ext-editor" className="ext-editor" hidden aria-labelledby="ext-form-title">
        <div className="ext-section-heading">
          <div><p className="ext-eyebrow">Nuevo recurso clínico</p><h2 id="ext-form-title">Añadir a la biblioteca</h2></div>
          <button id="ext-cancel" type="button" className="ext-quiet">Cancelar</button>
        </div>
        <form id="ext-form">
          <div className="ext-form-grid">
            <label>Título del material <span aria-hidden="true">*</span>
              <input id="ext-title" type="text" required maxLength={180} placeholder="Ej. Estimulación cognitiva · Semana 1" />
            </label>
            <label>Tipo
              <select id="ext-type"><option value="workbook">Cuaderno</option><option value="worksheet">Ficha / material individual</option></select>
            </label>
            <label>Área
              <select id="ext-area"><option value="neuropsychology">Neuropsicología</option><option value="psychology">Psicología</option></select>
            </label>
            <label>Función principal
              <select id="ext-domain">
                <option value="multidomain">Varias funciones / multidominio</option>
                <option value="orientation">Orientación</option>
                <option value="attention">Atención</option>
                <option value="memory">Memoria</option>
                <option value="executive">Funciones ejecutivas</option>
                <option value="language">Lenguaje</option>
                <option value="visuospatial">Habilidades visuoespaciales</option>
                <option value="calculation">Cálculo</option>
                <option value="praxis">Praxias y gnosias</option>
                <option value="psychology">Trabajo psicológico</option>
                <option value="other">Otras</option>
              </select>
            </label>
            <label>Nivel orientativo
              <select id="ext-level">
                <option value="unspecified">Sin especificar</option>
                <option value="basic">Básico</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </label>
            <label className="ext-full">Notas internas (opcional)
              <textarea id="ext-description" rows={2} maxLength={1200} placeholder="Adaptaciones, objetivos, observaciones de uso..."></textarea>
            </label>
          </div>
          <div className="ext-file-grid">
            <label className="ext-file-label">
              <strong>1. Material para el paciente <span aria-hidden="true">*</span></strong>
              <small>Cuaderno o ficha. PDF, Word, JPG o PNG · máximo 25 MB.</small>
              <input id="ext-patient-file" type="file" required accept=".pdf,.docx,.jpg,.jpeg,.png" />
            </label>
            <label className="ext-file-label ext-file-pro">
              <strong>2. Solucionario profesional (opcional)</strong>
              <small>Separado del documento del paciente. Nunca se comparte.</small>
              <input id="ext-solution-file" type="file" accept=".pdf,.docx,.jpg,.jpeg,.png" />
            </label>
          </div>
          <div className="ext-form-footer">
            <p id="ext-form-message" role="status" aria-live="polite"></p>
            <button id="ext-save" className="ext-primary" type="submit">Guardar en biblioteca</button>
          </div>
        </form>
      </section>

      <section className="ext-catalog" aria-labelledby="ext-internal-heading"><div className="ext-section-heading"><div><p className="ext-eyebrow">Catálogo integrado</p><h2 id="ext-internal-heading">Materiales internos de Entre Sesiones</h2></div><span id="ext-internal-count" className="ext-counter">Cargando…</span></div><p className="ext-muted">Materiales creados desde el generador y guardados previamente en la aplicación. Puedes revisar, editar su ficha, archivar y recuperar sin afectar a las asignaciones ya realizadas.</p><div className="ext-filters"><label>Buscar material interno <input id="ext-internal-search" type="search" placeholder="Título, instrucciones, categoría…" /></label><label>Estado <select id="ext-internal-filter"><option value="all">Todos</option><option value="active">Activos</option><option value="archived">Archivados</option></select></label></div><div id="ext-internal-list" className="ext-items"><p className="ext-muted">Cargando catálogo interno…</p></div></section>

      <section className="ext-catalog" aria-labelledby="ext-catalog-heading">
        <div className="ext-section-heading">
          <div><p className="ext-eyebrow">Tus recursos</p><h2 id="ext-catalog-heading">Archivos y materiales importados</h2></div>
          <span id="ext-count" className="ext-counter">0 materiales</span>
        </div>
        <div className="ext-filters">
          <label>Buscar <input id="ext-search" type="search" placeholder="Por título o función…" /></label>
          <label>Mostrar
            <select id="ext-filter">
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="workbook">Cuadernos</option>
              <option value="worksheet">Fichas</option>
              <option value="archived">Archivados</option>
              </select>
          </label>
        </div>
        <p id="ext-status" role="status" aria-live="polite"></p>
        <div id="ext-items" className="ext-items"><p className="ext-muted">Cargando materiales…</p></div>
      </section>

      <dialog id="ext-assign-dialog" className="ext-dialog">
        <form id="ext-assign-form">
          <div className="ext-section-heading">
            <div><p className="ext-eyebrow">Prescripción individual</p><h2>Asignar cuaderno o ficha</h2></div>
            <button id="ext-assign-cancel" type="button" className="ext-quiet">Cerrar</button>
          </div>
          <p id="ext-assign-title" className="ext-muted"></p>
          <label>Paciente
            <select id="ext-patient-select" required><option value="">Seleccionar paciente…</option></select>
          </label>
          <p className="ext-security">Solo se compartirá el archivo del paciente. El solucionario permanecerá privado. El material aparecerá en «Mi espacio» sin enviar un correo automático.</p>
          <p id="ext-assign-message" role="status" aria-live="polite"></p>
          <button id="ext-assign-confirm" className="ext-primary" type="submit">Compartir en Mi espacio</button>
        </form>
      </dialog>
    </section>
    <Script src="/clinic-external-library.js?v=20261018-preview-4" strategy="afterInteractive" />
  </main>;
}