import type { Metadata } from "next";
import "../cuadernos.css";

export const metadata: Metadata = {
  title: "Muestra gratuita de ejercicios de estimulación cognitiva para adultos",
  description: "Prueba dos ejercicios originales imprimibles de estimulación cognitiva para adultos: atención selectiva con doble regla y planificación de recados cotidianos.",
  alternates: { canonical: "/recursos/cuadernos-estimulacion-cognitiva/muestra/" },
  openGraph: {
    title: "Muestra gratuita | Cuadernos Dememòria",
    description: "Dos actividades completas y corregidas de atención y planificación, preparadas para imprimir.",
    url: "https://carolinasanchezgirona.com/recursos/cuadernos-estimulacion-cognitiva/muestra/",
    type: "article",
  },
};

const rows = [
  ["A", "4", "C", "8", "E", "6", "R", "O", "2", "T", "5", "U"],
  ["D", "4", "I", "8", "S", "6", "U", "2", "L", "4", "A", "3"],
  ["O", "6", "N", "2", "A", "8", "F", "4", "E", "3", "C", "6"],
  ["E", "2", "T", "6", "I", "4", "M", "8", "A", "6", "P", "5"],
  ["R", "8", "U", "6", "P", "2", "O", "4", "F", "8", "I", "5"],
  ["I", "2", "C", "6", "A", "4", "T", "2", "E", "8", "N", "7"],
  ["U", "4", "M", "6", "O", "2", "D", "8", "I", "6", "Q", "4"],
  ["E", "8", "S", "4", "A", "6", "L", "2", "U", "4", "R", "7"],
];

const availability = [
  { task: "Banco", hours: "09:00–11:00", time: "20 min" },
  { task: "Biblioteca", hours: "10:00–12:00", time: "20 min" },
  { task: "Centro cívico", hours: "Cita: 10:50–11:20", time: "30 min (hora fija)" },
  { task: "Farmacia", hours: "09:30–13:30", time: "15 min" },
];

const sampleSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://carolinasanchezgirona.com/" },
    { "@type": "ListItem", position: 2, name: "Recursos", item: "https://carolinasanchezgirona.com/recursos/" },
    { "@type": "ListItem", position: 3, name: "Cuadernos", item: "https://carolinasanchezgirona.com/recursos/cuadernos-estimulacion-cognitiva/" },
    { "@type": "ListItem", position: 4, name: "Muestra", item: "https://carolinasanchezgirona.com/recursos/cuadernos-estimulacion-cognitiva/muestra/" },
  ],
};

