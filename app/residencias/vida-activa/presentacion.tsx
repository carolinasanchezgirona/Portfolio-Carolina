"use client";

import { useEffect, useRef, useState } from "react";

const total = 6;
const photo = {
  artist: "https://images.pexels.com/photos/6023595/pexels-photo-6023595.jpeg?auto=compress&cs=tinysrgb&w=1400",
  group: "https://images.pexels.com/photos/32817759/pexels-photo-32817759.jpeg?auto=compress&cs=tinysrgb&w=1400",
  workshop: "https://images.pexels.com/photos/6023607/pexels-photo-6023607.jpeg?auto=compress&cs=tinysrgb&w=1400",
  detail: "https://images.pexels.com/photos/10120009/pexels-photo-10120009.jpeg?auto=compress&cs=tinysrgb&w=1200",
} as const;

const titles = [
  "Vida Activa",
  "Una programación con sentido",
  "Una semana con variedad",
  "Una propuesta paso a paso",
  "Materiales pensados para utilizarse",
  "Distintos centros. Distintas necesidades",
] as const;

function SlideHeader({ section, number }: { section: string; number: number }) {
  return (
    <div className="va-slide-top">
      <div className="va-slide-brand">DEMEMÒRIA</div>
      <p>VIDA ACTIVA <span aria-hidden="true">·</span> PROGRAMAS PARA CENTROS</p>
      <div className="va-slide-ribbon"><span>{String(number).padStart(2, "0")}</span> / {section}</div>
    </div>
  );
}

function SlideFooter({ page }: { page: number }) {
  return <div className="va-slide-footer"><span>VIDA ACTIVA / DOSSIER PROFESIONAL</span><span>{String(page).padStart(2, "0")} / 06</span></div>;
}

function Picture({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={"va-slide-picture " + className}>
      {/* Las fotografías proceden de un banco de imágenes y son ilustrativas. */}
      <img loading="eager" decoding="async" src={src} alt={alt} />
    </figure>
  );
}

