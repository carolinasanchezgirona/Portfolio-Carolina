import type { Metadata } from "next";
import Script from "next/script";
import "./mi-espacio.css";
import MoodTracker from "./mood-tracker";

export const metadata: Metadata = {
  title: "Mi espacio",
  description: "Área personal de bienestar y trabajo entre sesiones de Carolina Sánchez.",
  robots: { index: false, follow: false, nocache: true },
};

export default function MiEspacioPage() {
  return (
    <main className="space-page">
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

      <section id="space-access" className="space-access">
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
          <div className="space-access-divider"><span>o</span></div>
          <button id="space-wellness-guest" className="space-wellness-guest" type="button">Entrar en Wellness sin iniciar sesión</button>
          <p className="space-access-foot">Los enlaces de configuración solo sirven una vez. Nadie puede ver tus materiales clínicos hasta que te identifiques correctamente.</p>
        </div>
      </section>

      <div id="space-shell" className="space-shell" hidden>
        <aside className="space-sidebar" aria-label="Navegación de Mi espacio">
          <div>
            <p className="space-eyebrow">Tu espacio personal</p>
            <h1>Mi espacio</h1>
            <p className="space-sidebar-copy">Bienestar, trabajo entre sesiones y herramientas para el día a día.</p>
          </div>

          <nav className="space-nav" aria-label="Secciones">
            <button className="is-active" type="button" data-space-view="today">Hoy</button>
            <button type="button" data-space-view="therapy">Mi terapia</button>
            <button type="button" data-space-view="wellness">Wellness</button>
            <button type="button" data-space-view="progress">Mi progreso</button>
            <button type="button" data-space-view="account">Cuenta y privacidad</button>
          </nav>

          <div className="space-sidebar-note">
            <strong>Un espacio, dos funciones</strong>
            <span>La parte clínica y Wellness están separadas para proteger tu intimidad.</span>
          </div>
        </aside>

        <section className="space-content">
          <section className="space-view" data-space-panel="today">
            <div className="space-hero">
              <p className="space-eyebrow">Hoy</p>
              <h2 id="space-today-title">Un espacio para ti</h2>
              <p>Herramientas para tu bienestar y recursos para continuar lo trabajado en consulta, a tu ritmo.</p>
            </div>

            <div className="space-quick-start">
              <div>
                <p className="space-eyebrow">Mi terapia</p>
                <h3>Tus ejercicios, a mano</h3>
                <p id="space-quick-material-count">Aquí encontrarás los materiales compartidos contigo para trabajar entre sesiones.</p>
              </div>
              <button type="button" className="space-primary" data-go-therapy>Ir a mis ejercicios →</button>
            </div>

            <MoodTracker />

            <div className="space-needs-heading">
              <div><p className="space-eyebrow">A tu ritmo</p><h3>¿Qué necesitas ahora?</h3></div>
              <span>Elige según lo que te apetezca trabajar.</span>
            </div>
            <div className="space-needs" aria-label="Necesidades de hoy">
              <button type="button" data-need="calmarme"><span aria-hidden="true">◌</span><strong>Calmarme</strong><small>Bajar activación</small></button>
              <button type="button" data-need="rumiacion"><span aria-hidden="true">↻</span><strong>Dejar de darle vueltas</strong><small>Salir del bucle</small></button>
              <button type="button" data-need="entender"><span aria-hidden="true">◇</span><strong>Entender lo que siento</strong><small>Ponerle palabras</small></button>
              <button type="button" data-need="energia"><span aria-hidden="true">↟</span><strong>Recuperar energía</strong><small>Empezar pequeño</small></button>
              <button type="button" data-need="orden"><span aria-hidden="true">☷</span><strong>Ordenar mi cabeza</strong><small>Menos ruido, siguiente paso</small></button>
              <button type="button" data-need="concentrarme"><span aria-hidden="true">◎</span><strong>Concentrarme</strong><small>Volver a una tarea</small></button>
              <button type="button" data-need="limites"><span aria-hidden="true">⊣</span><strong>Poner un límite</strong><small>Claridad sin pelea</small></button>
              <button type="button" data-need="desconectar"><span aria-hidden="true">☾</span><strong>Desconectar</strong><small>Cerrar el día</small></button>
            </div>

            <div className="space-grid space-dashboard-grid">
              <article className="space-card space-card-therapy">
                <div>
                  <p className="space-kicker">Mi terapia</p>
                  <h3>Trabajo entre sesiones</h3>
                  <p id="space-therapy-status">Si Carolina te ha enviado material, puedes acceder desde aquí.</p>
                </div>
                <button id="space-between-link" className="space-primary" type="button" data-go-therapy>Ver mi terapia</button>
              </article>

              <article className="space-card">
                <p className="space-kicker">Wellness</p>
                <h3>Tu herramienta de hoy</h3>
                <p>Una intervención breve, práctica y sin necesidad de convertir cada mal día en un problema clínico.</p>
                <button className="space-secondary" type="button" data-open-featured>Ver recomendación</button>
              </article>
            </div>

            <section className="space-section">
              <div className="space-section-heading">
                <div><p className="space-eyebrow">Rutinas</p><h3>Cuando no quieres pensar qué elegir</h3></div>
              </div>
              <div className="space-routines">
                <button type="button" data-routine="cabeza-llena"><strong>Tengo la cabeza llena</strong><span>6 min · descargar + priorizar</span></button>
                <button type="button" data-routine="desconectar-trabajo"><strong>Quiero desconectar del trabajo</strong><span>7 min · cierre + transición</span></button>
                <button type="button" data-routine="antes-empezar"><strong>No consigo empezar</strong><span>5 min · activación + foco</span></button>
                <button type="button" data-routine="bajar-revoluciones"><strong>Voy demasiado acelerada</strong><span>6 min · cuerpo + atención</span></button>
              </div>
            </section>
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
              <p>Tu actividad libre en Wellness no se incorpora automáticamente a tu historia clínica. Cuando una herramienta sea prescrita en terapia, definiremos de forma explícita qué dato se comparte y cuál permanece privado.</p>
            </aside>
          </section>

          <section className="space-view" data-space-panel="wellness" hidden>
            <div className="space-hero">
              <p className="space-eyebrow">Wellness</p>
              <h2>Herramientas para tu bienestar</h2>
              <p>Propuestas prácticas para explorar emociones, entrenar habilidades cognitivas y cuidar tu día a día. No sustituyen la evaluación ni la intervención clínica.</p>
            </div>

            <details className="space-learning-card">
              <summary><span className="space-learning-icon" aria-hidden="true">◎</span><span><strong>Comprender lo que nos pasa</strong><small>Una explicación visual, sencilla y sin etiquetas</small></span><span aria-hidden="true">+</span></summary>
              <div className="space-learning-body">
                <p>Podemos observar una situación desde distintas perspectivas, sin que ninguna sea necesariamente «la verdad» de lo que sentimos.</p>
                <div className="space-learning-flow" role="img" aria-label="Tres elementos que pueden influirse mutuamente: situación, pensamientos y emociones, respuesta.">
                  <span><strong>01</strong> Situación</span><span><strong>02</strong> Pienso y siento</span><span><strong>03</strong> Respondo</span>
                </div>
                <p className="space-learning-caption">Una orientación para observar tu experiencia, no un diagnóstico ni una explicación causal universal.</p>
              </div>
            </details>

            <div className="space-filter-row" role="group" aria-label="Filtrar herramientas Wellness">
              <button className="is-active" type="button" data-wellness-filter="all">Todo</button>
              <button type="button" data-wellness-filter="emocional">Emocional</button>
              <button type="button" data-wellness-filter="cognitivo">Cognitivo</button>
              <button type="button" data-wellness-filter="autocuidado">Autocuidado</button>
              <button type="button" data-wellness-filter="favoritos">Favoritos</button>
            </div>

            <div id="wellness-context" className="space-context" hidden />
            <div id="wellness-list" className="space-wellness-list" aria-live="polite" />
          </section>

          <section className="space-view" data-space-panel="progress" hidden>
            <div className="space-hero">
              <p className="space-eyebrow">Mi progreso</p>
              <h2>Una mirada útil, no una nota sobre cómo “deberías” estar</h2>
              <p>En esta primera versión solo se muestran actividades completadas y favoritos en este dispositivo. No se calculan diagnósticos ni porcentajes de bienestar.</p>
            </div>

            <div className="space-summary">
              <article><strong id="progress-total">0</strong><span>Actividades completadas</span></article>
              <article><strong id="progress-week">0</strong><span>Esta semana</span></article>
              <article><strong id="progress-favorites">0</strong><span>Favoritos</span></article>
            </div>

            <section className="space-section">
              <div className="space-section-heading">
                <div><p className="space-eyebrow">Actividad reciente</p><h3>Lo que has utilizado</h3></div>
              </div>
              <div id="progress-history" className="space-history" />
            </section>
          </section>

          <section className="space-view" data-space-panel="account" hidden>
            <div className="space-hero">
              <p className="space-eyebrow">Cuenta y privacidad</p>
              <h2>Qué se guarda y qué no</h2>
              <p>La separación entre Wellness y terapia es intencionada. Una herramienta de bienestar no debe convertirse automáticamente en información clínica.</p>
            </div>

            <div className="space-grid space-feature-grid">
              <article className="space-card">
                <p className="space-kicker">Wellness libre</p>
                <h3>Privado en este dispositivo</h3>
                <p>Esta versión solo recuerda actividades completadas y favoritos. No guarda textos, emociones escritas ni respuestas personales.</p>
              </article>
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
              <button id="space-clear-local" className="space-danger-link" type="button">Borrar mis favoritos y progreso de este dispositivo</button>
              <button id="space-logout" className="space-danger-link" type="button">Cerrar sesión de Mi espacio</button>
            </div>
            <p id="space-clear-message" className="space-small" role="status" />
          </section>
        </section>
      </div>

      <dialog id="wellness-dialog" className="wellness-dialog">
        <div className="wellness-dialog-inner">
          <button id="wellness-dialog-close" className="wellness-close" type="button" aria-label="Cerrar">×</button>
          <p id="wellness-dialog-type" className="space-eyebrow" />
          <h2 id="wellness-dialog-title">Herramienta</h2>
          <p id="wellness-dialog-intro" className="wellness-intro" />
          <ol id="wellness-dialog-steps" className="wellness-steps" />
          <p id="wellness-dialog-note" className="wellness-note" />
          <div className="wellness-dialog-actions">
            <button id="wellness-favorite" className="space-secondary" type="button">Guardar en favoritos</button>
            <button id="wellness-complete" className="space-primary" type="button">Marcar como realizada</button>
          </div>
        </div>
      </dialog>

      <aside className="space-safety">
        <strong>Wellness no es un servicio de urgencias.</strong>
        <span>Si existe una emergencia, llama al 112. Si hay riesgo o ideación suicida, puedes contactar con el 024.</span>
      </aside>

      <Script src="/mi-espacio.js?v=20261008-visual1" strategy="afterInteractive" />
    </main>
  );
}
