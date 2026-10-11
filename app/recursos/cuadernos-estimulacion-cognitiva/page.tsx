import type { Metadata } from "next";
import "./cuadernos.css";

const canonical = "https://carolinasanchezgirona.com/recursos/cuadernos-estimulacion-cognitiva/";

export const metadata: Metadata = {
  title: "Cuadernos de estimulación cognitiva para adultos | Dememòria",
  description: "Colección de cuadernos de estimulación cognitiva para adultos: actividades imprimibles de memoria, atención, lenguaje y funciones ejecutivas. Ediciones para particulares, profesionales y centros.",
  alternates: { canonical: "/recursos/cuadernos-estimulacion-cognitiva/" },
  openGraph: {
    title: "Cuadernos Dememòria | Estimulación cognitiva para adultos",
    description: "Una colección original de actividades cognitivas graduadas, accesibles y pensadas para personas adultas.",
    url: canonical,
    type: "website",
  },
};

const areas = [
  { title: "Memoria", subtitle: "Aprendizaje, recuerdo y memoria cotidiana", n: "01" },
  { title: "Atención", subtitle: "Selección, alternancia y control atencional", n: "02" },
  { title: "Funciones ejecutivas", subtitle: "Planificación, flexibilidad y supervisión", n: "03" },
  { title: "Lenguaje", subtitle: "Acceso léxico, comprensión y razonamiento verbal", n: "04" },
  { title: "Habilidades visuoespaciales", subtitle: "Análisis, organización y relaciones espaciales", n: "05" },
  { title: "Orientación y vida diaria", subtitle: "Secuenciación, referencias y autonomía cotidiana", n: "06" },
];

const formats = [
  {
    label: "Uso individual",
    name: "Cuaderno personal",
    price: "9,90 €",
    text: "Actividades imprimibles, explicaciones y soluciones para una única persona.",
    detail: "Licencia personal, sin reproducción o distribución comercial.",
  },
  {
    label: "Consulta",
    name: "Edición profesional",
    price: "24,90 €",
    text: "Material del paciente, solucionario, pautas de administración, niveles y registro de ejecución.",
    detail: "Licencia limitada para utilización con pacientes propios; condiciones definitivas pendientes.",
  },
  {
    label: "Residencias y centros",
    name: "Licencia institucional",
    price: "149 €",
    text: "Paquete ampliado de actividades individuales y grupales, programación y orientaciones para el equipo.",
    detail: "Precio piloto de un paquete institucional futuro, sujeto a alcance y número de usuarios.",
  },
];

const steps = [
  { n: "01", title: "Seleccionar", text: "Elegir funciones cognitivas y nivel de exigencia según objetivos y contexto de uso." },
  { n: "02", title: "Aplicar", text: "Usar tareas para adultos, legibles e imprimibles, con instrucciones completas y espacio para responder." },
  { n: "03", title: "Revisar", text: "Interpretar el desempeño con prudencia, registrar ayudas y adaptar la tarea sin convertirla en prueba diagnóstica." },
];

const faq = [
  { q: "¿Los cuadernos sirven para diagnosticar?", a: "No. Son materiales de estimulación y práctica cognitiva; sus tareas no sustituyen pruebas neuropsicológicas baremadas ni permiten establecer diagnósticos." },
  { q: "¿Son adecuados para cualquier persona con demencia?", a: "No existe un cuaderno universal. Deben considerarse el perfil neuropsicológico, el lenguaje, la visión, la motricidad, la fatiga, los intereses y el nivel de apoyo necesario." },
  { q: "¿Puedo imprimir las páginas para todos mis pacientes?", a: "La futura edición profesional contemplará un permiso de uso con pacientes propios, limitado y definido por licencia. La edición personal no autorizará su redistribución." },
  { q: "¿Ya puedo comprar los volúmenes?", a: "Todavía no. Los materiales comerciales están en revisión editorial y clínica. Puedes consultar una muestra gratuita sin registrarte." },
];

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://carolinasanchezgirona.com/" },
    { "@type": "ListItem", position: 2, name: "Recursos", item: "https://carolinasanchezgirona.com/recursos/" },
    { "@type": "ListItem", position: 3, name: "Cuadernos de estimulación cognitiva", item: canonical },
  ],
};

