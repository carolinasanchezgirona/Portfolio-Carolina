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
          <div>
            <p className="articles-eyebrow">Administración editorial</p>
            <h1>Artículos</h1>
            <p>Escribe, diseña, revisa y publica manteniendo una presentación coherente.</p>
          </div>
          <div className="articles-top-actions">
            <a className="articles-secondary" href="/admin/agenda/">Agenda</a>
            <a className="articles-secondary" href="/admin/recursos/">Recursos</a>
            <a className="articles-secondary" href="/admin/preguntas/">Preguntas</a>
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
              <button type="button" data-filter="scheduled">Programados</button>
              <button type="button" data-filter="published">Publicados</button>
            </div>
            <div id="articles-list" className="articles-list" />
          </aside>

          <section className="articles-editor-panel">
            <div id="articles-empty" className="articles-empty">
              <strong>Selecciona un artículo o crea uno nuevo</strong>
              <span>El editor editorial aparecerá aquí.</span>
            </div>

            <form id="article-form" hidden>
              <input id="article-id" type="hidden" />
              <div className="editor-heading">
                <div><p className="articles-eyebrow">Editor</p><h2 id="article-editor-title">Nuevo artículo</h2></div>
                <div className="editor-actions">
                  <button id="article-preview" className="articles-secondary" type="button">Previsualizar</button>
                  <button id="article-save-draft" className="articles-secondary" type="button">Guardar borrador</button>
                  <button id="article-schedule" className="articles-secondary" type="button">Programar</button>
                  <button id="article-publish" className="articles-primary" type="button">Publicar</button>
                </div>
              </div>

              <section className="editor-section editor-section-main">
                <label className="field field-title">Título<input id="article-title" type="text" maxLength={180} required placeholder="Título del artículo" /></label>
                <label className="field field-subtitle">
                  <span>Subtítulo / bajada <small id="subtitle-count">0/220</small></span>
                  <textarea id="article-subtitle" rows={3} maxLength={220} placeholder="Amplía la idea del título sin repetirlo. Puede aportar contexto, una pregunta o el ángulo clínico del artículo." />
                </label>
                <div className="two-cols">
                  <label className="field">URL<input id="article-slug" type="text" maxLength={180} required placeholder="se-genera-automaticamente" /></label>
                  <label className="field">Categoría<select id="article-category"><option value="neuropsicologia">Neuropsicología</option><option value="psicologia">Psicología</option></select></label>
                </div>
                <label className="field"><span>Entradilla <small id="excerpt-count">0/420</small></span><textarea id="article-excerpt" rows={4} maxLength={420} placeholder="Resume qué encontrará el lector. Esta entradilla también puede aparecer en listados y buscadores." /></label>
              </section>

              <section className="editor-section">
                <div className="section-heading"><div><p className="articles-eyebrow">Cuerpo</p><h3>Contenido del artículo</h3></div><span id="reading-time">0 min de lectura</span></div>
                <div className="editor-toolbar" aria-label="Formato del artículo">
                  <select id="toolbar-block" aria-label="Tipo de bloque"><option value="p">Párrafo</option><option value="h2">H2</option><option value="h3">H3</option><option value="blockquote">Cita</option></select>
                  <select id="toolbar-font" aria-label="Estilo tipográfico"><option value="">Fuente</option><option value="Georgia">Editorial</option><option value="Inter">Sans</option></select>
                  <select id="toolbar-size" aria-label="Tamaño"><option value="3">Normal</option><option value="2">Pequeño</option><option value="5">Grande</option><option value="6">Destacado</option></select>
                  <span className="toolbar-separator" />
                  <button type="button" data-command="bold" title="Negrita"><strong>B</strong></button>
                  <button type="button" data-command="italic" title="Cursiva"><em>I</em></button>
                  <button type="button" data-command="underline" title="Subrayado"><u>U</u></button>
                  <button type="button" data-command="strikeThrough" title="Tachado"><s>S</s></button>
                  <button type="button" data-command="hiliteColor" data-value="#fff1a8" title="Resaltar">Resaltar</button>
                  <span className="toolbar-separator" />
                  <button type="button" data-command="insertUnorderedList">• Lista</button>
                  <button type="button" data-command="insertOrderedList">1. Lista</button>
                  <button type="button" data-action="link">Enlace</button>
                  <button type="button" data-command="justifyLeft" title="Alinear izquierda">←</button>
                  <button type="button" data-command="justifyCenter" title="Centrar">↔</button>
                  <button type="button" data-command="justifyRight" title="Alinear derecha">→</button>
                  <button type="button" data-command="insertHorizontalRule">Separador</button>
                  <span className="toolbar-separator" />
                  <select id="inline-image-position" aria-label="Posición de imagen"><option value="wide">Imagen: ancho</option><option value="center">centrada</option><option value="left">izquierda</option><option value="right">derecha</option></select>
                  <button id="inline-image-button" type="button">Insertar foto</button>
                  <button id="insert-references" type="button">Referencias</button>
                  <span className="toolbar-separator" />
                  <button type="button" data-command="undo" title="Deshacer">↶</button>
                  <button type="button" data-command="redo" title="Rehacer">↷</button>
                  <button type="button" data-command="removeFormat">Limpiar</button>
                </div>
                <input id="inline-image-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden />
                <div id="article-content" className="rich-editor" contentEditable suppressContentEditableWarning data-placeholder="Escribe aquí el artículo…" />
                <p className="field-help">Las fotografías pueden ir a ancho completo, centradas o flotando a izquierda/derecha. En móvil se adaptarán automáticamente.</p>
              </section>

              <section className="editor-section media-settings">
                <div className="section-heading"><div><p className="articles-eyebrow">Imagen y apariencia</p><h3>Portada del artículo</h3></div></div>
                <div className="media-grid">
                  <div>
                    <div id="featured-image-preview" className="featured-image-preview"><span>Sin imagen de portada</span></div>
                    <div className="media-actions"><label className="articles-secondary upload-label">Subir imagen<input id="article-image-file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden /></label><button id="article-image-remove" className="articles-text" type="button">Quitar</button></div>
                  </div>
                  <div>
                    <label className="field">URL de imagen<input id="article-image-url" type="url" placeholder="Se completa al subir una imagen" /></label>
                    <label className="field">Texto ALT<input id="article-image-alt" type="text" maxLength={180} placeholder="Describe brevemente lo que muestra la imagen" /></label>
                    <label className="field">Pie de foto<input id="article-image-caption" type="text" maxLength={220} placeholder="Opcional" /></label>
                  </div>
                </div>
              </section>

              <details className="article-settings" open>
                <summary>SEO, enlaces y publicación</summary>
                <div className="settings-body">
                  <div className="settings-grid">
                    <div>
                      <label className="featured-check"><input id="article-featured" type="checkbox" /><span>Artículo destacado</span></label>
                      <label className="field">Etiquetas<input id="article-tags" type="text" placeholder="memoria, ansiedad, atención" /></label>
                      <label className="field">Página relacionada<select id="article-related-page">
                        <option value="">Selección automática</option>
                        <optgroup label="Psicología">
                          <option value="/psicologia/">Psicología General Sanitaria</option>
                          <option value="/ansiedad/">Ansiedad</option>
                          <option value="/ataques-de-panico/">Ataques de pánico</option>
                          <option value="/depresion/">Depresión y bajo estado de ánimo</option>
                          <option value="/duelo/">Duelo y pérdidas</option>
                          <option value="/rumiacion-y-pensamientos-repetitivos/">Rumiación y pensamientos repetitivos</option>
                          <option value="/estres-y-sobrecarga/">Estrés y sobrecarga</option>
                          <option value="/insomnio-y-dificultades-para-dormir/">Insomnio y dificultades para dormir</option>
                          <option value="/autoestima-y-autocritica/">Autoestima y autocrítica</option>
                          <option value="/perfeccionismo-y-autoexigencia/">Perfeccionismo y autoexigencia</option>
                          <option value="/rupturas-de-pareja/">Rupturas de pareja</option>
                          <option value="/limites-y-relaciones-dificiles/">Límites y relaciones difíciles</option>
                          <option value="/cambios-vitales-y-adaptacion/">Cambios vitales y adaptación</option>
                          <option value="/ansiedad-social-y-miedo-al-ridiculo/">Ansiedad social</option>
                          <option value="/toc-obsesiones-y-compulsiones/">TOC, obsesiones y compulsiones</option>
                          <option value="/trauma-psicologico-y-estres-postraumatico/">Trauma psicológico y estrés postraumático</option>
                        </optgroup>
                        <optgroup label="Neuropsicología">
                          <option value="/neuropsicologia/">Neuropsicología</option>
                          <option value="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</option>
                          <option value="/problemas-de-memoria/">Problemas de memoria</option>
                          <option value="/deterioro-cognitivo/">Deterioro cognitivo</option>
                          <option value="/alzheimer-primeros-sintomas-y-evaluacion/">Alzheimer: primeros síntomas y evaluación</option>
                          <option value="/demencias/">Demencias</option>
                          <option value="/estimulacion-cognitiva/">Estimulación cognitiva</option>
                          <option value="/rehabilitacion-neuropsicologica/">Rehabilitación neuropsicológica</option>
                          <option value="/ictus-y-dano-cerebral-adquirido/">Ictus y daño cerebral adquirido</option>
                          <option value="/parkinson-y-cambios-cognitivos/">Parkinson y cambios cognitivos</option>
                          <option value="/familiares-y-cuidadores-de-personas-con-demencia/">Familiares y cuidadores</option>
                        </optgroup>
                        <optgroup label="Consulta">
                          <option value="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</option>
                          <option value="/sobre-mi/">Sobre mí</option>
                        </optgroup>
                      </select></label>
                      <div className="two-cols"><label className="field">CTA · texto<input id="article-cta-label" type="text" maxLength={80} placeholder="Pedir cita" /></label><label className="field">CTA · enlace<input id="article-cta-url" type="text" maxLength={240} placeholder="/cita/" /></label></div>
                      <label className="field">Programar publicación<input id="article-scheduled-at" type="datetime-local" /></label>
                    </div>
                    <div>
                      <label className="field"><span>Título SEO <small id="seo-title-count">0/60</small></span><input id="article-seo-title" type="text" maxLength={70} /></label>
                      <label className="field"><span>Descripción SEO <small id="seo-description-count">0/160</small></span><textarea id="article-seo-description" rows={4} maxLength={170} /></label>
                      <div className="google-preview" aria-label="Vista previa de Google"><span>carolinasanchezgirona.com › articulos</span><strong id="seo-preview-title">Título del artículo</strong><p id="seo-preview-description">La descripción SEO aparecerá aquí.</p></div>
                    </div>
                  </div>
                </div>
              </details>

              <section className="quality-panel">
                <div className="section-heading"><div><p className="articles-eyebrow">Control editorial</p><h3>Antes de publicar</h3></div><strong id="quality-summary">0 comprobaciones</strong></div>
                <div id="quality-checklist" className="quality-checklist" />
              </section>

              <p id="article-message" className="articles-message" role="status" />
              <div className="editor-footer"><span id="article-status-label">Borrador</span><button id="article-delete" className="articles-danger" type="button" hidden>Eliminar</button></div>
            </form>
          </section>
        </div>
      </section>

      <dialog id="article-preview-dialog" className="preview-dialog">
        <div className="preview-toolbar"><div><strong>Previsualización</strong><span>Aspecto aproximado en la web pública</span></div><div><button id="preview-desktop" className="active" type="button">Escritorio</button><button id="preview-mobile" type="button">Móvil</button><button id="preview-close" className="preview-close" type="button" aria-label="Cerrar">×</button></div></div>
        <div id="preview-frame" className="preview-frame">
          <div className="preview-shell">
            <p id="preview-category" className="articles-eyebrow" />
            <h1 id="preview-title" />
            <p id="preview-subtitle" className="preview-subtitle" />
            <p id="preview-excerpt" className="preview-excerpt" />
            <figure id="preview-figure" className="preview-figure" hidden><img id="preview-image" alt="" /><figcaption id="preview-image-caption" /></figure>
            <article id="preview-content" className="article-prose" />
            <div id="preview-cta" className="preview-cta" hidden />
          </div>
        </div>
      </dialog>

      <Script src="/admin-articles.js?v=20260913-editor-2" strategy="afterInteractive" />
    </main>
  );
}
