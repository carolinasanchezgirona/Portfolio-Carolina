import type { Metadata } from "next";
import ResourcesCatalog from "./resources-catalog";

export const metadata: Metadata = {
  title: "Recursos psicológicos y neuropsicológicos",
  description:
    "Recursos prácticos de psicología y neuropsicología sobre ansiedad, rumiación, sueño y funciones cognitivas, elaborados desde la práctica clínica.",
  alternates: { canonical: "/recursos/" },
  openGraph: {
    title: "Recursos psicológicos y neuropsicológicos | Carolina Sánchez",
    description:
      "Cuadernos y materiales prácticos de psicología y neuropsicología para pacientes, familias y profesionales.",
    url: "https://carolinasanchezgirona.com/recursos/",
    type: "website",
  },
};

export default function RecursosPage() {
  return (
    <main className="resources-page">
      <section className="resources-hero">
        <div className="editorial-wrap resources-hero-grid">
          <div>
            <p className="editorial-eyebrow">Recursos · Psicología y neuropsicología</p>
            <h1>Materiales para comprender, practicar y avanzar entre sesiones.</h1>
            <p className="resources-lead">
              Cuadernos y herramientas prácticas elaborados desde la práctica clínica, con explicaciones claras,
              ejercicios estructurados y una finalidad concreta. Sin sustituir una evaluación o intervención
              profesional cuando sea necesaria.
            </p>
          </div>
          <aside className="resources-hero-note">
            <span>Biblioteca digital</span>
            <p>
              Los materiales se incorporan progresivamente. Encontrarás recursos de acceso gratuito y
              cuadernos de pago, siempre identificados con claridad.
            </p>
          </aside>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="newsletter-title">
        <div className="editorial-wrap">
          <div style={{background:"#EAF6FB",borderRadius:22,padding:"clamp(24px,4vw,46px)",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:24}}>
            <div style={{maxWidth:650}}>
              <p style={{fontSize:13,letterSpacing:".12em",fontWeight:700,color:"#08A6A0",marginBottom:12}}>RECURSOS GRATUITOS POR CORREO</p>
              <h2 id="newsletter-title" style={{color:"#173A5E",fontFamily:"Georgia,serif",fontSize:"clamp(26px,3.5vw,38px)",margin:"0 0 12px"}}>¿Quieres recibir nuevos cuadernos y ejercicios?</h2>
              <p style={{color:"#35516C",lineHeight:1.7,margin:0}}>Suscríbete para recibir recursos de psicología y neuropsicología y novedades de la consulta. Puedes darte de baja cuando quieras.</p>
            </div>
            <a className="editorial-btn editorial-btn-primary" href="/suscribete/" style={{whiteSpace:"normal",textAlign:"center"}}>Quiero recibir recursos gratuitos →</a>
          </div>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="destacados-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head resources-heading">
            <p className="editorial-section-eyebrow">Recursos</p>
            <h2 id="destacados-title">Psicología aplicada y neuropsicología.</h2>
            <p>
              La biblioteca crecerá priorizando calidad, utilidad clínica y actualización, sin convertir la web en un
              catálogo masivo de materiales.
            </p>
          </div>
          <ResourcesCatalog />
        </div>
      </section>

      <section className="editorial-section resources-free" aria-labelledby="cuadernos-dememoria-title">
        <div className="editorial-wrap resources-free-grid">
          <div>
            <p className="editorial-section-eyebrow">Nueva colección · Neuropsicología</p>
            <h2 id="cuadernos-dememoria-title">Cuadernos Dememòria: estimulación cognitiva para adultos.</h2>
          </div>
          <div>
            <p>Una colección original de actividades de atención, memoria y funciones ejecutivas, pensada para personas adultas, profesionales y centros. Los volúmenes comerciales están en preparación; ya puedes consultar una muestra gratuita, imprimible y con soluciones.</p>
            <a className="editorial-btn editorial-btn-primary" href="/recursos/cuadernos-estimulacion-cognitiva/">Conocer la colección</a>
            <a className="editorial-btn editorial-btn-secondary" href="/recursos/cuadernos-estimulacion-cognitiva/muestra/">Ver muestra gratuita</a>
          </div>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="podcast-resources-title">
        <div className="editorial-wrap resources-free-grid">
          <div><p className="editorial-section-eyebrow">Escuchar · Podcast</p><h2 id="podcast-resources-title">Psicología Incómoda.</h2></div>
          <div>
            <p>Psicología, historias y preguntas que no siempre tienen respuestas cómodas. Escucha los episodios, explora los temas y encuentra lecturas relacionadas sin salir de la web.</p>
            <a className="editorial-btn editorial-btn-secondary" href="/podcast/">Explorar el podcast ↗</a>
          </div>
        </div>
      </section>

      <section className="resources-audiences" aria-labelledby="audiences-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head resources-heading">
            <p className="editorial-section-eyebrow">Biblioteca en crecimiento</p>
            <h2 id="audiences-title">Recursos según para quién estén pensados.</h2>
          </div>
          <div className="resources-audience-grid">
            <article><span>01</span><h3>Uso personal</h3><p>Cuadernos de trabajo sobre ansiedad, sueño, duelo, autoestima y regulación emocional.</p></article>
            <article><span>02</span><h3>Neuropsicología</h3><p>Materiales de memoria, atención, funciones ejecutivas y estimulación cognitiva para el día a día.</p></article>
            <article><span>03</span><h3>Profesionales</h3><p>Psicoeducación, registros y hojas de trabajo preparadas para integrar en la práctica clínica.</p></article>
          </div>
        </div>
      </section>

      <section className="editorial-section resources-free" aria-labelledby="free-title">
        <div className="editorial-wrap resources-free-grid">
          <div><p className="editorial-section-eyebrow">Recursos gratuitos</p><h2 id="free-title">Materiales para descargar y utilizar.</h2></div>
          <div>
            <p>La biblioteca incluye y seguirá incorporando materiales gratuitos de apoyo y psicoeducación.</p>
            <a className="editorial-btn editorial-btn-secondary" href="/articulos/">Ver artículos</a>
          </div>
        </div>
      </section>

      <section className="editorial-section resources-clinical-note">
        <div className="editorial-wrap">
          <p>Estos materiales tienen finalidad psicoeducativa y de apoyo. No constituyen diagnóstico, tratamiento ni sustituyen una valoración psicológica o neuropsicológica individualizada.</p>
        </div>
      </section>
    </main>
  );
}
