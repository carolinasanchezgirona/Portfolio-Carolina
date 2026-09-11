const Arrow = () => <span aria-hidden="true">↗</span>;

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Carolina Sánchez, inicio">
          <span className="brand-name">Carolina Sánchez</span>
          <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
        </a>
        <nav className="nav" aria-label="Navegación principal">
          <a href="#psicologia">Psicología</a>
          <a href="#neuropsicologia">Neuropsicología</a>
          <a href="#sobre-mi">Sobre mí</a>
          <a className="nav-cta" href="#contacto">Pedir cita</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Carolina Sánchez · Psicología sanitaria y neuropsicología</p>
          <h1>Psicóloga sanitaria y neuropsicóloga en Arenys de Mar.</h1>
          <p className="hero-lead">
            Atención psicológica para adultos y evaluación e intervención neuropsicológica. Un trabajo
            clínico individualizado, cercano y basado en evidencia, adaptado a la persona, su contexto
            y sus objetivos.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contacto">Pedir cita <Arrow /></a>
            <a className="button button-secondary" href="#como-trabajo">Cómo trabajo</a>
          </div>
          <div className="hero-meta" aria-label="Información práctica">
            <span>Sesiones de 60 minutos</span>
            <span>60 €</span>
            <span>Presencial y online</span>
          </div>
        </div>

        <aside className="hero-panel" aria-label="Áreas de atención">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="panel-content">
            <p className="panel-kicker">Consulta privada</p>
            <p className="panel-title">Una mirada clínica, cognitiva y humana.</p>
            <div className="panel-list">
              <span>Psicología sanitaria</span>
              <span>Evaluación neuropsicológica</span>
              <span>Deterioro cognitivo y demencias</span>
              <span>Intervención y seguimiento</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="trust-strip" aria-label="Enfoque de trabajo">
        <p>Evaluación rigurosa</p>
        <p>Objetivos compartidos</p>
        <p>Intervención basada en evidencia</p>
        <p>Seguimiento clínico</p>
      </section>

      <section className="section services" aria-labelledby="servicios-title">
        <div className="section-heading">
          <p className="eyebrow">Áreas de trabajo</p>
          <h2 id="servicios-title">Dos puertas de entrada, una misma forma de trabajar.</h2>
        </div>

        <div className="service-grid">
          <article className="service-card" id="psicologia">
            <p className="service-number">01</p>
            <h3>Psicología</h3>
            <p>
              Atención psicológica para momentos de ansiedad, bajo estado de ánimo, duelo,
              dificultades relacionales, sobrecarga, cambios vitales o situaciones que empiezan a
              ocupar demasiado espacio en tu día a día.
            </p>
            <p className="service-note">
              El objetivo no es aplicar una fórmula cerrada, sino construir una formulación clínica
              útil y decidir qué necesita ser trabajado primero.
            </p>
          </article>

          <article className="service-card service-card-dark" id="neuropsicologia">
            <p className="service-number">02</p>
            <h3>Neuropsicología</h3>
            <p>
              Evaluación e intervención sobre memoria, atención, lenguaje, funciones ejecutivas y
              otros procesos cognitivos cuando existen cambios percibidos, sospecha de deterioro
              cognitivo, diagnóstico neurológico o necesidad de caracterizar el perfil cognitivo.
            </p>
            <p className="service-note">
              La interpretación integra puntuaciones, historia clínica, funcionamiento cotidiano y
              contexto. El test es una parte de la evaluación, no la evaluación completa.
            </p>
          </article>
        </div>
      </section>

      <section className="section method" id="como-trabajo" aria-labelledby="metodo-title">
        <div className="method-intro">
          <p className="eyebrow">Cómo trabajo</p>
          <h2 id="metodo-title">Menos ruido. Más comprensión clínica y un plan claro.</h2>
          <p>
            La intervención parte de una hipótesis de trabajo que se revisa con la evolución. La
            prioridad es entender qué mantiene el problema, qué factores lo modulan y qué cambios
            pueden producir una mejora significativa en la vida cotidiana.
          </p>
        </div>

        <div className="method-steps">
          <article>
            <span>01</span>
            <h3>Comprender</h3>
            <p>Historia, motivo de consulta, contexto actual y factores relevantes.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Formular</h3>
            <p>Organizar la información para construir una hipótesis clínica útil.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Intervenir</h3>
            <p>Definir objetivos concretos y seleccionar estrategias ajustadas al caso.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Revisar</h3>
            <p>Valorar cambios, dificultades y siguientes pasos sin automatismos.</p>
          </article>
        </div>
      </section>

      <section className="section dememoria" aria-labelledby="dememoria-title">
        <div className="dememoria-card">
          <p className="eyebrow light">Dememoria · Consulta clínica</p>
          <h2 id="dememoria-title">La clínica no empieza en una etiqueta diagnóstica.</h2>
          <p>
            Dememoria es el nombre de mi actividad de consulta privada. El trabajo parte de comprender
            a la persona antes de decidir cómo intervenir. Diagnóstico, pruebas, síntomas y escalas
            aportan información, pero adquieren sentido cuando se integran con la biografía, el
            funcionamiento cotidiano y las necesidades reales de quien consulta.
          </p>
        </div>
      </section>

      <section className="section about" id="sobre-mi" aria-labelledby="about-title">
        <div className="about-label">
          <p className="eyebrow">Sobre mí</p>
        </div>
        <div className="about-copy">
          <h2 id="about-title">Carolina Sánchez Girona</h2>
          <p className="about-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
          <p>
            Trabajo en evaluación e intervención psicológica y neuropsicológica, con experiencia
            especialmente vinculada al deterioro cognitivo, las demencias y la clínica de adultos.
            Mi forma de trabajar combina razonamiento clínico, evaluación estructurada y objetivos
            terapéuticos concretos, procurando que cada decisión tenga sentido para la persona y no
            solo sobre el papel.
          </p>
          <p>
            Paralelamente amplío mi formación en Ingeniería Biomédica, con interés en neurociencia,
            tecnología sanitaria y herramientas digitales aplicadas a salud. Es una línea complementaria
            a mi práctica clínica y neuropsicológica.
          </p>
        </div>
      </section>

      <section className="section contact" id="contacto" aria-labelledby="contact-title">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2 id="contact-title">Si quieres consultar tu caso, podemos empezar por una primera visita.</h2>
        </div>
        <div className="contact-box">
          <p className="contact-place">Arenys de Mar · Maresme</p>
          <p>Consulta presencial y online.</p>
          <a className="button button-primary" href="mailto:contact@carolinasanchezgirona.com?subject=Solicitud%20de%20primera%20visita">
            Solicitar primera visita <Arrow />
          </a>
          <a className="contact-email" href="mailto:contact@carolinasanchezgirona.com">
            contact@carolinasanchezgirona.com
          </a>
        </div>
      </section>

      <footer className="footer">
        <div>
          <p className="footer-brand">Carolina Sánchez | Psicóloga</p>
          <p>Dememoria · Consulta de Psicología y Neuropsicología</p>
        </div>
        <div className="footer-right">
          <p>Arenys de Mar · Atención online</p>
          <p>© 2026 Carolina Sánchez Girona</p>
        </div>
      </footer>
    </main>
  );
}