function Slide({ page }: { page: number }) {
  switch (page) {
    case 1:
      return <div className="va-slide-layout va-cover">
        <div className="va-cover-copy">
          <div className="va-cover-meta"><strong>DEMEMÒRIA</strong><span>DOSSIER PROFESIONAL / 2026</span></div>
          <div className="va-cover-main">
            <h3><span>Vida</span><span>Activa.</span></h3>
            <div className="va-cover-rule" />
            <strong className="va-cover-tagline">Más vida en cada día.</strong>
            <p>Programas de actividades significativas para residencias y centros de día.</p>
          </div>
          <div className="va-cover-bottom"><span>PENSAR · CREAR · COMPARTIR</span><span>01 / 06</span></div>
        </div>
        <Picture src={photo.artist} alt="Mujer mayor realizando una actividad artística en una mesa de trabajo" className="va-cover-photo" />
      </div>;
    case 2:
      return <div className="va-slide-layout va-interior">
        <SlideHeader section="UNA MIRADA DISTINTA" number={1} />
        <div className="va-slide-two-col va-intro-grid">
          <div>
            <h3>Una programación <em>con sentido.</em></h3>
            <p>Las personas que viven en una residencia no son un grupo homogéneo. Tienen historias, intereses, capacidades y necesidades de apoyo distintas.</p>
            <p>Una buena programación abre oportunidades para participar, elegir, crear, conversar, moverse o descansar.</p>
          </div>
          <div className="va-photo-stack">
            <Picture src={photo.group} alt="Personas mayores compartiendo una actividad creativa en grupo" />
            <blockquote>No se trata de ocupar todas las horas. Se trata de abrir más posibilidades de vivirlas.</blockquote>
          </div>
        </div>
        <div className="va-benefits">
          <div><span className="va-tile-icon va-lilac" aria-hidden="true">✳</span><strong>PARA LAS PERSONAS</strong><p>Propuestas variadas, participación voluntaria y alternativas significativas.</p></div>
          <div><span className="va-tile-icon va-blue" aria-hidden="true">✦</span><strong>PARA LOS EQUIPOS</strong><p>Herramientas claras para preparar, adaptar y facilitar actividades.</p></div>
          <div><span className="va-tile-icon va-salmon" aria-hidden="true">♡</span><strong>PARA EL CENTRO</strong><p>Una programación flexible, ajustada a la realidad cotidiana.</p></div>
        </div>
        <SlideFooter page={2} />
      </div>;
    case 3:
      return <div className="va-slide-layout va-interior">
        <SlideHeader section="QUÉ INCLUYE" number={2} />
        <div className="va-slide-two-col va-areas-head">
          <div>
            <h3>Una semana <em>con variedad.</em></h3>
            <p>Cognición, vida cotidiana, creatividad, cultura, movimiento y vínculo. La programación se adapta a los recursos disponibles y a las características de cada centro.</p>
          </div>
          <Picture src={photo.workshop} alt="Personas mayores participando en un taller artístico compartido" />
        </div>
        <div className="va-areas-grid">
          <div className="va-yellow"><span aria-hidden="true">01</span><div><strong>COGNICIÓN</strong><p>Atención, memoria, lenguaje, orientación y funciones ejecutivas en tareas significativas.</p></div></div>
          <div className="va-lilac"><span aria-hidden="true">02</span><div><strong>PARTICIPACIÓN</strong><p>Proyectos, actividades cotidianas y oportunidades de elección con sentido personal.</p></div></div>
          <div className="va-salmon"><span aria-hidden="true">03</span><div><strong>BIENESTAR Y VÍNCULO</strong><p>Conversación, identidad, reminiscencia y conexión social sin exigir recuerdos.</p></div></div>
          <div className="va-pale-blue"><span aria-hidden="true">04</span><div><strong>MOVIMIENTO Y AUTONOMÍA</strong><p>Actividad funcional coordinada con los profesionales correspondientes.</p></div></div>
        </div>
        <SlideFooter page={3} />
      </div>;
    case 4:
      return <div className="va-slide-layout va-interior">
        <SlideHeader section="PILOTO DE CUATRO SEMANAS" number={3} />
        <div className="va-slide-two-col va-pilot-head">
          <div>
            <h3>Una propuesta <em>paso a paso.</em></h3>
            <p>Podemos estudiar un piloto dimensionado según las unidades, horarios, espacios y recursos del centro. Antes de iniciar la colaboración, se acuerdan alcance, disponibilidad, precio y condiciones.</p>
          </div>
          <Picture src={photo.detail} alt="Detalle de una persona mayor pintando con pinceles durante una actividad creativa" />
        </div>
        <div className="va-pilot-bottom">
          <ol className="va-pilot-steps">
            <li><b className="va-yellow">01</b><div><strong>CONOCER</strong><p>Organización, prioridades e intereses generales, sin solicitar datos clínicos individuales.</p></div></li>
            <li><b className="va-lilac">02</b><div><strong>PROPONER</strong><p>Programación piloto, materiales y alternativas de participación.</p></div></li>
            <li><b className="va-salmon">03</b><div><strong>APLICAR Y AJUSTAR</strong><p>El equipo prueba las actividades y registra observaciones útiles.</p></div></li>
            <li><b className="va-blue">04</b><div><strong>REVISAR</strong><p>Viabilidad, utilidad percibida, participación y posibles ajustes.</p></div></li>
          </ol>
          <aside className="va-pilot-note"><strong>UN PILOTO REALISTA</strong><p>La elección y el descanso también son parte del programa.</p><p>No toda actividad es una intervención clínica.</p></aside>
        </div>
        <SlideFooter page={4} />
      </div>;
    case 5:
      return <div className="va-slide-layout va-interior">
        <SlideHeader section="MATERIALES Y ACOMPAÑAMIENTO" number={4} />
        <div className="va-materials-layout">
          <Picture src={photo.workshop} alt="Detalle de un taller con personas mayores elaborando materiales artísticos" />
          <div>
            <h3>Materiales pensados <em>para utilizarse.</em></h3>
            <p>Cada propuesta aporta la información necesaria para que el equipo valore su adecuación, prepare la actividad y pueda adaptarla.</p>
            <ul>
              <li><b className="va-yellow">01</b><div><strong>PROGRAMACIÓN SEMANAL</strong><span>Actividades por días, franjas, grupos y descansos.</span></div></li>
              <li><b className="va-lilac">02</b><div><strong>GUÍA PROFESIONAL</strong><span>Objetivo, preparación, instrucciones, apoyos y precauciones.</span></div></li>
              <li><b className="va-salmon">03</b><div><strong>MATERIAL PARA PARTICIPANTES</strong><span>Fichas claras y recursos gráficos o manipulativos.</span></div></li>
              <li><b className="va-pale-blue">04</b><div><strong>ADAPTACIONES</strong><span>Opciones según intereses y necesidades de apoyo.</span></div></li>
              <li><b className="va-yellow">05</b><div><strong>REGISTRO BREVE</strong><span>Participación, preferencias y aspectos que revisar.</span></div></li>
            </ul>
          </div>
        </div>
        <SlideFooter page={5} />
      </div>;
    default:
      return <div className="va-slide-layout va-interior va-last-slide">
        <SlideHeader section="HABLEMOS" number={5} />
        <div className="va-slide-two-col va-last-head">
          <div>
            <h3>Distintos centros. <em>Distintas necesidades.</em></h3>
            <p>Proponemos tres posibles niveles de colaboración. El contenido y las condiciones se acuerdan según la realidad de cada residencia o centro de día.</p>
          </div>
          <Picture src={photo.group} alt="Grupo de personas mayores en un espacio compartido y acogedor" />
        </div>
        <div className="va-last-options">
          <div><b className="va-yellow">01</b><strong>MATERIALES</strong><p>Programación y recursos para equipos que trabajan con autonomía.</p></div>
          <div><b className="va-lilac">02</b><strong>ACOMPAÑAMIENTO</strong><p>Materiales, orientación profesional y revisión de la implantación.</p></div>
          <div><b className="va-salmon">03</b><strong>A MEDIDA</strong><p>Diseño específico para centros con varias unidades o necesidades particulares.</p></div>
        </div>
        <div className="va-contact-banner"><div><small>¿HABLAMOS DE VUESTRO CENTRO?</small><strong>Empecemos conversando.</strong></div><div><a href="mailto:contact@carolinasanchezgirona.com?subject=Vida%20Activa%20-%20Consulta%20profesional">contact@carolinasanchezgirona.com</a><span>carolinasanchezgirona.com/residencias/</span></div></div>
        <SlideFooter page={6} />
      </div>;
  }
}

