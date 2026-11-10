import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Cómo trabajo | Psicología y neuropsicología en Arenys de Mar",
  description:
    "Conoce cómo trabajo en consulta: comprender, definir objetivos, intervenir, medir y ajustar, y consolidar. Un proceso clínico individualizado en psicología y neuropsicología.",
  alternates: { canonical: "/como-trabajo/" },
  openGraph: {
    title: "Cómo trabajo | Carolina Sánchez, psicóloga y neuropsicóloga",
    description:
      "Una forma de trabajar estructurada, flexible y basada en la evaluación clínica, los objetivos compartidos y la revisión del proceso.",
    url: "https://carolinasanchezgirona.com/como-trabajo/",
  },
};

const etapas = [
  {
    titulo: "Comprender",
    descripcion:
      "Empezamos por escucharte y conocer el motivo de consulta. Exploramos la historia relevante, el contexto personal, los factores que pueden estar influyendo y su repercusión en tu vida cotidiana. Si procede, utilizamos entrevistas, cuestionarios o pruebas de evaluación.",
  },
  {
    titulo: "Definir",
    descripcion:
      "Integramos la información y construimos una comprensión clínica de lo que sucede. Compartimos las conclusiones pertinentes y acordamos qué aspectos quieres trabajar, qué cambios serían significativos y qué prioridades tienen sentido en tu situación.",
  },
  {
    titulo: "Intervenir",
    descripcion:
      "Elegimos estrategias y técnicas con respaldo científico según la formulación clínica, tus preferencias y las necesidades detectadas. Cuando es útil, podemos incorporar ejercicios y recursos para trabajar entre sesiones, sin convertirlos en una obligación automática.",
  },
  {
    titulo: "Medir y ajustar",
    descripcion:
      "Revisamos periódicamente si han cambiado el malestar, el funcionamiento diario y los objetivos acordados. Podemos apoyarnos en medidas clínicas o registros cuando aporten información útil. Si algo no funciona como esperábamos, reconsideramos las hipótesis y ajustamos el plan.",
  },
  {
    titulo: "Consolidar",
    descripcion:
      "Cuando el motivo de consulta está suficientemente abordado, revisamos los recursos que te han resultado útiles, las señales de posibles dificultades futuras y cómo mantener los avances. El cierre se acuerda según tu situación; el seguimiento posterior se plantea solo si tiene sentido.",
  },
];

