import LegalLinks from "../components/legal-links";
import type { Metadata } from "next";
import Script from "next/script";
import "./mi-espacio.css";

export const metadata: Metadata = {
  title: "Mi espacio",
  description: "Área privada de ejercicios y seguimiento terapéutico entre sesiones de Carolina Sánchez.",
  robots: { index: false, follow: false, nocache: true },
};

export default function MiEspacioPage() {
  return (
    <main className="space-page" data-portal-phase="checking">
      <header className="space-topbar">
        <a className="space-brand" href="/" aria-label="Carolina Sánchez, inicio">
          <span className="space-brand-name">Carolina Sánchez</span>
          <span className="space-brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <div className="space-topbar-title">
          <span className="space-topbar-dot" aria-hidden="true" />
          Mi espacio
        </div>
      </header>

      <section id="space-session-check" className="space-session-check" aria-live="polite">
        <div className="space-session-check-card" role="status">
          <span className="space-session-check-icon" aria-hidden="true" />
          <h1>Comprobando tu acceso seguro</h1>
          <p>Estamos verificando si tu sesión sigue activa. No necesitas volver a escribir la contraseña mientras se comprueba.</p>
          <p className="space-session-check-help">¿Tarda demasiado? <a href="">Actualizar la página</a></p>
          <noscript>Para entrar en Mi espacio necesitas activar JavaScript en el navegador.</noscript>
        </div>
      </section>

      <section id="space-access" className="space-access" hidden>
        <div className="space-access-card">
          <div>
            <p className="space-eyebrow">Acceso seguro</p>
            <h1>Entra en Mi espacio</h1>
            <p>Identifícate con el correo de tu ficha de paciente y tu contraseña.</p>
          </div>

          <form id="space-login-form" className="space-access-form">
            <label htmlFor="space-login-email">Correo electrónico</label>
            <input id="space-login-email" name="email" type="email" autoComplete="username" inputMode="email" required maxLength={254} placeholder="tu@email.com" />
            <label htmlFor="space-login-password">Contraseña</label>
            <input id="space-login-password" name="password" type="password" autoComplete="current-password" required minLength={1} maxLength={128} />
            <button className="space-primary" type="submit">Entrar en Mi espacio</button>
            <button className="space-text-action" id="space-forgot-password" type="button">He olvidado mi contraseña</button>
            <button className="space-text-action" id="space-first-access" type="button">Es mi primera vez. Recibir enlace por correo</button>
          </form>

          <form id="space-email-form" className="space-access-form" hidden>
            <h2 id="space-email-title">Solicitar acceso</h2>
            <p id="space-email-description" className="space-small">Te enviaremos un enlace para configurar tu contraseña.</p>
            <label htmlFor="space-access-email">Correo electrónico</label>
            <input id="space-access-email" type="email" autoComplete="email" inputMode="email" required maxLength={254} placeholder="tu@email.com" />
            <button className="space-primary" type="submit">Enviar enlace seguro</button>
            <button className="space-text-action" type="button" data-back-to-login>Volver al inicio de sesión</button>
          </form>

          <form id="space-set-password-form" className="space-access-form" hidden>
            <h2>Configura tu contraseña</h2>
            <p className="space-small">Tu correo ya se ha verificado mediante el enlace recibido. Elige una contraseña de al menos 12 caracteres.</p>
            <label htmlFor="space-setup-email">Correo electrónico</label>
            <input id="space-setup-email" type="email" autoComplete="username" required maxLength={254} />
            <label htmlFor="space-new-password">Nueva contraseña</label>
            <input id="space-new-password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
            <label htmlFor="space-confirm-password">Repite la contraseña</label>
            <input id="space-confirm-password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
            <button className="space-primary" type="submit">Guardar contraseña</button>
            <button className="space-text-action" type="button" data-back-to-login>Volver al inicio de sesión</button>
          </form>

          <p id="space-access-message" className="space-access-message" role="status" aria-live="polite" />
          <button id="space-open-panel" className="space-primary" type="button" hidden>Abrir Mi espacio en otra pestaña</button>

          <div className="space-access-foot"><p>Responsable: Carolina Sánchez Girona (Dememoria). Usamos tu correo para identificarte y darte acceso al servicio, sobre la base de su prestación y, cuando corresponda, la asistencia sanitaria. Más información y ejercicio de derechos en la política de privacidad.</p><LegalLinks /></div>
          <p className="space-access-foot">Los enlaces de configuración solo sirven una vez. Nadie puede ver tus materiales clínicos hasta que te identifiques correctamente.</p>
        </div>
      </section>

      <div id="space-shell" className="space-shell" hidden>
        <aside className="space-sidebar" aria-label="Navegación de Mi espacio">
          <div>
            <p className="space-eyebrow">Tu espacio personal</p>
            <h1>Mi espacio</h1>
            <p className="space-sidebar-copy">Tus ejercicios, materiales y seguimiento terapéutico en un espacio privado.</p>
          </div>

          <nav className="space-nav" aria-label="Secciones">
            <button className="is-active" type="button" data-space-view="today">Hoy</button>
            <button type="button" data-space-view="therapy">Mi terapia</button>
            <button type="button" data-space-view="account">Configuración</button>
          </nav>

          <div className="space-sidebar-note">
            <strong>Acceso privado</strong>
            <span>Solo tú puedes consultar los materiales que se han compartido contigo.</span>
          </div>
        </aside>

        <section className="space-content">
          <section className="space-view" data-space-panel="today" hidden>
            <div className="space-hero">
              <p className="space-eyebrow">Hoy</p>
              <h2 id="space-today-title">Un espacio para ti</h2>
              <p>Tu recorrido, paso a paso y recursos para continuar lo trabajado en consulta, a tu ritmo.</p>
            </div>

            <div className="space-quick-start">
              <div>
                <p className="space-eyebrow">Mi terapia</p>
                <h3>Tus ejercicios, a mano</h3>
                <p id="space-quick-material-count">Aquí encontrarás los materiales compartidos contigo para trabajar entre sesiones.</p>
              </div>
              <button type="button" className="space-primary" data-go-therapy>Ir a mis ejercicios →</button>
            </div>

            <section id="space-session-prep" className="space-session-prep" aria-labelledby="space-session-prep-title" tabIndex={-1}>
              <div className="space-session-prep-head">
                <div>
                  <p className="space-eyebrow">ANTES DE NUESTRA PRÓXIMA SESIÓN</p>
                  <h3 id="space-session-prep-title">Hay cosas que merece la pena traer a consulta.</h3>
                  <p>Tres preguntas para ordenar lo que quieras comentar. Puedes dejar cualquiera en blanco.</p>
                </div>
                <span className="space-session-prep-icon" aria-hidden="true">✎</span>
              </div>
              <form id="space-session-prep-form" className="space-session-prep-form" autoComplete="off">
                <label htmlFor="space-prep-difficult">
                  <strong>01 · ¿Qué me ha costado?</strong>
                  <span>Algo que haya sido difícil, aunque parezca pequeño.</span>
                </label>
                <textarea id="space-prep-difficult" rows={3} maxLength={900} placeholder="Si quieres, anótalo aquí…" />
                <label htmlFor="space-prep-helped">
                  <strong>02 · ¿Qué me ha ayudado?</strong>
                  <span>Una estrategia, un momento o un apoyo que hayas notado.</span>
                </label>
                <textarea id="space-prep-helped" rows={3} maxLength={900} placeholder="Puedes escribir unas pocas palabras…" />
                <label htmlFor="space-prep-talk">
                  <strong>03 · ¿De qué me gustaría hablar?</strong>
                  <span>Una duda o algo que prefieras abordar en la siguiente sesión.</span>
                </label>
                <textarea id="space-prep-talk" rows={3} maxLength={900} placeholder="Una pregunta, una preocupación, un tema…" />
                <div className="space-session-prep-actions">
                  <button id="space-prep-preview-button" type="button" className="space-primary">Ver mi resumen</button>
                  <button id="space-prep-clear" type="button" className="space-secondary">Descartar notas</button>
                </div>
              </form>
              <div id="space-session-prep-preview" className="space-session-prep-preview" hidden aria-live="polite">
                <h4>Lo que quiero recordar</h4>
                <div id="space-session-prep-summary" className="space-session-prep-summary" />
                <div className="space-session-prep-transfer">
                  <label htmlFor="space-session-prep-target">Si quieres guardarlo o compartirlo desde un ejercicio:</label>
                  <select id="space-session-prep-target">
                    <option value="">Selecciona un ejercicio disponible</option>
                  </select>
                  <button id="space-session-prep-insert" type="button" className="space-primary">Incorporar al ejercicio</button>
                  <button id="space-session-prep-copy" type="button" className="space-secondary">Copiar resumen</button>
                  <p className="space-small">Incorporar el resumen no lo guarda ni lo comparte. Después tendrás que elegir expresamente «Guardar borrador» o «Compartir respuestas» en Mi terapia. Copiar utiliza el portapapeles de tu dispositivo.</p>
                </div>
              </div>
              <p id="space-session-prep-message" className="space-session-prep-message" role="status" aria-live="polite" />
              <p className="space-session-prep-privacy"><strong>Solo tú decides.</strong> Estas notas se mantienen únicamente en esta pantalla mientras la usas. No se guardan automáticamente ni se envían a Carolina; se descartan al cerrar la página o salir de tu cuenta.</p>
            </section>

            <aside className="space-membership-note">
              <strong>Acceso incluido durante la terapia</strong>
              <p>Durante tu proceso terapéutico puedes acceder a los ejercicios y documentos que se compartan contigo.</p>
            </aside>

            <div className="space-grid space-dashboard-grid">
              <article className="space-card space-card-therapy">
                <div>
                  <p className="space-kicker">Mi terapia</p>
                  <h3>Trabajo entre sesiones</h3>
                  <p id="space-therapy-status">Si Carolina te ha enviado material, puedes acceder desde aquí.</p>
                </div>
                <button id="space-between-link" className="space-primary" type="button" data-go-therapy>Ver mi terapia</button>
              </article>

            </div>

          </section>

          <section className="space-view" data-space-panel="therapy" hidden>
            <div className="space-hero">
              <p className="space-eyebrow">Mi terapia</p>
              <h2>Tu trabajo entre sesiones</h2>
              <p>Consulta tus ejercicios, rellena tus respuestas aquí mismo y decide cuándo compartirlas con Carolina. Las notas clínicas internas permanecen fuera de esta zona.</p>
            </div>

            <section className="space-section space-materials-section">
              <div className="space-section-heading">
                <div><p className="space-eyebrow">Entre sesiones</p><h3>Mis ejercicios y materiales</h3></div>
                <span id="space-material-count" className="space-pill">Acceso privado</span>
              </div>
              <div id="space-patient-materials" className="space-patient-materials">
                <div className="space-empty">Inicia sesión para ver tus materiales.</div>
              </div>
            </section>

            <section className="space-section space-materials-section" aria-labelledby="space-shared-files-title">
              <div className="space-section-heading">
                <div><p className="space-eyebrow">Archivos de tu consulta</p><h3 id="space-shared-files-title">Documentos y audios compartidos contigo</h3></div>
                <span id="space-shared-file-count" className="space-pill">Acceso privado</span>
              </div>
              <p>Consulta o descarga únicamente los archivos que Carolina haya decidido compartir contigo.</p>
              <div id="space-shared-files" className="space-patient-materials">
                <div className="space-empty">Inicia sesión para acceder a tus archivos.</div>
              </div>
            </section>

            <div className="space-grid space-feature-grid">
              <article id="space-appointment-card" className="space-card space-card-active">
                <p className="space-kicker">Próxima cita</p>
                <h3 id="space-appointment-title">Accede para ver tu próxima cita</h3>
                <p id="space-appointment-copy">La información de agenda solo se muestra después de identificarte.</p>
              </article>

              <article className="space-card space-card-guide">
                <p className="space-kicker">Cómo funciona</p>
                <h3>Avanza a tu ritmo</h3>
                <p>Completa tus ejercicios paso a paso. Puedes guardar un borrador y elegir cuándo compartir tus respuestas.</p>
                <span className="space-pill">Sin prisas</span>
              </article>
            </div>



            <aside className="space-info-note">
              <strong>Privacidad por diseño</strong>
              <p>Tus respuestas solo se comparten con Carolina cuando eliges «Compartir respuestas». También puedes guardar un borrador y continuar más adelante.</p>
            </aside>
          </section>

          <section className="space-view" data-space-panel="account" hidden>
            <div className="space-hero">
              <p className="space-eyebrow">Cuenta y privacidad</p>
              <h2>Mi configuración y privacidad</h2><LegalLinks />
              <p>Los documentos clínicos se muestran únicamente tras identificarte. Los ajustes de lectura se guardan en este dispositivo, separados por cuenta.</p>
            </div>

            <section className="space-reading-preferences" aria-labelledby="space-reading-title">
              <div>
                <p className="space-eyebrow">Accesibilidad · A tu manera</p>
                <h3 id="space-reading-title">Una lectura más cómoda</h3>
                <p>Adapta el texto y la presentación a lo que te resulte más sencillo. Los ajustes se guardan solo en este dispositivo y se separan por cuenta.</p>
              </div>
              <div className="space-reading-fields">
                <label htmlFor="space-reading-size">Tamaño del texto
                  <select id="space-reading-size" defaultValue="normal">
                    <option value="normal">Normal</option>
                    <option value="large">Grande</option>
                    <option value="extra">Muy grande</option>
                  </select>
                </label>
                <label className="space-reading-checkbox" htmlFor="space-reading-simple">
                  <input id="space-reading-simple" type="checkbox" />
                  <span><strong>Lectura tranquila</strong><small>Más espacio entre líneas y bloques de texto más despejados.</small></span>
                </label>
                <label className="space-reading-checkbox" htmlFor="space-reading-motion">
                  <input id="space-reading-motion" type="checkbox" />
                  <span><strong>Reducir movimiento</strong><small>Evita movimientos y transiciones decorativas dentro del espacio personal.</small></span>
                </label>
              </div>
              <p id="space-reading-feedback" role="status" aria-live="polite" className="space-small" />
            </section>


            <div className="space-grid space-feature-grid">
              <article className="space-card">
                <p className="space-kicker">Mi terapia</p>
                <h3>Acceso protegido</h3>
                <p>El primer acceso y la recuperación requieren verificar el correo. Después se entra con contraseña; la sesión se conserva en una cookie segura que no puede leer el JavaScript de la página.</p>
              </article>
              <article className="space-card">
                <p className="space-kicker">Futuras conexiones</p>
                <h3>Permisos explícitos</h3>
                <p>Citas, documentos y actividades prescritas se conectarán con permisos separados antes de mostrar información personal.</p>
              </article>
            </div>

            <div className="space-account-actions">
              <button id="space-clear-local" className="space-danger-link" type="button">Borrar datos locales anteriores y preferencias de lectura</button>
              <button id="space-logout" className="space-danger-link" type="button">Cerrar sesión de Mi espacio</button>
            </div>
            <p id="space-clear-message" className="space-small" role="status" />
          </section>
        </section>
      </div>

      <aside className="space-safety">
        <strong>Este espacio no es un servicio de urgencias.</strong>
        <span>Si existe una emergencia, llama al 112. Si hay riesgo o ideación suicida, puedes contactar con el 024.</span>
      </aside>

      <Script src="/patient-video.js?v=20261009-1" strategy="afterInteractive" />
      <Script src="/mi-espacio.js?v=20261105-clinical-only-1" strategy="afterInteractive" />
      <Script src="/session-prep.js?v=20261017-1" strategy="afterInteractive" />
    </main>
  );
}
