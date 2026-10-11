import type { Metadata } from "next";
import Link from "next/link";
import PrintSampleButton from "./print-button";

export const metadata: Metadata = {
  title: "Vida Activa | Una actividad de muestra para residencias",
  description: "Consulta una actividad de demostración de Vida Activa: objetivo, preparación, instrucciones y una ficha para participantes. Solicita una propuesta profesional para tu centro.",
  alternates: { canonical: "/residencias/muestra/" },
  openGraph: {
    title: "Actividad de muestra | Vida Activa · Dememòria",
    description: "Una pequeña muestra del enfoque adulto y participativo de Vida Activa, sin publicar la programación completa.",
    url: "https://carolinasanchezgirona.com/residencias/muestra/",
    type: "article",
  }
};

export default function MuestraVidaActivaPage(){
  return <main className="res-page res-sample res-commercial">
    <section className="res-hero res-hero-compact va-commercial-hero res-no-print">
      <div className="editorial-wrap">
        <nav className="res-breadcrumb" aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span>/</span><Link href="/residencias/vida-activa/">Vida Activa</Link><span>/</span><span>Muestra</span></nav>
        <p className="res-eyebrow">Vida Activa · Demostración gratuita</p>
        <h1>Una actividad para conocer cómo trabajamos.</h1>
        <p className="res-lead">Una propuesta completa y representativa, no un calendario semanal. El material permite comprobar la calidad editorial y el enfoque profesional antes de solicitar información para una residencia o centro de día.</p>
        <div className="res-actions">
          <PrintSampleButton />
          <Link className="editorial-btn editorial-btn-primary" href="/residencias/#contacto-profesional">Solicitar propuesta para mi centro</Link>
        </div>
        <p className="res-small">La impresión incluye exclusivamente esta muestra. No se publican las restantes actividades, las guías ni los solucionarios de la Semana 01.</p>
      </div>
    </section>
    <article className="res-sample-document" aria-label="Actividad de demostración del programa Vida Activa">
      <header className="res-doc-header">
        <div><span className="res-doc-brand">DEMEMÒRIA · VIDA ACTIVA</span><h2>La portada de nuestra exposición</h2><p>Una actividad creativa y colaborativa con oportunidades de elección individual.</p></div>
        <div className="res-doc-edition">MUESTRA<br/>01 / 2026</div>
      </header>
      <section className="res-doc-section">
        <p className="res-doc-kicker">UNA ACTIVIDAD DE MUESTRA · PARTICIPACIÓN Y CREACIÓN</p>
        <h3>Crear algo que tenga un destinatario real.</h3>
        <div className="res-chip-row"><span>40–50 minutos orientativos</span><span>Grupo pequeño</span><span>Varias formas de participar</span></div>
        <p><strong>Finalidad:</strong> crear la portada de una pequeña exposición del centro a partir de fotografías, dibujos o palabras elegidas por el grupo. La participación, la expresión de preferencias y la decisión compartida son objetivos de la actividad, sin atribuir beneficios terapéuticos automáticos.</p>
        <p><strong>Preparación:</strong> disponer de papel A3, revistas o fotografías con derechos de uso, adhesivos, rotuladores de alto contraste y ejemplos de títulos. Valorar accesibilidad visual y motora, fatiga y seguridad de los materiales.</p>
        <h4>Secuencia orientativa para facilitarla</h4>
        <ol className="res-procedure">
          <li><strong>Presentar el propósito.</strong> Explicar qué se va a exponer, a quién irá dirigido y qué decisiones puede tomar cada persona.</li>
          <li><strong>Elegir los elementos.</strong> Ofrecer imágenes, palabras o materiales y permitir que cada participante escoja, comente, cree o simplemente observe.</li>
          <li><strong>Componer la portada.</strong> Acordar un título y una distribución visual. No exigir uniformidad ni que todas las personas realicen las mismas tareas.</li>
          <li><strong>Revisar y cerrar.</strong> Preguntar si la portada representa lo que el grupo desea mostrar. Proponer continuar otro día si la exposición necesita más trabajo.</li>
        </ol>
      </section>
      <section className="res-doc-section">
        <div className="res-sheet va-commercial-worksheet">
          <p className="res-sheet-label">FICHA DE PARTICIPACIÓN · DISEÑAMOS LA PORTADA</p>
          <p>Imaginad que el centro prepara una pequeña exposición titulada «Cosas que nos gustan». Cada persona puede elegir una imagen, una palabra o una idea para la portada.</p>
          <div className="va-commercial-artboard" role="img" aria-label="Espacio amplio, en blanco, para diseñar la portada de una exposición">
            <span>ESPACIO PARA COMPONER LA PORTADA</span>
          </div>
          <p className="res-task"><strong>1.</strong> ¿Qué título os gustaría dar a la exposición?</p>
          <div className="res-answer-lines" aria-hidden="true"><span/><span/></div>
          <p className="res-task"><strong>2.</strong> ¿Qué imagen, color o palabra incluirías? También puedes explicarlo oralmente.</p>
          <div className="res-answer-lines" aria-hidden="true"><span/><span/></div>
          <p className="res-task"><strong>3.</strong> ¿Dónde os gustaría mostrar esta portada y por qué?</p>
          <div className="res-answer-lines" aria-hidden="true"><span/><span/></div>
        </div>
      </section>
      <section className="res-doc-section">
        <p className="res-doc-kicker">CRITERIO PROFESIONAL</p>
        <h3>Adaptar sin infantilizar.</h3>
        <div className="res-adapt-grid">
          <div><strong>Con autonomía</strong><p>Dar libertad para debatir la línea editorial, distribuir funciones o elaborar varias alternativas de portada.</p></div>
          <div><strong>Con apoyos</strong><p>Ofrecer pocas opciones visuales, consignas graduadas y ayuda para manipular materiales, manteniendo la capacidad de elegir.</p></div>
          <div><strong>Participación individualizada</strong><p>Facilitar una elección con la mirada, un gesto o una respuesta verbal, o una aportación breve desde un entorno cómodo.</p></div>
        </div>
        <p className="res-facilitator-note"><strong>Para el equipo:</strong> la decisión de no participar también debe respetarse. No se trata de una prueba psicométrica. Antes de utilizar imágenes o relatos identificables, comprobad permisos y protocolos del centro.</p>
        <p className="res-doc-fineprint">Muestra gratuita de Vida Activa. © 2026 Carolina Sánchez Girona · Dememòria. Quedan reservados los materiales completos, las guías y los recursos asociados a la programación profesional.</p>
      </section>
    </article>
    <section className="res-section res-end-cta res-no-print">
      <div className="editorial-wrap">
        <p className="res-eyebrow">Del ejemplo a la programación de tu centro</p>
        <h2>Una ficha muestra el enfoque. La continuidad es el servicio.</h2>
        <p>Vida Activa articula actividades variadas, instrucciones para el equipo, recursos y opciones de adaptación. Podemos estudiar qué modalidad encaja con vuestra organización.</p>
        <Link href="/residencias/#contacto-profesional" className="editorial-btn editorial-btn-primary">Solicitar una propuesta para mi centro</Link>
      </div>
    </section>
  </main>;
}
