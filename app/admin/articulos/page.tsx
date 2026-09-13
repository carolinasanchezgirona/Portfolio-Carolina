import Script from "next/script";
import type { Metadata } from "next";
import "./admin-articles.css";

export const metadata: Metadata = {
  title: "Artículos | Administración",
  description: "Gestión privada de artículos.",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminArticlesPage() {
  return (
    <main className="articles-admin-page">
      <section id="articles-login" className="articles-login-shell">
        <form id="articles-login-form" className="articles-login-card">
          <p className="articles-eyebrow">Área privada</p>
          <h1>Artículos</h1>
          <p>Accede con la misma cuenta de tu agenda.</p>
          <label>Correo<input id="articles-email" type="email" autoComplete="username" required /></label>
          <label>Contraseña<input id="articles-password" type="password" autoComplete="current-password" required /></label>
          <p id="articles-login-message" className="articles-message" role="status" />
          <button className="articles-primary" type="submit">Entrar</button>
          <a href="/admin/agenda/" className="articles-back">Volver a agenda</a>
        </form>
      </section>

      <section id="articles-app" className="articles-app" hidden>
        <header className="articles-topbar">
          <div><p className="articles-eyebrow">Administración</p><h1>Artículos</h1><p>Escribe, previsualiza y publica sin tocar código.</p></div>
          <div className="articles-top-actions">
            <a className="articles-secondary" href="/admin/agenda/">Agenda</a>
            <a className="articles-secondary" href="/articulos/" target="_blank" rel="noopener noreferrer">Ver artículos</a>
            <button id="article-new" className="articles-primary" type="button">Nuevo artículo</button>
            <button id="articles-logout" className="articles-text" type="button">Cerrar sesión</button>
          </div>
        </header>

        <div className="articles-workspace">
          <aside className="articles-list-panel">
            <div className="articles-list-heading"><strong>Biblioteca</strong><span id="articles-count">0</span></div>
            <div className="articles-filters">
              <button type="button" data-filter="all" className="active">Todos</button>
              <button type="button" data-filter="draft">Borradores</button>
              <button type="button" data-filter="published">Publicados</button>
            </div>
            <div id="articles-list" className="articles-list" />
          </aside>

          <section className="articles-editor-panel">
            <div id="articles-empty" className="articles-empty">
              <strong>Selecciona un artículo o crea uno nuevo</strong>
              <span>El editor aparecerá aquí.</span>
            </div>

            <form id="article-form" hidden>
              <input id="article-id" type="hidden" />
              <div className="editor-heading">
                <div><p className="articles-eyebrow">Editor</p><h2 id="article-editor-title">Nuevo artículo</h2></div>
                <div className="editor-actions">
                  <button id="article-preview" className="articles-secondary" type="button">Previsualizar</button>
                  <button id="article-save-draft" className="articles-secondary" type="button">Guardar borrador</button>
                  <button id="article-publish" className="articles-primary" type="button">Publicar</button>
                </div>
              </div>

              <label className="field field-title">Título<input id="article-title" type="text" maxLength={180} required placeholder="Título del artículo" /></label>
              <div className="two-cols">
                <label className="field">URL<input id="article-slug" type="text" maxLength={180} required placeholder="se-genera-automaticamente" /></label>
                <label className="field">Categoría<select id="article-category"><option value="neuropsicologia">Neuropsicología</option><option value="psicologia">Psicología</option></select></label>
              </div>
              <label className="field">Entradilla<textarea id="article-excerpt" rows={3} maxLength={420} placeholder="Resumen breve que aparecerá en el listado y en buscadores." /></label>

              <div className="editor-toolbar" aria-label="Formato del artículo">
                <button type="button" data-command="formatBlock" data-value="h2">H2</button>
                <button type="button" data-command="formatBlock" data-value="h3">H3</button>
                <button type="button" data-command="bold"><strong>B</strong></button>
                <button type="button" data-command="italic"><em>I</em></button>
                <button type="button" data-command="insertUnorderedList">Lista</button>
                <button type="button" data-command="createLink">Enlace</button>
                <button type="button" data-command="removeFormat">Limpiar</button>
              </div>
              <div id="article-content" className="rich-editor" contentEditable suppressContentEditableWarning data-placeholder="Escribe aquí el artículo…" />

              <details className="article-settings">
                <summary>SEO y opciones</summary>
                <div className="settings-body">
                  <label className="featured-check"><input id="article-featured" type="checkbox" /><span>Artículo destacado</span></label>
                  <label className="field">Página relacionada<select id="article-related-page"><option value="">Sin enlace automático</option><option value="/psicologia/">Psicología</option><option value="/neuropsicologia/">Neuropsicología</option><option value="/ansiedad/">Ansiedad</option><option value="/duelo/">Duelo</option><option value="/deterioro-cognitivo/">Deterioro cognitivo</option><option value="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</option></select></label>
                  <label className="field">Imagen destacada · URL<input id="article-image-url" type="url" placeholder="Opcional" /></label>
                  <label className="field">Título SEO<input id="article-seo-title" type="text" maxLength={70} /></label>
                  <label className="field">Descripción SEO<textarea id="article-seo-description" rows={3} maxLength={170} /></label>
                </div>
              </details>

              <p id="article-message" className="articles-message" role="status" />
              <div className="editor-footer">
                <span id="article-status-label">Borrador</span>
                <button id="article-delete" className="articles-danger" type="button" hidden>Eliminar</button>
              </div>
            </form>
          </section>
        </div>
      </section>

      <dialog id="article-preview-dialog" className="preview-dialog">
        <div className="preview-shell">
          <button id="preview-close" className="preview-close" type="button" aria-label="Cerrar">×</button>
          <p id="preview-category" className="articles-eyebrow" />
          <h1 id="preview-title" />
          <p id="preview-excerpt" className="preview-excerpt" />
          <article id="preview-content" className="article-prose" />
        </div>
      </dialog>

      <Script src="/admin-articles.js?v=20260913-1" strategy="afterInteractive" />
    </main>
  );
}