export default function CuadernosPage() {
  return (
    <main className="cog-series">
      <section className="cog-hero">
        <div className="editorial-wrap">
          <nav className="cog-crumb" aria-label="Ruta de navegación">
            <a href="/">Inicio</a><span aria-hidden="true">/</span>
            <a href="/recursos/">Recursos</a><span aria-hidden="true">/</span>
            <span>Cuadernos de estimulación cognitiva</span>
          </nav>
          <div className="cog-hero-grid">
            <div>
              <p className="cog-eyebrow">Colección Cuadernos Dememòria · En preparación</p>
              <h1>Entrenar la mente merece algo más que rellenar fichas.</h1>
              <p className="cog-lead">Materiales de estimulación cognitiva para personas adultas: actividades originales, variados niveles de exigencia y una maquetación diseñada para entender, trabajar y responder sin obstáculos.</p>
              <div className="cog-actions">
                <a className="editorial-btn editorial-btn-primary" href="/recursos/cuadernos-estimulacion-cognitiva/muestra/">Ver muestra gratuita</a>
                <a className="editorial-btn editorial-btn-secondary" href="#ediciones">Conocer las ediciones</a>
              </div>
              <p className="cog-quiet">Sin registro · Ejercicios de muestra · Versión imprimible</p>
            </div>
            <div className="cog-cover" aria-label="Representación ilustrativa de la portada de la colección Cuadernos Dememòria">
              <div className="cog-cover-top"><span>DEMEmòria</span><span>CUADERNOS · 01</span></div>
              <div className="cog-cover-body"><small>ESTIMULACIÓN COGNITIVA</small><strong>La mente en la vida cotidiana.</strong><span>Atención · Memoria · Flexibilidad</span></div>
              <div className="cog-cover-art" aria-hidden="true">
                <span>△</span><span>●</span><span>◇</span><span>▣</span><span>◯</span><span>△</span><span>▣</span><span>◆</span><span>○</span>
              </div>
              <div className="cog-cover-bottom">Edición para adultos · Serie original</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cog-section" aria-labelledby="cog-principles">
        <div className="editorial-wrap">
          <div className="cog-heading"><p className="cog-eyebrow">Qué encontrarás</p><h2 id="cog-principles">Actividades útiles y cuidadosamente presentadas.</h2></div>
          <div className="cog-principles">
            <article><span>01</span><h3>Retos para adultos</h3><p>Ejercicios con contexto, instrucciones claras y demandas cognitivas reconocibles. Sin infantilizar.</p></article>
            <article><span>02</span><h3>Dificultad graduada</h3><p>Niveles orientativos ajustables por el profesional. La dificultad no equivale a un diagnóstico.</p></article>
            <article><span>03</span><h3>Legibilidad real</h3><p>Buen contraste, tipografía legible, márgenes de impresión y espacio suficiente para responder.</p></article>
          </div>
        </div>
      </section>

      <section className="cog-section cog-section-wash" aria-labelledby="cog-areas">
        <div className="editorial-wrap">
          <div className="cog-heading"><p className="cog-eyebrow">Biblioteca por funciones</p><h2 id="cog-areas">Seis áreas, múltiples formas de trabajar.</h2></div>
          <div className="cog-area-grid">
            {areas.map((area) => (
              <article key={area.n} className="cog-area">
                <span className="cog-area-number">{area.n}</span>
                <h3>{area.title}</h3>
                <p>{area.subtitle}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cog-section" id="ediciones" aria-labelledby="cog-editions">
        <div className="editorial-wrap">
          <div className="cog-heading"><p className="cog-eyebrow">Tres ediciones previstas</p><h2 id="cog-editions">El mismo rigor, diferentes usos.</h2><p>Los importes son precios piloto orientativos para testar la propuesta. No hay productos disponibles para comprar todavía.</p></div>
          <div className="cog-edition-grid">
            {formats.map((format) => (
              <article key={format.label} className="cog-edition">
                <p className="cog-edition-label">{format.label}</p>
                <h3>{format.name}</h3>
                <div className="cog-price">{format.price}<span> · precio propuesto</span></div>
                <p>{format.text}</p>
                <div className="cog-license">{format.detail}</div>
                <span className="cog-availability">En preparación · No disponible para compra</span>
              </article>
            ))}
          </div>
          <p className="cog-edition-note">Las licencias, el número de páginas y el contenido definitivo se concretarán antes de abrir la venta. La edición para centros requiere un paquete más amplio que el cuaderno individual.</p>
        </div>
      </section>

      <section className="cog-section cog-section-wash" aria-labelledby="cog-use">
        <div className="editorial-wrap">
          <div className="cog-heading"><p className="cog-eyebrow">Cómo utilizar el material</p><h2 id="cog-use">Del objetivo a la actividad.</h2></div>
          <div className="cog-steps">{steps.map((step) => (
            <article key={step.n}><span>{step.n}</span><h3>{step.title}</h3><p>{step.text}</p></article>
          ))}</div>
        </div>
      </section>

      <section className="cog-section" aria-labelledby="cog-faq">
        <div className="editorial-wrap cog-faq-wrap">
          <div><p className="cog-eyebrow">Preguntas frecuentes</p><h2 id="cog-faq">Antes de empezar.</h2></div>
          <div className="cog-faq">{faq.map((item) => (
            <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>
          ))}</div>
        </div>
      </section>

      <section className="cog-final">
        <div className="editorial-wrap cog-final-grid">
          <div><p className="cog-eyebrow">Conoce la colección</p><h2>Empieza por una muestra, no por una promesa.</h2><p>Dos actividades completas y sus criterios de corrección. Puedes imprimirlas para revisar el nivel, el espacio de respuesta y la utilidad de las instrucciones.</p></div>
          <div className="cog-final-actions">
            <a className="editorial-btn editorial-btn-primary" href="/recursos/cuadernos-estimulacion-cognitiva/muestra/">Abrir muestra gratuita</a>
            <a className="editorial-btn editorial-btn-secondary" href="mailto:contact@carolinasanchezgirona.com?subject=Consulta%20sobre%20licencias%20Cuadernos%20Dememoria">Consultar licencias para centros</a>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </main>
  );
}
