import "./modelo.css";

type Icono = "dialogo" | "objetivos" | "intervencion" | "seguimiento" | "cierre";

const etapas: { numero: string; nombre: string; texto: string; icono: Icono }[] = [
  {
    numero: "01",
    nombre: "Comprender",
    texto: "Exploramos el motivo de consulta, tu historia y cómo te afecta en el día a día.",
    icono: "dialogo",
  },
  {
    numero: "02",
    nombre: "Definir",
    texto: "Integramos la información y acordamos objetivos relevantes y realistas.",
    icono: "objetivos",
  },
  {
    numero: "03",
    nombre: "Intervenir",
    texto: "Seleccionamos estrategias respaldadas por la evidencia y adaptadas a tus necesidades.",
    icono: "intervencion",
  },
  {
    numero: "04",
    nombre: "Medir y ajustar",
    texto: "Revisamos los cambios y ajustamos el plan cuando es necesario.",
    icono: "seguimiento",
  },
  {
    numero: "05",
    nombre: "Consolidar",
    texto: "Preparamos el cierre, reforzamos recursos y valoramos el seguimiento si hace falta.",
    icono: "cierre",
  },
];

function IconoEtapa({ icono }: { icono: Icono }) {
  const common = { viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  if (icono === "dialogo") {
    return <svg {...common}><path d="M9 24c0-10 10-18 22-18s22 8 22 18-10 18-22 18c-3 0-6-.4-9-1.3L12 47l2-11c-3-3.3-5-7.5-5-12Z"/><path d="M40 39c2.5 4.8 8.5 8 15 8 1.2 0 2.4-.1 3.4-.3L61 53l-8.5-1.5" /></svg>;
  }
  if (icono === "objetivos") {
    return <svg {...common}><path d="M23 11h18v5H23zM19 13h-6c-2 0-3 2-3 4v37c0 2 1 3 3 3h38c2 0 3-1 3-3V17c0-2-1-4-3-4h-6" /><path d="m18 28 4 4 7-8M34 28h11M18 43l4 4 7-8M34 43h11" /></svg>;
  }
  if (icono === "intervencion") {
    return <svg {...common}><path d="M32 57V27M32 41c-13 0-22-9-22-22 13 0 22 9 22 22ZM32 32c0-13 9-22 22-22 0 13-9 22-22 22Z" /></svg>;
  }
  if (icono === "seguimiento") {
    return <svg {...common}><path d="M10 54V40h10v14M27 54V30h10v24M44 54V18h10v36M8 29l18-11 12 5 16-17"/><circle cx="8" cy="29" r="3"/><circle cx="26" cy="18" r="3"/><circle cx="38" cy="23" r="3"/><circle cx="54" cy="6" r="3"/></svg>;
  }
  return <svg {...common}><circle cx="32" cy="32" r="24"/><path d="m19 32 9 9 18-19"/></svg>;
}

function IconoInfo() {
  return <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="14" cy="14" r="11"/><path d="M14 12v8M14 8.3v.7" strokeLinecap="round"/></svg>;
}

export default function ModeloVisual() {
  return (
    <div className="modelo-graphic-section" id="etapas" aria-label="Las cinco etapas de mi proceso clínico">
      <div className="modelo-graphic-wrap">
        <div className="modelo-timeline" role="list" aria-label="Proceso en cinco etapas">
          {etapas.map(({ numero, nombre, texto, icono }) => (
            <article className="modelo-stage" role="listitem" key={numero}>
              <span className="modelo-stage-number" aria-hidden="true">{numero}</span>
              <div className="modelo-stage-panel">
                <span className="modelo-stage-icon"><IconoEtapa icono={icono} /></span>
                <div className="modelo-stage-content">
                  <h3>{nombre}</h3>
                  <p>{texto}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="modelo-note">
          <IconoInfo />
          <span>No es un recorrido rígido ni implica un número fijo de sesiones.</span>
        </div>
      </div>
    </div>
  );
}