export default function ComoTrabajoPage() {
  return (
    <main className="editorial-site">
      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><span>Cómo trabajo</span></p>
          <p className="editorial-eyebrow">Mi forma de trabajar</p>
          <h1>Un proceso con dirección, adaptado a ti.</h1>
          <p className="seo-lead">
            Mi manera de trabajar combina evaluación clínica, formulación de hipótesis, objetivos
            compartidos y revisión de la evolución. No se trata de aplicar una técnica por sistema,
            sino de elegir qué puede resultar útil para cada persona, con rigor y flexibilidad.
          </p>
          <div className="seo-actions">
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a>
            <a className="editorial-btn editorial-btn-secondary" href="#etapas">Ver las cinco etapas</a>
          </div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section aria-labelledby="proceso-title">
            <h2 id="proceso-title">Saber qué estamos trabajando y para qué</h2>
            <p>
              Acudir a consulta no debería significar avanzar sin saber cuál es la dirección.
              Desde el inicio buscamos comprender la dificultad y decidir, de manera compartida,
              qué objetivos son relevantes. A lo largo del proceso revisamos los cambios y
              adaptamos el abordaje a lo que vaya ocurriendo.
            </p>
            <p>
              Esta estructura orienta mi práctica clínica, pero no es una terapia nueva ni un
              método validado de forma independiente. Las decisiones se fundamentan en la
              evaluación, la evidencia disponible y el juicio clínico, teniendo en cuenta
              tus preferencias y circunstancias.
            </p>
          </section>

          <section id="etapas" aria-labelledby="etapas-title">
            <h2 id="etapas-title">Las cinco etapas del proceso</h2>
            <ol>
              {etapas.map(({ titulo, descripcion }, indice) => (
                <li key={titulo}>
                  <h3>{String(indice + 1).padStart(2, "0")} · {titulo}</h3>
                  <p>{descripcion}</p>
                </li>
              ))}
            </ol>
            <div className="seo-callout">
              <strong>No son cinco sesiones ni una secuencia obligatoria.</strong>
              <p>
                Algunas etapas se solapan o se retoman. La duración y el tipo de atención dependen
                del motivo de consulta, la evolución y las decisiones que vayamos tomando.
              </p>
            </div>
          </section>

          <section aria-labelledby="ambitos-title">
            <h2 id="ambitos-title">¿Es igual en psicología y neuropsicología?</h2>
            <p>
              Comparten la necesidad de comprender, explicar y orientar las decisiones,
              pero el recorrido no siempre tiene el mismo objetivo.
            </p>
            <div className="captacion-grid two">
              <div className="captacion-card">
                <p className="captacion-index">PSICOLOGÍA SANITARIA</p>
                <h3>Intervención psicológica</h3>
                <p>
                  Formulamos las dificultades, acordamos objetivos terapéuticos y revisamos
                  los cambios en síntomas, relaciones, hábitos o funcionamiento cotidiano.
                  También valoramos cuándo es adecuado finalizar o espaciar las sesiones.
                </p>
                <a href="/psicologia/">Conocer el servicio de psicología →</a>
              </div>
              <div className="captacion-card">
                <p className="captacion-index">NEUROPSICOLOGÍA</p>
                <h3>Evaluación y orientación</h3>
                <p>
                  Integramos la historia clínica, las pruebas pertinentes y la repercusión
                  funcional para interpretar el perfil cognitivo. El proceso puede concluir
                  con una devolución y recomendaciones, sin requerir tratamiento posterior.
                </p>
                <a href="/evaluacion-neuropsicologica/">Conocer la evaluación neuropsicológica →</a>
              </div>
            </div>
          </section>

          <section aria-labelledby="seguimiento-title">
            <h2 id="seguimiento-title">Revisar el progreso también forma parte de la atención</h2>
            <p>
              No solo importa que disminuya el malestar. También revisamos si puedes
              desenvolverte mejor en aquello que motivó la consulta, si persisten dificultades
              relevantes y si los objetivos iniciales siguen teniendo sentido.
            </p>
            <p>
              Si notas mejoría temprana, podemos valorar juntos si los objetivos se han
              alcanzado, si conviene consolidar lo conseguido o si es oportuno cerrar.
              No hay un número mínimo de sesiones que debas completar.
            </p>
          </section>

          <section aria-labelledby="espacio-title">
            <h2 id="espacio-title">Recursos entre sesiones, cuando aportan valor</h2>
            <p>
              En algunos procesos podemos utilizar <a href="/mi-espacio/">Mi espacio</a>,
              el área privada para pacientes. Permite consultar los materiales y los objetivos
              que haya decidido compartir contigo expresamente. La información clínica interna
              no se publica automáticamente en ese espacio.
            </p>
            <p>
              El trabajo entre sesiones es complementario a la atención profesional y se propone
              cuando resulta apropiado. No sustituye la sesión clínica ni constituye una
              exigencia para que el proceso avance.
            </p>
          </section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica sobre el proceso">
          <div className="seo-card">
            <h2>Primera visita</h2>
            <p>
              Dedicamos la primera sesión a comprender tu motivo de consulta, los antecedentes
              relevantes y qué necesitas en este momento. A partir de ahí acordamos los pasos
              siguientes.
            </p>
            <ul className="seo-facts">
              <li><span>Duración</span><strong>60 minutos</strong></li>
              <li><span>Modalidades</span><strong>Presencial y online</strong></li>
              <li><span>Ubicación</span><strong>Arenys de Mar</strong></li>
            </ul>
            <a className="editorial-btn editorial-btn-primary" href="/cita/">Solicitar cita</a>
          </div>

          <div className="seo-card">
            <h2>¿Cuándo termina?</h2>
            <p>
              El cierre puede llegar cuando se han alcanzado los objetivos, cuando deseas
              detener el proceso o cuando otro tipo de atención es más adecuado.
              Lo importante es poder hablarlo y decidir cómo proceder.
            </p>
          </div>

          <div className="seo-card">
            <h2>¿Necesitas una evaluación?</h2>
            <p>
              Si tu consulta está relacionada con memoria, atención, funcionamiento cognitivo
              o posibles alteraciones del neurodesarrollo, podemos valorar si está indicada
              una evaluación neuropsicológica específica.
            </p>
            <div className="seo-related">
              <a href="/neuropsicologia/">Neuropsicología clínica</a>
              <a href="/orientacion-tdah-tea-adultos/">Orientación para TDAH o TEA en adultos</a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
