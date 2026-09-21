import type { Metadata } from "next";
import Script from "next/script";
import "./fabrica.css";

export const metadata: Metadata = {
  title: "Fábrica clínica | Carolina Sánchez",
  description: "Generador privado de actividades terapéuticas.",
  robots: { index: false, follow: false, nocache: true },
};

const Select = ({ id, label, children, multiple = false }: { id: string; label: string; children: React.ReactNode; multiple?: boolean }) => (
  <label className="factory-field">
    <span>{label}</span>
    <select id={id} multiple={multiple}>{children}</select>
  </label>
);

export default function ClinicalFactoryPage() {
  return (
    <main className="factory-page">
      <section id="factory-login-required" className="factory-login-card" hidden>
        <p className="factory-eyebrow">Dememoria · Área privada</p>
        <h1>Fábrica clínica</h1>
        <p>Necesitas iniciar sesión en Gestión clínica antes de utilizar la fábrica.</p>
        <a className="factory-primary" href="/admin/clinica/">Ir a Gestión clínica</a>
      </section>

      <section id="factory-app" hidden>
        <header className="factory-topbar">
          <div>
            <p className="factory-eyebrow">Dememoria · Herramienta profesional</p>
            <h1>Fábrica clínica</h1>
            <p>Genera actividades terapéuticas estructuradas y guárdalas directamente en tu biblioteca clínica.</p>
          </div>
          <div className="factory-actions">
            <a className="factory-secondary" href="/admin/clinica/">Gestión clínica</a>
            <button id="factory-new" className="factory-secondary" type="button">Nueva</button>
            <button id="factory-save" className="factory-primary" type="button" disabled>Guardar en biblioteca</button>
          </div>
        </header>

        <div className="factory-layout">
          <aside className="factory-builder">
            <nav className="factory-mode-tabs" aria-label="Modo de generación">
              <button type="button" className="active" data-mode="guided">Guiada</button>
              <button type="button" data-mode="clinical">Desde caso</button>
              <button type="button" data-mode="surprise">Sorpréndeme</button>
            </nav>

            <section id="factory-guided-panel" className="factory-panel">
              <div className="factory-grid">
                <Select id="factory-area" label="Área clínica">
                  <option value="ansiedad">Ansiedad</option>
                  <option value="depresion">Depresión / bajo estado de ánimo</option>
                  <option value="duelo">Duelo y pérdidas</option>
                  <option value="trauma">Trauma</option>
                  <option value="relaciones">Relaciones</option>
                  <option value="autoestima">Autoestima / autocrítica</option>
                  <option value="regulacion">Regulación emocional</option>
                  <option value="perfeccionismo">Perfeccionismo</option>
                  <option value="procrastinacion">Procrastinación</option>
                  <option value="sueno">Sueño</option>
                  <option value="dolor">Dolor crónico</option>
                  <option value="cuidadores">Cuidadores</option>
                  <option value="tdah">TDAH</option>
                  <option value="tea">TEA / neurodivergencia</option>
                  <option value="neuropsicologia">Adaptación neuropsicológica</option>
                </Select>

                <Select id="factory-process" label="Proceso principal">
                  <option value="rumiacion">Rumiación</option>
                  <option value="preocupacion">Preocupación</option>
                  <option value="incertidumbre">Intolerancia a la incertidumbre</option>
                  <option value="evitacion">Evitación</option>
                  <option value="reaseguro">Búsqueda de reaseguro</option>
                  <option value="seguridad">Conductas de seguridad</option>
                  <option value="catastrofismo">Catastrofismo</option>
                  <option value="hipervigilancia">Hipervigilancia</option>
                  <option value="control">Necesidad de control</option>
                  <option value="autocritica">Autocrítica</option>
                  <option value="perfeccionismo">Perfeccionismo</option>
                  <option value="inactividad">Inactividad / retirada</option>
                  <option value="fusion">Fusión cognitiva</option>
                  <option value="rigidez">Rigidez cognitiva</option>
                  <option value="limites">Dificultad para poner límites</option>
                  <option value="regulacion">Dificultad de regulación emocional</option>
                  <option value="decisiones">Indecisión</option>
                  <option value="dolor">Afrontamiento del dolor</option>
                </Select>

                <Select id="factory-goal" label="Objetivo terapéutico">
                  <option value="observar">Identificar patrón</option>
                  <option value="psicoeducar">Psicoeducar</option>
                  <option value="flexibilizar">Flexibilizar interpretación</option>
                  <option value="tolerar">Aumentar tolerancia</option>
                  <option value="exponerse">Reducir evitación / exponerse</option>
                  <option value="regular">Regular emoción</option>
                  <option value="activar">Activación conductual</option>
                  <option value="limites">Entrenar límites</option>
                  <option value="comunicar">Mejorar comunicación</option>
                  <option value="decidir">Tomar decisiones</option>
                  <option value="valores">Clarificar valores</option>
                  <option value="autocompasion">Reducir autocrítica</option>
                  <option value="prevencion">Prevención de recaídas</option>
                </Select>

                <Select id="factory-phase" label="Fase terapéutica">
                  <option value="evaluacion">Evaluación</option>
                  <option value="formulacion">Formulación</option>
                  <option value="intervencion" selected>Intervención</option>
                  <option value="consolidacion">Consolidación</option>
                </Select>

                <Select id="factory-approach" label="Enfoque">
                  <option value="integrativo">Integrativo</option>
                  <option value="tcc">TCC</option>
                  <option value="act">ACT</option>
                  <option value="dbt">DBT</option>
                  <option value="metacognitiva">Metacognitiva</option>
                  <option value="cft">CFT / compasión</option>
                </Select>

                <Select id="factory-format" label="Formato">
                  <option value="auto">Automático</option>
                  <option value="hoja">Hoja de trabajo</option>
                  <option value="registro">Registro</option>
                  <option value="experimento">Experimento conductual</option>
                  <option value="roleplay">Role-play</option>
                  <option value="mapa">Mapa visual</option>
                  <option value="tarjetas">Tarjetas</option>
                  <option value="experiencial">Ejercicio experiencial</option>
                </Select>

                <Select id="factory-population" label="Población">
                  <option value="adulto">Adulto</option>
                  <option value="adolescente">Adolescente</option>
                  <option value="mayor">Persona mayor</option>
                  <option value="pareja">Pareja</option>
                  <option value="familia">Familia</option>
                </Select>

                <Select id="factory-duration" label="Duración">
                  <option value="10">10 min</option>
                  <option value="20" selected>20 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                </Select>

                <Select id="factory-use" label="Uso">
                  <option value="sesion">En sesión</option>
                  <option value="casa">Entre sesiones</option>
                  <option value="ambos">Sesión + casa</option>
                </Select>

                <Select id="factory-depth" label="Profundidad">
                  <option value="basica">Básica</option>
                  <option value="intermedia" selected>Intermedia</option>
                  <option value="avanzada">Avanzada</option>
                </Select>
              </div>
              <label className="factory-field">
                <span>Contexto adicional, opcional</span>
                <textarea id="factory-context" rows={4} placeholder="Ej.: entiende muy bien intelectualmente el problema, pero racionaliza y evita conectar con la emoción." />
              </label>
            </section>

            <section id="factory-clinical-panel" className="factory-panel" hidden>
              <label className="factory-field">
                <span>Describe brevemente qué quieres trabajar</span>
                <textarea id="factory-clinical-text" rows={8} placeholder="Ej.: paciente con ansiedad anticipatoria antes de reuniones; sobreprepara, revisa varias veces y teme quedarse en blanco." />
              </label>
              <div className="factory-grid compact">
                <Select id="factory-clinical-population" label="Población">
                  <option value="adulto">Adulto</option><option value="adolescente">Adolescente</option><option value="mayor">Persona mayor</option>
                </Select>
                <Select id="factory-clinical-duration" label="Duración">
                  <option value="10">10 min</option><option value="20" selected>20 min</option><option value="30">30 min</option>
                </Select>
              </div>
            </section>

            <section id="factory-surprise-panel" className="factory-panel" hidden>
              <p className="factory-help">Elige solo el área y el proceso. La fábrica creará tres propuestas deliberadamente distintas.</p>
              <div className="factory-grid compact">
                <Select id="factory-surprise-area" label="Área">
                  <option value="ansiedad">Ansiedad</option><option value="duelo">Duelo</option><option value="relaciones">Relaciones</option><option value="autoestima">Autoestima</option><option value="regulacion">Regulación emocional</option>
                </Select>
                <Select id="factory-surprise-process" label="Proceso">
                  <option value="rumiacion">Rumiación</option><option value="incertidumbre">Incertidumbre</option><option value="evitacion">Evitación</option><option value="autocritica">Autocrítica</option><option value="limites">Límites</option><option value="regulacion">Regulación emocional</option>
                </Select>
              </div>
            </section>

            <label className="factory-ai-option">
              <input id="factory-use-ai" type="checkbox" defaultChecked />
              <span><strong>Enriquecer con IA</strong><small>El motor clínico fija objetivo, mecanismos y técnicas. La IA solo adapta y mejora la redacción.</small></span>
            </label>
            <p className="factory-privacy-note">No introduzcas nombres, correos, teléfonos ni otros datos identificativos en el contexto clínico.</p>
            <button id="factory-generate" className="factory-generate" type="button">Generar actividad</button>
            <p id="factory-message" className="factory-message" role="status" aria-live="polite" />
          </aside>

          <section className="factory-result">
            <div id="factory-empty" className="factory-empty">
              <span className="factory-spark">✦</span>
              <h2>La mesa está preparada</h2>
              <p>Configura la actividad y pulsa «Generar actividad».</p>
            </div>

            <div id="factory-output" hidden>
              <div className="factory-result-heading">
                <div>
                  <p id="factory-output-code" className="factory-eyebrow" />
                  <input id="factory-output-title" className="factory-title-input" aria-label="Título" />
                  <p id="factory-output-meta" className="factory-meta" />
                </div>
                <div className="factory-result-actions">
                  <button type="button" className="factory-secondary" data-adapt="shorter">Más breve</button>
                  <button type="button" className="factory-secondary" data-adapt="experiential">Más experiencial</button>
                  <button type="button" className="factory-secondary" data-adapt="homework">Convertir en tarea</button>
                  <button id="factory-ai-refresh" type="button" className="factory-secondary">Variar con IA</button>
                </div>
              </div>

              <nav className="factory-preview-tabs">
                <button className="active" type="button" data-preview="professional">Profesional</button>
                <button type="button" data-preview="patient">Paciente</button>
                <button type="button" data-preview="variants">Variantes</button>
              </nav>

              <section id="factory-professional-preview" className="factory-sheet" />
              <section id="factory-patient-preview" className="factory-sheet" hidden />
              <section id="factory-variants-preview" className="factory-variants" hidden />
            </div>
          </section>
        </div>
      </section>

      <Script src="/clinical-activity-factory.js?v=20260921-2" strategy="afterInteractive" />
    </main>
  );
}
