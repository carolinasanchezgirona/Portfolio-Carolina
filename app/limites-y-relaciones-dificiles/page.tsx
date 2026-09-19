import type { Metadata } from "next";
import "../seo-pages.css";

export const metadata: Metadata = {
  title: "Poner límites en relaciones | Psicóloga en Arenys de Mar",
  description: "Atención psicológica para dificultad para poner límites, relaciones desgastantes, culpa al decir no y conflictos repetidos. Consulta en Arenys de Mar y online.",
  alternates: { canonical: "/limites-y-relaciones-dificiles/" },
  openGraph: {
    title: "Límites y relaciones difíciles | Carolina Sánchez Girona",
    description: "Psicología sanitaria para trabajar límites, culpa, sobreimplicación y patrones relacionales que generan desgaste.",
    url: "https://carolinasanchezgirona.com/limites-y-relaciones-dificiles/",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Psicología para límites y relaciones difíciles",
  provider: { "@type": "Person", name: "Carolina Sánchez Girona", jobTitle: "Psicóloga General Sanitaria", url: "https://carolinasanchezgirona.com" },
  areaServed: ["Arenys de Mar", "Maresme", "Barcelona", "España"],
  serviceType: "Intervención psicológica en límites y dificultades relacionales",
  url: "https://carolinasanchezgirona.com/limites-y-relaciones-dificiles/",
};

export default function BoundariesPage() {
  return (
    <main className="editorial-site">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Carolina Sánchez, inicio"><span className="brand-name">Carolina Sánchez</span><span className="brand-sub">Psicóloga · Neuropsicóloga</span></a>
        <nav className="nav" aria-label="Navegación principal"><a href="/psicologia/">Psicología</a><a href="/dependencia-emocional/">Dependencia emocional</a>
              <a href="/autoestima-y-autocritica/">Autoestima y autocrítica</a>
              <a href="/miedo-al-rechazo-y-necesidad-de-aprobacion/">Miedo al rechazo y necesidad de aprobación</a><a className="nav-cta" href="/cita/">Pedir cita</a></nav>
      </header>

      <section className="seo-hero">
        <div className="editorial-wrap seo-hero-inner">
          <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/psicologia/">Psicología</a><span>·</span><span>Límites y relaciones difíciles</span></p>
          <p className="editorial-eyebrow">Psicología General Sanitaria · Relaciones</p>
          <h1>Límites y relaciones difíciles</h1>
          <p className="seo-lead">Decir que no, expresar necesidades o sostener una decisión puede generar culpa, miedo al conflicto o temor a decepcionar. La terapia puede ayudar a construir límites más claros sin convertirlos en distancia rígida ni renunciar a los propios vínculos.</p>
          <div className="seo-actions"><a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita</a><a className="editorial-btn editorial-btn-secondary" href="#cuando-consultar">Cuándo consultar</a></div>
        </div>
      </section>

      <div className="editorial-wrap seo-layout">
        <article className="seo-copy">
          <section><h2>Poner límites no es controlar a los demás</h2><p>Un límite define qué estás dispuesto a hacer, aceptar o sostener y cómo actuarás cuando una situación te sobrepase. No garantiza que la otra persona esté de acuerdo ni sirve para cambiar su conducta por la fuerza.</p><p>Las dificultades aparecen cuando expresar una necesidad activa mucha culpa, miedo al rechazo o sensación de estar siendo egoísta. En esos casos es frecuente ceder de forma repetida y acumular malestar hasta llegar al agotamiento o al conflicto.</p></section>
          <section id="cuando-consultar"><h2>Cuándo puede ser útil trabajar los límites</h2><ul><li>Dices que sí cuando en realidad quieres decir que no.</li><li>Te cuesta expresar desacuerdo por miedo a generar conflicto.</li><li>Asumes responsabilidades que corresponden a otras personas.</li><li>Te sientes culpable después de priorizar una necesidad propia.</li><li>Acumulas enfado y terminas reaccionando cuando ya estás saturada.</li><li>Las mismas discusiones se repiten sin producir cambios claros.</li><li>Te cuesta diferenciar ayudar de hacerte cargo de todo.</li></ul></section>
          <section><h2>Qué puede dificultar poner límites</h2><h3>Miedo al rechazo</h3><p>Si el desacuerdo se interpreta como una amenaza para el vínculo, puede resultar más fácil ceder que tolerar la posibilidad de que la otra persona se moleste.</p><h3>Culpa y sobreexigencia</h3><p>Algunas personas sienten que deben estar disponibles, resolver problemas o evitar el malestar ajeno para ser consideradas buenas parejas, hijas, amigas o profesionales.</p><h3>Confundir empatía con responsabilidad</h3><p>Comprender que alguien está enfadado o triste no obliga a asumir como propia la tarea de eliminar esa emoción.</p><h3>Falta de práctica</h3><p>A veces el problema no es saber qué límite se necesita, sino no tener experiencia expresándolo de forma breve, clara y sostenida.</p></section>
          <section><h2>Cómo se trabaja en terapia</h2><p>La intervención puede incluir identificación de necesidades, revisión de creencias sobre conflicto y culpa, entrenamiento en comunicación asertiva, preparación de conversaciones difíciles y práctica de respuestas ante presión, insistencia o invalidación.</p><p>También se trabaja qué hacer después de expresar el límite, porque la dificultad suele aparecer cuando la otra persona protesta, discute o intenta negociar una decisión ya tomada.</p></section>
          <section><h2>Límites, dependencia emocional y rupturas</h2><p>La dificultad para poner límites puede formar parte de un patrón más amplio de <a href="/dependencia-emocional/">dependencia emocional</a>, especialmente cuando existe mucho miedo al abandono o necesidad de validación. También puede hacerse especialmente visible durante una <a href="/rupturas-de-pareja/">ruptura de pareja</a>.</p><p>La formulación clínica permite diferenciar si el problema es principalmente comunicativo, si existe un patrón relacional más profundo o si determinadas relaciones están generando un nivel de desgaste que requiere decisiones adicionales.</p></section>
          <section><h2>Un límite útil debe poder sostenerse</h2><p>Expresar una necesidad de forma impecable no evita que otra persona pueda reaccionar mal. Por eso el trabajo no se limita a encontrar la frase perfecta: también implica tolerar cierta incomodidad y actuar de forma coherente con el límite planteado.</p><div className="seo-callout"><strong>Un límite no necesita convencer.</strong><span>Necesita ser claro, proporcional y coherente con lo que realmente puedes sostener.</span></div></section>
        </article>

        <aside className="seo-sidebar" aria-label="Información práctica">
          <div className="seo-card"><h2>Sesión de psicología</h2><ul className="seo-facts"><li><span>Duración</span><strong>60 minutos</strong></li><li><span>Tarifa</span><strong>60 €</strong></li><li><span>Modalidad</span><strong>Presencial y online</strong></li><li><span>Pacientes</span><strong>Adultos</strong></li></ul><a className="editorial-btn editorial-btn-primary" href="/cita/">Consultar disponibilidad</a></div>
          <div className="seo-card"><h3>Áreas relacionadas</h3><div className="seo-related"><a href="/dependencia-emocional/">Dependencia emocional</a><a href="/rupturas-de-pareja/">Rupturas de pareja</a><a href="/ansiedad/">Ansiedad</a><a href="/psicologia/">Psicología General Sanitaria</a></div></div>
        </aside>
      </div>

      <section className="editorial-section seo-authority"><div className="editorial-wrap seo-authority-grid"><div><p className="editorial-section-eyebrow">Profesional responsable</p><h2>Carolina Sánchez Girona</h2><p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p></div><div className="seo-authority-copy"><p>Trabajo con adultos en dificultades relacionales, límites, ansiedad y toma de decisiones desde una formulación clínica individualizada y orientada a objetivos concretos.</p><div className="seo-authority-links"><a href="/sobre-mi/">Conocer mi trayectoria profesional →</a><a href="/psicologia/">Ver Psicología General Sanitaria →</a></div></div></div></section>

      <footer className="editorial-footer"><div className="editorial-wrap editorial-footer-inner"><div><p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p><p>Dememoria · Consulta de Psicología y Neuropsicología</p></div><div><p>Arenys de Mar · Atención online</p><p>© 2026 Carolina Sánchez Girona</p></div></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}