export default function VidaActivaPresentacion() {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const keepSlideVisible = () => {
    if (window.matchMedia("(max-width: 750px)").matches) {
      window.requestAnimationFrame(() => stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };
  const goToSlide = (target: number) => {
    setIndex(Math.max(0, Math.min(total - 1, target)));
    keepSlideVisible();
  };
  const advance = (direction: number) => {
    setIndex(previous => Math.min(total - 1, Math.max(0, previous + direction)));
    keepSlideVisible();
  };

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      document.body.classList.toggle("va-presentacion-en-viewport", entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.body.classList.remove("va-presentacion-en-viewport");
    };
  }, []);

  return (
    <div ref={wrapperRef} className="va-presentacion" id="presentacion-vida-activa">
      <div className="va-presentation-heading">
        <div><p className="res-eyebrow">Dossier interactivo · Vida Activa</p><h2>Conoce el programa en seis diapositivas.</h2><p>Explora la propuesta sin descargar archivos. Puedes navegar con las flechas del teclado, los controles o deslizando en el móvil.</p></div>
        <button type="button" className="va-print-button" onClick={() => window.print()}>Imprimir / guardar como PDF</button>
      </div>
      <div ref={stageRef} className="va-stage" tabIndex={0} aria-label="Presentación de Vida Activa. Utiliza las flechas izquierda y derecha para cambiar de diapositiva." onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); advance(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); advance(1); }
      }} onTouchStart={event => { startX.current = event.changedTouches[0].clientX; }} onTouchEnd={event => {
        if (startX.current === null) return;
        const delta = event.changedTouches[0].clientX - startX.current;
        if (Math.abs(delta) > 65) advance(delta > 0 ? -1 : 1);
        startX.current = null;
      }}>
        {Array.from({ length: total }, (_, i) => <article key={i} className={"va-slide" + (i === index ? " is-active" : "")} aria-label={"Diapositiva " + (i + 1) + " de 6: " + titles[i]} aria-hidden={i !== index} inert={i !== index}>
          <Slide page={i + 1} />
        </article>)}
      </div>
      <div className="va-controls res-no-print">
        <button type="button" className="va-nav-button" onClick={() => advance(-1)} disabled={index === 0} aria-label="Diapositiva anterior">← <span>Anterior</span></button>
        <div className="va-dots" aria-label="Elegir diapositiva">
          {titles.map((title, i) => <button type="button" key={title} className={"va-dot" + (i === index ? " is-active" : "")} onClick={() => goToSlide(i)} aria-label={"Ir a diapositiva " + (i + 1) + ": " + title} aria-current={i === index ? "step" : undefined} />)}
        </div>
        <button type="button" className="va-nav-button" onClick={() => advance(1)} disabled={index === total - 1}><span>Siguiente</span> →</button>
      </div>
      <p className="va-current res-no-print" role="status" aria-live="polite">Diapositiva {index + 1} de {total}: {titles[index]}</p>
      <div className="va-after res-no-print">
        <p>Presentación orientativa. Vida Activa está en fase de validación y las modalidades descritas no constituyen una oferta cerrada. Las fotografías son ilustrativas.</p>
        <div className="va-after-actions"><a className="editorial-btn editorial-btn-primary" href="/residencias/#contacto-profesional">Solicitar propuesta para mi centro</a><a className="editorial-btn editorial-btn-secondary" href="/residencias/muestra/">Ver una actividad de muestra</a></div>
      </div>
    </div>
  );
}