export default function MuestraPage() {
  return (
    <main className="cog-series">
      <div className="editorial-wrap cog-sample">
        <div className="cog-sample-top">
          <a className="editorial-btn editorial-btn-secondary" href="/recursos/cuadernos-estimulacion-cognitiva/">← Volver a la colección</a>
          <span className="cog-sample-eyebrow">Dememòria · Muestra sin registro</span>
        </div>
        <div className="cog-sample-intro">
          <p className="cog-eyebrow">Material de demostración · No estandarizado</p>
          <h1>Dos ejercicios, con espacio para pensar.</h1>
          <p className="cog-sample-lead">Puedes trabajar directamente sobre la hoja impresa. Para obtener una copia, utiliza la función <strong>Imprimir</strong> de tu navegador (también permite guardar como PDF). Al imprimir solo aparecen las fichas, sin las soluciones.</p>
        </div>

        <article className="cog-sheet" aria-labelledby="exercise-attention">
          <div className="cog-sheet-meta"><span>01 · Atención selectiva e inhibición</span><span>8–12 min orientativos</span></div>
          <h2 id="exercise-attention">Atención a dos reglas</h2>
          <p className="cog-instructions"><strong>Instrucciones.</strong> Recorre cada fila de izquierda a derecha. Busca números pares situados <strong>justo después de una vocal</strong> (A, E, I, O, U).</p>
          <p className="cog-instructions">Si encuentras un <strong>2, 4 u 8</strong> que cumpla la condición, <strong>rodéalo</strong>. Si es un <strong>6</strong> que también cumple la condición, <strong>táchalo</strong>. No marques ningún otro número.</p>
          <div className="cog-attention-scroll">
            <table className="cog-attention" aria-label="Ocho filas de letras y números para completar el ejercicio de atención">
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <th scope="row">F{i + 1}</th>
                    {row.map((token, j) => <td key={j}>{token}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cog-answer-line">Total de números rodeados: <span aria-label="Espacio para contestar">&nbsp;</span> Total de números tachados: <span aria-label="Espacio para contestar">&nbsp;</span></p>
          <p className="cog-sample-note">Para el profesional: registre errores de omisión, comisiones, rectificaciones espontáneas y ayudas. No interprete las cifras como puntuaciones baremadas.</p>
        </article>

        <article className="cog-sheet" aria-labelledby="exercise-planning">
          <div className="cog-sheet-meta"><span>02 · Planificación y flexibilidad</span><span>10–15 min orientativos</span></div>
          <h2 id="exercise-planning">Una mañana de gestiones</h2>
          <p className="cog-instructions">Sales de casa a las <strong>09:30</strong>. Debes completar cuatro gestiones. Cada desplazamiento entre lugares, incluido el trayecto desde casa y el regreso, dura <strong>10 minutos</strong>. No puedes atender dos gestiones a la vez.</p>
          <table className="cog-schedule">
            <thead><tr><th scope="col">Lugar</th><th scope="col">Horario disponible</th><th scope="col">Tiempo necesario</th></tr></thead>
            <tbody>{availability.map((a) => (
              <tr key={a.task}><th scope="row">{a.task}</th><td>{a.hours}</td><td>{a.time}</td></tr>
            ))}</tbody>
          </table>
          <p className="cog-instructions"><strong>Tu tarea:</strong> diseña un itinerario posible desde las 09:30, respetando los horarios y anotando las horas. Puedes esperar si llegas antes, pero no puedes entrar fuera del horario de un establecimiento.</p>
          <table className="cog-work" aria-label="Tabla de respuesta del itinerario">
            <thead><tr><th scope="col">Orden</th><th scope="col">Lugar o gestión</th><th scope="col">Inicio</th><th scope="col">Fin</th></tr></thead>
            <tbody>{Array.from({length: 6}, (_, i) => (
              <tr key={i}><th scope="row">{i + 1}</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
            ))}</tbody>
          </table>
          <p className="cog-instructions"><strong>Pregunta adicional.</strong> Si la gestión en la biblioteca durara 35 minutos, ¿podrías mantener el mismo orden sin llegar tarde a la cita? Explica por qué.</p>
          <div className="cog-lines" aria-label="Espacio de respuesta libre" />
          <p className="cog-sample-note">Los horarios y traslados son hipotéticos. La tarea admite más de una solución válida.</p>
        </article>

        <div className="cog-screen-only">
          <details className="cog-solutions">
            <summary>Ver soluciones y criterios de corrección (solo pantalla)</summary>
            <h3>Ejercicio 1 · Atención a dos reglas</h3>
            <p>Respuestas correctas por fila, contando únicamente números inmediatamente posteriores a una vocal:</p>
            <ul>
              <li>Fila 1: A4 (rodear), E6 (tachar), O2 (rodear).</li>
              <li>Fila 2: I8 (rodear), U2 (rodear).</li>
              <li>Fila 3: O6 (tachar), A8 (rodear).</li>
              <li>Fila 4: E2 (rodear), I4 (rodear), A6 (tachar).</li>
              <li>Fila 5: U6 (tachar), O4 (rodear).</li>
              <li>Fila 6: I2 (rodear), A4 (rodear), E8 (rodear).</li>
              <li>Fila 7: U4 (rodear), O2 (rodear), I6 (tachar).</li>
              <li>Fila 8: E8 (rodear), A6 (tachar), U4 (rodear).</li>
            </ul>
            <p><strong>Total:</strong> 18 respuestas correctas, 12 números rodeados y 6 tachados.</p>
            <h3>Ejercicio 2 · Una solución posible</h3>
            <p>Casa 09:30 → banco 09:40–10:00 → biblioteca 10:10–10:30 → centro cívico (llegada 10:40, espera hasta 10:50; cita 10:50–11:20) → farmacia 11:30–11:45 → casa 11:55.</p>
            <p>Si la biblioteca durara 35 minutos, con ese orden terminaría a las 10:45 y se llegaría al centro a las 10:55, cinco minutos tarde. Puede reordenarse, por ejemplo, visitando la biblioteca después de la cita: banco 09:40–10:00, centro cívico (llegada 10:10, cita 10:50–11:20), biblioteca 11:30–12:05 <strong>no sería válido</strong> porque cierra a las 12:00. Por tanto, para este cambio haría falta otro orden o aceptar que no todas las gestiones pueden completarse según las condiciones iniciales.</p>
            <p>Para corregir, comprueba que se incluyen los traslados y que todas las gestiones empiezan y terminan dentro de su horario; considera también el razonamiento, las autorrectificaciones y la gestión de la espera.</p>
          </details>
          <p className="cog-print-note">La muestra se imprime sin las soluciones. Material de práctica cognitiva, no instrumento diagnóstico ni medida estandarizada.</p>
          <div className="cog-actions">
            <a className="editorial-btn editorial-btn-primary" href="/recursos/cuadernos-estimulacion-cognitiva/">Ver la colección completa</a>
            <a className="editorial-btn editorial-btn-secondary" href="/recursos/">Volver a recursos</a>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(sampleSchema) }} />
    </main>
  );
}
