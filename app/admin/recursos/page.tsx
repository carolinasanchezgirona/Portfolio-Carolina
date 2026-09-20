import Script from "next/script";
import type { Metadata } from "next";
import "./recursos.css";

export const metadata: Metadata = {
  title: "Recursos digitales | Administración",
  description: "Gestión privada de recursos digitales.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRecursosPage() {
  return (
    <main className="resources-admin-page">
      <section id="resources-login" className="resources-login-shell">
        <form id="resources-login-form" className="resources-login-card">
          <p className="resources-eyebrow">Área privada</p>
          <h1>Recursos digitales</h1>
          <p>Accede con la misma cuenta de tu agenda y del editor de artículos.</p>
          <label>Correo<input id="resources-email" type="email" autoComplete="username" required /></label>
          <label>Contraseña<input id="resources-password" type="password" autoComplete="current-password" required /></label>
          <p id="resources-login-message" className="resources-message" role="status" />
          <button className="resources-primary" type="submit">Entrar</button>
          <a href="/admin/agenda/" className="resources-back">Volver a agenda</a>
        </form>
      </section>

      <section id="resources-app" className="resources-app" hidden>
        <header className="resources-topbar">
          <div>
            <p className="resources-eyebrow">Administración comercial</p>
            <h1>Recursos digitales</h1>
            <p>Crea y prepara materiales descargables sin publicarlos hasta que el circuito de compra esté activo.</p>
          </div>
          <div className="resources-top-actions">
            <a className="resources-secondary" href="/admin/agenda/">Agenda</a>
            <a className="resources-secondary" href="/admin/articulos/">Artículos</a>
            <a className="resources-secondary" href="/recursos/" target="_blank" rel="noopener noreferrer">Ver recursos</a>
            <button id="resource-new" className="resources-primary" type="button">Nuevo recurso</button>
            <button id="resources-logout" className="resources-text" type="button">Cerrar sesión</button>
          </div>
        </header>

        <div className="resources-workspace">
          <aside className="resources-list-panel">
            <div className="resources-list-heading"><strong>Biblioteca</strong><span id="resources-count">0</span></div>
            <div className="resources-filters">
              <button type="button" data-filter="all" className="active">Todos</button>
              <button type="button" data-filter="draft">Borradores</button>
              <button type="button" data-filter="published">Publicados</button>
              <button type="button" data-filter="archived">Archivados</button>
            </div>
            <div id="resources-list" className="resources-list" />
          </aside>

          <section className="resources-editor-panel">
            <div id="resources-empty" className="resources-empty">
              <strong>Selecciona un recurso o crea uno nuevo</strong>
              <span>La ficha de edición aparecerá aquí.</span>
            </div>

            <form id="resource-form" hidden>
              <input id="resource-id" type="hidden" />
              <div className="resource-editor-heading">
                <div><p className="resources-eyebrow">Ficha de producto</p><h2 id="resource-editor-title">Nuevo recurso</h2></div>
                <div className="resource-editor-actions">
                  <button id="resource-save-draft" className="resources-secondary" type="button">Guardar borrador</button>
                  <button id="resource-publish" className="resources-primary" type="button">Publicar</button>
                </div>
              </div>

              <section className="resource-section">
                <label className="field field-title">Título<input id="resource-title" type="text" maxLength={180} required /></label>
                <label className="field">Subtítulo<input id="resource-subtitle" type="text" maxLength={220} placeholder="Una frase breve que explique el recurso" /></label>
                <div className="two-cols">
                  <label className="field">URL<input id="resource-slug" type="text" maxLength={180} required /></label>
                  <label className="field">Precio (€)<input id="resource-price" type="number" min="0" step="0.01" inputMode="decimal" /></label>
                </div>
                <label className="field">Descripción<textarea id="resource-description" rows={5} maxLength={900} /></label>
                <div className="two-cols">
                  <label className="field">Categoría<select id="resource-category">
                    <option value="psicologia">Psicología</option>
                    <option value="neuropsicologia">Neuropsicología</option>
                    <option value="profesionales">Profesionales</option>
                  </select></label>
                  <label className="field">Dirigido a<select id="resource-audience">
                    <option value="general">Público general</option>
                    <option value="pacientes">Pacientes</option>
                    <option value="familias">Familias y cuidadores</option>
                    <option value="profesionales">Profesionales</option>
                  </select></label>
                </div>
                <div className="two-cols">
                  <label className="field">Formato<input id="resource-format" type="text" maxLength={80} placeholder="Cuaderno descargable" /></label>
                  <label className="featured-check"><input id="resource-featured" type="checkbox" /><span>Destacar recurso</span></label>
                </div>
              </section>

              <section className="resource-section">
                <div className="section-heading"><div><p className="resources-eyebrow">Archivos</p><h3>Portada y material descargable</h3></div></div>
                <div className="resource-media-grid">
                  <div>
                    <div id="resource-cover-preview" className="resource-cover-preview"><span>Sin portada</span></div>
                    <label className="resources-secondary upload-label">Subir portada<input id="resource-cover-file" type="file" accept="image/jpeg,image/png,image/webp" hidden /></label>
                  </div>
                  <div className="resource-file-fields">
                    <label className="field">URL de portada<input id="resource-cover-url" type="url" readOnly /></label>
                    <label className="field">Texto ALT<input id="resource-cover-alt" type="text" maxLength={180} /></label>
                    <label className="field">PDF / archivo descargable
                      <input id="resource-download-file" type="file" accept=".pdf,.docx,.zip" />
                    </label>
                    <div id="resource-file-state" className="resource-file-state">Todavía no hay archivo subido.</div>
                    <input id="resource-file-path" type="hidden" />
                  </div>
                </div>
              </section>

              <section className="resource-section">
                <div className="section-heading"><div><p className="resources-eyebrow">Conexiones internas</p><h3>Relacionar con la web</h3></div></div>
                <label className="field">Página relacionada<select id="resource-related-page">
                  <option value="">Sin página relacionada</option>
                  <optgroup label="Psicología">
                    <option value="/psicologia/">Psicología General Sanitaria</option>
                    <option value="/ansiedad/">Ansiedad</option>
                    <option value="/rumiacion-y-pensamientos-repetitivos/">Rumiación y pensamientos repetitivos</option>
                    <option value="/insomnio-y-dificultades-para-dormir/">Insomnio y dificultades para dormir</option>
                    <option value="/duelo/">Duelo y pérdidas</option>
                    <option value="/autoestima-y-autocritica/">Autoestima y autocrítica</option>
                  </optgroup>
                  <optgroup label="Neuropsicología">
                    <option value="/neuropsicologia/">Neuropsicología</option>
                    <option value="/problemas-de-memoria/">Problemas de memoria</option>
                    <option value="/deterioro-cognitivo/">Deterioro cognitivo</option>
                    <option value="/estimulacion-cognitiva/">Estimulación cognitiva</option>
                    <option value="/familiares-y-cuidadores-de-personas-con-demencia/">Familiares y cuidadores</option>
                  </optgroup>
                </select></label>
                <label className="field">Artículo relacionado<select id="resource-related-article"><option value="">Sin artículo relacionado</option></select></label>
              </section>

              <section className="resource-section">
                <div className="section-heading"><div><p className="resources-eyebrow">SEO</p><h3>Presentación en buscadores</h3></div></div>
                <label className="field">Título SEO<input id="resource-seo-title" type="text" maxLength={70} /></label>
                <label className="field">Descripción SEO<textarea id="resource-seo-description" rows={3} maxLength={170} /></label>
              </section>

              <div className="resource-footer">
                <div><span id="resource-status-label">Borrador</span><p id="resource-message" className="resources-message" role="status" /></div>
                <div>
                  <button id="resource-archive" className="resources-secondary" type="button" hidden>Archivar</button>
                  <button id="resource-delete" className="resources-danger" type="button" hidden>Eliminar</button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </section>

      <Script src="/admin-resources.js?v=20260920-1" strategy="afterInteractive" />
    </main>
  );
}
