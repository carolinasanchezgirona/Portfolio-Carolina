import type { Metadata } from "next";
import Image from "next/image";
import SocialLinks from "./components/social-links";

export const metadata: Metadata = {
  title: "Carolina Sánchez Girona | Psicóloga y Neuropsicóloga",
  description:
    "Psicóloga y neuropsicóloga en Arenys de Mar. Psicología para adultos, ansiedad, duelo, problemas de memoria y deterioro cognitivo. Presencial y online.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Carolina Sánchez Girona | Psicóloga y Neuropsicóloga",
    description:
      "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online.",
    url: "https://carolinasanchezgirona.com/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Carolina Sánchez Girona | Psicóloga y Neuropsicóloga",
    description:
      "Psicología sanitaria y neuropsicología clínica en Arenys de Mar y online.",
  },
};

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function HomePage() {
  return (
    <main className="editorial-site">
      <section className="editorial-hero" id="inicio">
        <div className="editorial-wrap editorial-hero-grid">
          <div className="editorial-hero-copy">
            <p className="editorial-eyebrow">Carolina Sánchez · Psicología sanitaria y neuropsicología</p>
            <h1>Psicóloga sanitaria y neuropsicóloga en Arenys de Mar.</h1>
            <p className="editorial-hero-statement">Comprender qué te ocurre es el primer paso para abordarlo.</p>
            <p className="editorial-lead">
              Ofrezco atención psicológica y neuropsicológica a personas adultas y familias. Combino
              evaluación clínica, intervención y orientación práctica adaptadas a cada situación.
            </p>
            <div className="editorial-actions">
              <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita <Arrow /></a>
              <a className="editorial-btn editorial-btn-secondary" href="#como-trabajo">Cómo trabajo</a>
            </div>
            <div className="editorial-meta" aria-label="Información práctica">
              <span>60 minutos</span>
              <span>Psicología 60 € · Neuropsicología 75 €</span>
              <span>Presencial y online</span>
            </div>
          </div>

          <figure className="editorial-photo">
            <Image
              className="editorial-photo-image"
              src="/carolina-sanchez-portada-720.webp"
              alt="Carolina Sánchez, psicóloga y neuropsicóloga"
              width={720}
              height={1080}
              sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 900px) 520px, 360px"
              quality={82}
              priority
              fetchPriority="high"
              unoptimized
            />
          </figure>
        </div>
      </section>

      <section className="editorial-trust" aria-label="Información profesional y práctica">
        <div className="editorial-wrap editorial-trust-grid">
          <div><strong>COPC 24892</strong><span>Psicóloga General Sanitaria</span></div>
          <div><strong>5,0 / 5</strong><span>27 reseñas en Google</span></div>
          <div><strong>Arenys de Mar</strong><span>Consulta presencial</span></div>
          <div><strong>Reserva online</strong><span>Disponibilidad en tiempo real</span></div>
        </div>
      </section>

      <section className="editorial-section" id="areas" aria-labelledby="areas-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Áreas de trabajo</p>
            <h2 id="areas-title">¿En qué puedo ayudarte?</h2>
          </div>

          <div className="editorial-service-grid">
            <article className="editorial-service-card editorial-service-teal" id="psicologia">
              <div className="editorial-accent" />
              <p className="editorial-card-kicker">Psicología sanitaria</p>
              <h3>Psicología</h3>
              <p className="editorial-card-hook">Cuando lo que sientes empieza a afectar a tu vida.</p>
              <p className="editorial-card-copy">
                Atención a dificultades de <a href="/ansiedad/">ansiedad</a>, estado de ánimo,
                relaciones, <a href="/duelo/">duelo</a> y cambios vitales. Un espacio para
                comprender el malestar y trabajar con objetivos concretos.
              </p>
              <div className="editorial-card-bottom">
                <p className="editorial-card-price">60 € <span>· Sesión de 60 minutos</span></p>
                <a className="editorial-card-link" href="/psicologia/">Conocer psicología →</a>
              </div>
            </article>

            <article className="editorial-service-card editorial-service-coral" id="neuropsicologia">
              <div className="editorial-accent" />
              <p className="editorial-card-kicker">Evaluación e intervención</p>
              <h3>Neuropsicología</h3>
              <p className="editorial-card-hook">Cuando aparecen cambios en la memoria, la atención o la conducta.</p>
              <p className="editorial-card-copy">
                Evaluación de <a href="/problemas-de-memoria/">memoria</a>, atención y funciones ejecutivas,
                así como de cambios cognitivos. También realizo
                <a href="/evaluacion-tdah-adultos/"> evaluaciones de TDAH en adultos</a> y
                <a href="/evaluacion-tea-adultos/"> evaluaciones de TEA en adultos</a>, según la indicación clínica.
              </p>
              <div className="editorial-card-bottom">
                <p className="editorial-card-price">75 € <span>· Sesión de 60 minutos</span></p>
                <p className="editorial-card-note">Las evaluaciones completas tienen un presupuesto específico.</p>
                <a className="editorial-card-link" href="/neuropsicologia/">Conocer neuropsicología →</a>
              </div>
            </article>
          </div>
          <div style={{marginTop:"1.5rem"}}>
            <article className="editorial-service-card" style={{maxWidth:"100%",border:"1px solid #A0A0A0",background:"#F2EFE7"}}>
              <div className="editorial-accent" style={{background:"#809DA8"}} />
              <p className="editorial-card-kicker">Asesoramiento técnico especializado</p>
              <h3>Consultoría neuropsicológica</h3>
              <p className="editorial-card-hook">Cuando una cuestión jurídica necesita una valoración rigurosa del funcionamiento cognitivo.</p>
              <p className="editorial-card-copy">Evaluaciones e informes neuropsicológicos, autonomía y necesidades de apoyo, y asesoramiento técnico a despachos de abogados, familias y particulares.</p>
              <div className="editorial-card-bottom">
                <p className="editorial-card-note">Presupuesto individual según el alcance del encargo.</p>
                <a className="editorial-card-link" href="/consultoria-neuropsicologica-juridica/">Conocer el servicio →</a>
              </div>
            </article>
          </div>
        </div>
      </section>


      <section className="captacion-section" aria-labelledby="orientacion-title">
        <div className="editorial-wrap">
          <p className="editorial-section-eyebrow">Orientación antes de evaluar</p>
          <h2 id="orientacion-title">¿Dudas entre TDAH, TEA u otra explicación?</h2>
          <p className="captacion-intro">La falta de concentración, las dificultades para organizarse o la sensación de no encajar pueden tener distintas explicaciones, incluso coexistentes. Una entrevista clínica ayuda a decidir qué valoración tiene sentido antes de comenzar un proceso de evaluación.</p>
          <div className="captacion-grid">
            <article className="captacion-card"><span className="captacion-index">TDAH ADULTO</span><h3>Atención, impulsividad y organización</h3><p>Explorar síntomas persistentes, antecedentes y repercusión funcional sin asumir un diagnóstico de entrada.</p><a href="/evaluacion-tdah-adultos/">Conocer la evaluación →</a></article>
            <article className="captacion-card"><span className="captacion-index">TEA ADULTO</span><h3>Comunicación, interacción y perfil sensorial</h3><p>Comprender la trayectoria evolutiva y las características del funcionamiento actual.</p><a href="/evaluacion-tea-adultos/">Conocer la evaluación →</a></article>
            <article className="captacion-card"><span className="captacion-index">DIAGNÓSTICO DIFERENCIAL</span><h3>No todo es TDAH o TEA</h3><p>Ansiedad, sueño, estado de ánimo y otros factores pueden explicar parte de las dificultades.</p><a href="/orientacion-tdah-tea-adultos/">Ayuda para orientarte →</a></article>
          </div>
          <div className="captacion-actions"><a className="editorial-btn editorial-btn-primary" href="/orientacion-tdah-tea-adultos/">No sé qué evaluación necesito →</a><a className="editorial-btn editorial-btn-secondary" href="https://wa.me/34604974857?text=Hola%2C%20quisiera%20informaci%C3%B3n%20administrativa%20sobre%20una%20primera%20visita." target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
          <p className="captacion-disclaimer">WhatsApp exclusivamente para información sobre horarios y reserva. No envíes datos clínicos ni informes por este canal.</p>
        </div>
      </section>

      <section className="editorial-section editorial-method" id="como-trabajo" aria-labelledby="metodo-title">
        <div className="editorial-wrap">
          <div className="editorial-section-head">
            <p className="editorial-section-eyebrow">Cómo trabajo</p>
            <h2 id="metodo-title">Evaluar, comprender y acompañar.</h2>
            <p className="editorial-method-intro">
              El proceso comienza escuchando el motivo de consulta y comprendiendo su contexto.
              A partir de la evaluación clínica, definimos objetivos y revisamos la evolución.
            </p>
          </div>

          <div className="editorial-method-editorial-layout">
            <figure className="editorial-method-portrait">
              <Image
                src="/carolina-sanchez-como-trabajo.webp"
                alt="Carolina Sánchez trabajando con una libreta"
                width={540}
                height={960}
                sizes="(max-width: 680px) 240px, (max-width: 900px) 270px, 310px"
                loading="lazy"
              />
            </figure>
            <div className="editorial-method-list" aria-label="Fases del proceso clínico">
              <div className="editorial-method-item">
                <span className="editorial-method-number" aria-hidden="true">01</span>
                <div><h3>Comprender</h3><p>Explorar el motivo de consulta, la historia clínica y el contexto.</p></div>
              </div>
              <div className="editorial-method-item">
                <span className="editorial-method-number" aria-hidden="true">02</span>
                <div><h3>Formular</h3><p>Integrar los datos y formular hipótesis clínicas fundamentadas.</p></div>
              </div>
              <div className="editorial-method-item">
                <span className="editorial-method-number" aria-hidden="true">03</span>
                <div><h3>Intervenir</h3><p>Acordar objetivos y seleccionar intervenciones ajustadas.</p></div>
              </div>
              <div className="editorial-method-item">
                <span className="editorial-method-number" aria-hidden="true">04</span>
                <div><h3>Revisar</h3><p>Revisar la evolución y ajustar el plan cuando sea necesario.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-reviews" aria-labelledby="google-reviews-title">
        <div className="editorial-wrap editorial-reviews-grid">
          <div>
            <p className="editorial-section-eyebrow">Valoraciones en Google</p>
            <h2 id="google-reviews-title">5,0 de 5 · 27 reseñas</h2>
          </div>
          <div className="editorial-reviews-copy">
            <p>
              Puedes consultar las opiniones publicadas en Google sobre la atención recibida en mi consulta de Arenys de Mar.
            </p>
            <a
              className="editorial-card-link"
              href="https://maps.app.goo.gl/ubCSFYZRgbv7vpqF9"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver reseñas en Google →
            </a>
          </div>
        </div>
      </section>


      <section className="captacion-section" aria-labelledby="testimonios-title">
        <div className="editorial-wrap">
          <p className="editorial-section-eyebrow">Opiniones publicadas</p>
          <h2 id="testimonios-title">La experiencia de quienes han acudido a consulta</h2>
          <p className="captacion-intro">Fragmentos breves de opiniones reales publicadas voluntariamente en Doctoralia, reproducidos sin datos identificativos. Las experiencias individuales no garantizan resultados similares.</p>
          <div className="captacion-review-grid">
            <figure className="captacion-quote">
              <blockquote>“Se nota el tiempo que invierte en preparar cada visita”</blockquote>
              <figcaption>Opinión pública · Doctoralia · octubre de 2025</figcaption>
            </figure>
            <figure className="captacion-quote">
              <blockquote lang="ca">“Mai m’he sentit un número, sinó una persona cuidada”</blockquote>
              <figcaption>Opinión pública · Doctoralia · mayo de 2026</figcaption>
            </figure>
          </div>
          <div className="captacion-actions"><a className="editorial-card-link" href="https://www.doctoralia.es/carolina-sanchez-girona/psicologo/arenys-de-mar" target="_blank" rel="noopener noreferrer">Consultar opiniones originales en Doctoralia →</a><a className="editorial-card-link" href="https://maps.app.goo.gl/ubCSFYZRgbv7vpqF9" target="_blank" rel="noopener noreferrer">Ver las 27 reseñas de Google →</a></div>
        </div>
      </section>

      <section className="editorial-section editorial-local" aria-labelledby="local-title">
        <div className="editorial-wrap">
          <div className="editorial-local-heading">
            <p className="editorial-section-eyebrow">Consulta en el Maresme</p>
            <h2 id="local-title">Psicología y neuropsicología en Arenys de Mar.</h2>
          </div>
          <div className="editorial-local-grid">
            <a className="editorial-local-photo" href="/psicologa-arenys-de-mar/" aria-label="Ver fotografías de la consulta en Arenys de Mar">
              <Image src="/consulta-carolina-sanchez-despacho.webp" alt="Interior de la consulta de psicología y neuropsicología de Carolina Sánchez en Arenys de Mar" width={1448} height={1086} sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 900px) 560px, 520px" loading="lazy" />
            </a>
            <div className="editorial-local-copy">
              <p>Mi consulta está en Carrer Barcelona 8, Local, en Arenys de Mar.</p>
              <p>Un espacio para la atención psicológica, la evaluación neuropsicológica y el acompañamiento a personas adultas y familias.</p>
              <a className="editorial-card-link" href="/psicologa-arenys-de-mar/">Ver la consulta y cómo llegar <Arrow /></a>
              <a className="editorial-card-link" href="/psicologa-maresme/">Atención psicológica en el Maresme <Arrow /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-about" id="sobre-mi" aria-labelledby="about-title">
        <div className="editorial-wrap editorial-about-grid editorial-about-refined">
          <div className="editorial-about-content">
            <p className="editorial-section-eyebrow">Sobre mí</p>
            <h2 id="about-title">Carolina Sánchez Girona</h2>
            <p className="editorial-role">Psicóloga General Sanitaria · Neuropsicóloga</p>
            <div className="editorial-about-copy">
              <p>
                Trabajo en psicología sanitaria y neuropsicología clínica con personas adultas.
                Atiendo dificultades emocionales y del comportamiento, y realizo evaluaciones
                del funcionamiento cognitivo, incluyendo memoria, atención y funciones ejecutivas.
                Integro la entrevista clínica, la evaluación estructurada y el contexto personal
                para orientar cada intervención.
              </p>
              <p>
                Participo también en divulgación profesional y he publicado en PsiAra,
                la revista del Col·legi Oficial de Psicologia de Catalunya.
              </p>
            </div>
            <div className="captacion-trust-strip" aria-label="Referencias profesionales"><span>Psicóloga General Sanitaria · COPC 24892</span><span>Experiencia en clínica de adultos y demencias</span><span>Publicaciones en PsiAra e ICAB</span></div>
            <a className="editorial-about-more" href="/sobre-mi/">Conocer mi trayectoria profesional →</a>
            <p><a className="editorial-card-link" href="https://psiara.cat/2026/08/05/la-capacitat-per-testar-en-el-dret-civil-catala-des-duna-perspectiva-neuropsicologica/" target="_blank" rel="noopener noreferrer">Leer una publicación profesional en PsiAra →</a></p>
            <SocialLinks className="editorial-about-social" />
          </div>
          <figure className="editorial-about-photo">
            <Image
              src="/carolina-sanchez-sobre-mi.webp"
              alt="Carolina Sánchez sentada en una terraza luminosa rodeada de plantas"
              width={540}
              height={810}
              sizes="(max-width: 680px) min(100vw - 36px, 300px), (max-width: 900px) 320px, 345px"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <section className="editorial-section editorial-first-visit" aria-labelledby="first-visit-home-title">
        <div className="editorial-wrap editorial-first-visit-grid">
          <div>
            <p className="editorial-section-eyebrow">Antes de venir</p>
            <h2 id="first-visit-home-title">¿Cómo será nuestra primera sesión?</h2>
          </div>
          <div className="editorial-first-visit-copy">
            <p>La primera sesión dura 60 minutos. Hablaremos de lo que te preocupa, revisaremos los antecedentes relevantes y valoraremos los siguientes pasos. Puedes traer informes previos si dispones de ellos.</p>
            <a className="editorial-card-link" href="/psicologa-arenys-de-mar/">Cómo llegar y preparar la visita <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-closing-cta" aria-labelledby="closing-cta-title">
        <div className="editorial-wrap editorial-closing-cta-inner">
          <div>
            <p className="editorial-section-eyebrow">Reserva</p>
            <h2 id="closing-cta-title">¿Hablamos? Consulta los horarios y elige cuándo quieres venir.</h2>
            <p className="editorial-closing-prices">Psicología: 60 € · Neuropsicología: 75 € · Sesiones de 60 minutos</p>
          </div>
          <a className="editorial-btn editorial-btn-primary" href="/cita/">Pedir cita <Arrow /></a>
        </div>
      </section>

    </main>
  );
}
