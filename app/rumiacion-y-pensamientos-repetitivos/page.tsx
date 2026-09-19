import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Rumiación y pensamientos repetitivos | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para rumiación, sobrepensar y pensamientos repetitivos que generan ansiedad o bajo estado de ánimo. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/rumiacion-y-pensamientos-repetitivos/" },
  openGraph: {
    title: "Rumiación y pensamientos repetitivos | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar sobrepensamiento, preocupación repetitiva y dificultad para desconectar mentalmente.",
    url: "https://carolinasanchezgirona.com/rumiacion-y-pensamientos-repetitivos/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para rumiación y pensamientos repetitivos",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en rumiación y pensamientos repetitivos",
  url: "https://carolinasanchezgirona.com/rumiacion-y-pensamientos-repetitivos/",
};

export default function RuminationPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/ansiedad/">Ansiedad</a>
              <a href="/insomnio-y-dificultades-para-dormir/">Insomnio y dificultades para dormir</a>
              <a href="/toma-de-decisiones-e-indecision/">Toma de decisiones e indecisión</a>
              <a href="/culpa-y-dificultad-para-perdonarse/">Culpa y dificultad para perdonarse</a>
              <a href="/ansiedad-anticipatoria-y-preocupacion-excesiva/">Ansiedad anticipatoria y preocupación excesiva</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>
      <section className="seo-hero"><div className="editorial-wrap seo-hero-inner">
        <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Rumiación</span></p>
        <p className="editorial-eyebrow">Psicología General Sanitaria · Pensamiento repetitivo</p>
        <h1>Rumiación y pensamientos repetitivos</h1>
        <p className="seo-lead">Pensar sobre un problema puede ayudar a comprenderlo. La dificultad aparece cuando la mente repasa una conversación, una decisión o una preocupación una y otra vez sin acercarse a una solución y con un coste creciente en ansiedad, sueño y estado de ánimo.</p>
        <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
      </div></section>
      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Qué es la rumiación</h2><p>La rumiación es una forma de pensamiento repetitivo centrado con frecuencia en causas, consecuencias, errores, pérdidas o emociones negativas. Puede adoptar la forma de repasar lo ocurrido, intentar encontrar una explicación definitiva o preguntarse una y otra vez qué debería haberse hecho de otra manera.</p><p>No es lo mismo que reflexionar. La reflexión suele conducir a comprensión, decisión o acción. La rumiación tiende a repetir el mismo material mental sin generar un avance proporcional al tiempo y energía invertidos.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil pedir ayuda</h2><ul><li>Repasas conversaciones durante horas intentando descubrir qué significaban exactamente.</li><li>Te cuesta desconectar de una decisión incluso después de haberla tomado.</li><li>Buscas una explicación perfecta antes de poder pasar página.</li><li>El pensamiento repetitivo interfiere en sueño, concentración o descanso.</li><li>Alternas entre analizar, comprobar y volver a analizar sin sentir más claridad.</li><li>La preocupación por el futuro ocupa gran parte del día.</li><li>Sabes que pensar más no está ayudando, pero te resulta difícil detener el ciclo.</li></ul></section>
          <section><h2>Por qué se mantiene</h2><h3>La sensación de que pensar más dará control</h3><p>La mente puede tratar la incertidumbre como un problema que debería resolverse por completo. Cada nueva vuelta promete una respuesta definitiva, aunque en la práctica aumente la activación.</p><h3>Búsqueda de certeza</h3><p>Cuando existe una necesidad alta de seguridad, cualquier duda pendiente puede convertirse en una invitación a revisar, comprobar o anticipar nuevos escenarios.</p><h3>Evitar emociones difíciles</h3><p>Analizar puede funcionar temporalmente como una forma de alejarse de tristeza, enfado, culpa o miedo. El coste es quedar atrapado en el pensamiento sin procesar del todo la emoción.</p><h3>Hábitos de atención</h3><p>Cuanto más tiempo se dedica a detectar amenazas, errores o posibles explicaciones, más automática puede volverse esa forma de atender.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir aprender a distinguir reflexión de rumiación, identificar disparadores, reducir comprobaciones y búsqueda de certeza, entrenar cambio atencional y practicar una relación menos fusionada con el contenido de los pensamientos.</p><p>También puede ser necesario trabajar tolerancia a la incertidumbre, resolución de problemas, exposición a dudas no resueltas y recuperación de actividades que hayan quedado desplazadas por el sobrepensamiento.</p></section>
          <section><h2>Rumiación, ansiedad y depresión</h2><p>La rumiación puede aparecer tanto en <a href="/ansiedad/">ansiedad</a> como en <a href="/depresion/">depresión y bajo estado de ánimo</a>. En ansiedad suele orientarse más hacia amenazas futuras y necesidad de control; en depresión puede centrarse más en pérdidas, errores, autocrítica o explicaciones sobre el malestar.</p><p>También puede intensificarse cuando existen estándares muy altos o miedo a equivocarse, por lo que puede ser útil revisar <a href="/perfeccionismo-y-autoexigencia/">perfeccionismo y autoexigencia</a>.</p></section>
          <section><h2>El objetivo no es dejar la mente en blanco</h2><p>Intentar prohibirse pensar suele aumentar la vigilancia sobre el propio pensamiento. El objetivo terapéutico es poder detectar el bucle antes, dejar de alimentarlo y elegir si en ese momento conviene resolver, aceptar una incertidumbre o volver a una actividad significativa.</p><div className="seo-callout"><strong>No todo pensamiento necesita una respuesta.</strong><span>Aprender a no seguir cada hilo mental puede ser más útil que encontrar la explicación perfecta.</span></div></section>
        </article>
        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/ansiedad/">Ansiedad</a><a href="/depresion/">Depresión y bajo estado de ánimo</a><a href="/perfeccionismo-y-autoexigencia/">Perfeccionismo y autoexigencia</a><a href="/psicologia/">Psicología General Sanitaria</a></div></div>
        </aside>
      </div>
      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en ansiedad, rumiación, autocrítica, duelo y toma de decisiones desde una formulación clínica individualizada y orientada a objetivos concretos.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>
      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}