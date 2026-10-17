import type { Metadata } from "next";
import Script from "next/script";
import "./mi-espacio.css";
import MoodTracker, { MoodAvatarSettings } from "./mood-tracker";

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
            <button type="button" data-space-view="account">Configuración</button>
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
              <p>Tu recorrido, paso a paso y recursos para continuar lo trabajado en consulta, a tu ritmo.</p>
            </div>

            <MoodTracker />

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
              <p>Mientras estés en tratamiento, Wellness y tus materiales están incluidos. Al finalizar, podrás continuar con las herramientas digitales mediante una suscripción voluntaria cuando esté disponible.</p>
            </aside>

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
              <p>Tu actividad libre en Wellness no se incorpora automáticamente a tu historia clínica. Cuando una herramienta sea prescrita en terapia, definiremos de forma explícita qué dato se comparte y cuál permanece privado.</p>
            </aside>
          </section>

          <section className="space-view wellness-experience" data-space-panel="wellness" hidden>
            <div className="space-hero wellness-hero">
              <p className="space-eyebrow">WELLNESS · TU ESPACIO PERSONAL</p>
              <h2>Una pausa que te sirva.</h2>
              <p>No necesitas tener todo claro para empezar. Elige lo que necesitas hoy y encuentra una práctica breve, sin exigencias ni puntuaciones.</p>
              <span className="wellness-hero-decoration" aria-hidden="true" />
            </div>

            <section className="wellness-need-section" aria-labelledby="wellness-need-heading">
              <div className="wellness-section-title">
                <div><p className="space-eyebrow">EMPIEZA POR AQUÍ</p><h3 id="wellness-need-heading">¿Qué necesitas ahora?</h3></div>
                <p>Puedes cambiar de opción cuando quieras.</p>
              </div>
              <div className="wellness-needs" aria-label="Elegir una necesidad">
                <button type="button" data-need="calmarme"><span aria-hidden="true">◉</span><strong>Bajar revoluciones</strong><small>Volver al presente</small></button>
                <button type="button" data-need="rumiacion"><span aria-hidden="true">↻</span><strong>Menos vueltas</strong><small>Soltar la rumiación</small></button>
                <button type="button" data-need="energia"><span aria-hidden="true">◔</span><strong>Poca energía</strong><small>Hacerlo más sencillo</small></button>
                <button type="button" data-need="entender"><span aria-hidden="true">◇</span><strong>Entenderme</strong><small>Poner nombre a lo que siento</small></button>
                <button type="button" data-need="concentrarme"><span aria-hidden="true">◎</span><strong>Recuperar foco</strong><small>Una cosa cada vez</small></button>
                <button type="button" data-need="limites"><span aria-hidden="true">⊣</span><strong>Poner límites</strong><small>Expresarme con claridad</small></button>
                <button type="button" data-need="desconectar"><span aria-hidden="true">☾</span><strong>Desconectar</strong><small>Descanso y transición</small></button>
                <button type="button" data-need="orden"><span aria-hidden="true">☷</span><strong>Ordenar ideas</strong><small>Menos carga mental</small></button>
              </div>
              <div className="wellness-filter-context" id="wellness-context" role="status" aria-live="polite" hidden />
              <button className="wellness-reset" type="button" data-wellness-reset hidden>Ver todas las herramientas <span aria-hidden="true">↗</span></button>
            </section>

            <section className="wellness-quick-section" aria-labelledby="wellness-quick-heading">
              <div className="wellness-section-title">
                <div><p className="space-eyebrow">SIN COMPLICARTE</p><h3 id="wellness-quick-heading">Un comienzo de cinco minutos</h3></div>
              </div>
              <div className="wellness-quick-grid">
                <button type="button" data-wellness-start="aterrizar-presente">
                  <span className="wellness-quick-icon" aria-hidden="true">01</span>
                  <strong>Volver al presente</strong><small>3 min · atención y entorno</small><span className="wellness-quick-arrow" aria-hidden="true">↗</span>
                </button>
                <button type="button" data-wellness-start="primer-paso">
                  <span className="wellness-quick-icon" aria-hidden="true">02</span>
                  <strong>Solo el primer paso</strong><small>3 min · desbloquear una tarea</small><span className="wellness-quick-arrow" aria-hidden="true">↗</span>
                </button>
                <button type="button" data-wellness-start="descanso-sin-culpa">
                  <span className="wellness-quick-icon" aria-hidden="true">03</span>
                  <strong>Descansar sin negociar</strong><small>4 min · pausa sin culpa</small><span className="wellness-quick-arrow" aria-hidden="true">↗</span>
                </button>
              </div>
            </section>

            <section className="wellness-interactive-section" aria-labelledby="wellness-interactive-heading">
              <div className="wellness-section-title">
                <div>
                  <p className="space-eyebrow">PRÁCTICAS INTERACTIVAS</p>
                  <h3 id="wellness-interactive-heading">Hazlo aquí, no solo lo leas.</h3>
                </div>
                <p>Siete prácticas guiadas: decisiones cotidianas, tarjetas para ordenar, atención visual y registros descriptivos sin puntuaciones.</p>
              </div>
              <div id="wellness-interactive" aria-label="Herramientas interactivas de bienestar">
                <p className="wellness-interactive-loading" role="status">Preparando tus prácticas interactivas…</p>
              </div>
            </section>

            <section className="wellness-library" aria-labelledby="wellness-library-heading">
              <div className="wellness-section-title">
                <div><p className="space-eyebrow">TU BIBLIOTECA</p><h3 id="wellness-library-heading">Herramientas para distintos momentos</h3></div>
                <span id="wellness-count" className="wellness-count" aria-live="polite">Cargando herramientas…</span>
              </div>
              <div className="wellness-library-controls">
                <div className="wellness-filters" aria-label="Filtrar herramientas">
                  <button type="button" className="is-active" aria-pressed="true" data-wellness-filter="all">Todas</button>
                  <button type="button" aria-pressed="false" data-wellness-filter="emocional">Emociones</button>
                  <button type="button" aria-pressed="false" data-wellness-filter="cognitivo">Atención y organización</button>
                  <button type="button" aria-pressed="false" data-wellness-filter="autocuidado">Autocuidado</button>
                  <button type="button" aria-pressed="false" data-wellness-filter="favoritos">Mis favoritos ♡</button>
                </div>
                <label className="wellness-search-label" htmlFor="wellness-search">
                  <span className="wellness-search-icon" aria-hidden="true">⌕</span>
                  <input id="wellness-search" type="search" placeholder="Buscar una herramienta…" autoComplete="off" />
                </label>
              </div>
              <div id="wellness-list" className="space-wellness-list" aria-live="polite" />
            </section>

            <section className="wellness-routines" aria-labelledby="wellness-routines-heading">
              <div className="wellness-section-title">
                <div><p className="space-eyebrow">SECUENCIAS GUIADAS</p><h3 id="wellness-routines-heading">Cuando no quieres decidir qué hacer</h3></div>
              </div>
              <div className="wellness-routine-grid">
                <button type="button" data-routine="cabeza-llena"><span aria-hidden="true">☷</span><strong>Tengo la cabeza llena</strong><small>Descargar y priorizar</small></button>
                <button type="button" data-routine="desconectar-trabajo"><span aria-hidden="true">☾</span><strong>Cerrar el día</strong><small>Dejar el trabajo atrás</small></button>
                <button type="button" data-routine="antes-empezar"><span aria-hidden="true">↗</span><strong>Me cuesta empezar</strong><small>Un paso posible</small></button>
                <button type="button" data-routine="bajar-revoluciones"><span aria-hidden="true">◉</span><strong>Estoy acelerada</strong><small>Orientar la atención</small></button>
              </div>
            </section>

            <details className="wellness-journey-disclosure">
              <summary><span><small>SI TE APETECE PROFUNDIZAR</small><strong>Construye tu recorrido personal</strong><em>Un objetivo y cuatro etapas, sin plazos obligatorios.</em></span><span aria-hidden="true">＋</span></summary>
              <div id="wellness-journey" aria-live="polite" />
            </details>
            <aside className="wellness-privacy">
              <strong>Un espacio personal, no una evaluación clínica.</strong>
              <p>Estas prácticas son recursos generales de autocuidado. Tus notas y decisiones interactivas no se guardan. Solo se registra la fecha y el nombre de una práctica cuando decides terminarla. Los favoritos, objetivos y registros se mantienen en este dispositivo, separados por cuenta, y no se comparten automáticamente con Carolina.</p>
            </aside>
          </section>

          <section className="space-view" data-space-panel="progress" hidden>
            <div className="space-hero">
              <p className="space-eyebrow">Mi progreso</p>
              <h2>Una mirada útil, no una nota sobre cómo “deberías” estar</h2>
              <p>Puedes revisar las herramientas utilizadas y tus favoritos en este dispositivo. Se guardan por separado para cada cuenta. No se calculan diagnósticos ni porcentajes de bienestar.</p>
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
              <h2>Mi configuración y privacidad</h2>
              <p>La separación entre Wellness y terapia es intencionada. La elección del personaje se guarda en tu cuenta y tus registros libres de bienestar permanecen en este dispositivo, separados por paciente.</p>
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

            <MoodAvatarSettings />

            <div className="space-grid space-feature-grid">
              <article className="space-card">
                <p className="space-kicker">Wellness personal</p>
                <h3>Privado en este dispositivo</h3>
                <p>Tus favoritos, actividades realizadas y registros de ánimo están separados por cuenta dentro de este dispositivo. No se comparten automáticamente con Carolina.</p>
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
              <button id="space-clear-local" className="space-danger-link" type="button">Borrar registros locales de Wellness y preferencias de lectura</button>
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

      <Script src="/patient-video.js?v=20261009-1" strategy="afterInteractive" />
      <Script src="/mi-espacio.js?v=20261017-async-session-5" strategy="afterInteractive" />
      <Script src="/session-prep.js?v=20261017-1" strategy="afterInteractive" />
      <Script src="/wellness-interactive.js?v=20261017-visual-2" strategy="afterInteractive" />
    </main>
  );
}
