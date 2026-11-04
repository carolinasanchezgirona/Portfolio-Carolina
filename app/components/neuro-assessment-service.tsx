import type { ReactNode } from "react";

type Modality = { title: string; price: number; time: string; description: string; features: string[] };
type Step = { title: string; detail: string };
type FAQ = { question: string; answer: string };
type Props = {
  slug: string; shortName: string; eyebrow: string; title: string; lead: string;
  imageUrl: string; imageAlt: string; requestSubject: string;
  introTitle: string; intro: string[]; asideTitle: string; asideBody: string;
  modalityIntro: string; modalities: Modality[]; steps: Step[];
  faqs: FAQ[]; difference: number; caution: string;
  closingTitle: string; closingBody: string;
};

const root = "https://carolinasanchezgirona.com";

export default function NeuroAssessmentService(props: Props): ReactNode {
  const url = root + "/" + props.slug + "/";
  const requestUrl = "mailto:contact@carolinasanchezgirona.com?subject=" + encodeURIComponent(props.requestSubject);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: props.title,
    serviceType: "Evaluación psicológica y neuropsicológica en adultos",
    areaServed: ["Arenys de Mar", "Maresme", "Barcelona"],
    provider: { "@id": root + "/#carolina-sanchez-girona" },
    url,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Modalidades de evaluación",
      itemListElement: props.modalities.map((item) => ({
        "@type": "Offer", name: item.title, price: String(item.price),
        priceCurrency: "EUR", url,
      })),
    },
  };

  return (
    <main className="editorial-site tdah-page">
      <section className="seo-hero">
        <div className="editorial-wrap tdah-hero-grid">
          <div className="tdah-hero-copy">
            <p className="seo-breadcrumbs"><a href="/">Inicio</a><span>·</span><a href="/neuropsicologia/">Neuropsicología</a><span>·</span><span>{props.shortName}</span></p>
            <p className="editorial-eyebrow">{props.eyebrow}</p>
            <h1>{props.title}</h1>
            <p className="seo-lead">{props.lead}</p>
            <div className="seo-actions">
              <a className="editorial-btn editorial-btn-primary" href={requestUrl}>Solicitar valoración</a>
              <a className="editorial-btn editorial-btn-secondary" href="#modalidades">Ver modalidades y precios</a>
            </div>
            <p className="tdah-hero-note">Atención presencial en Arenys de Mar · Psicóloga General Sanitaria y Neuropsicóloga · COPC 24892</p>
          </div>
          <figure className="tdah-hero-photo">
            <img src={props.imageUrl} alt={props.imageAlt} width="800" height="1200" fetchPriority="high" decoding="async" />
          </figure>
        </div>
      </section>

      <div className="editorial-wrap tdah-main">
        <article className="seo-copy">
          <section className="tdah-method-grid">
            <div>
              <h2>{props.introTitle}</h2>
              {props.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="tdah-method-aside">
              <span className="tdah-method-number">ORIENTACIÓN CLÍNICA</span>
              <h3>{props.asideTitle}</h3>
              <p>{props.asideBody}</p>
            </div>
          </section>

          <section id="modalidades">
            <h2>Modalidades y precios</h2>
            <p>{props.modalityIntro}</p>
            <div className="tdah-modalities">
              {props.modalities.map((item) => (
                <article className="tdah-modality" key={item.title}>
                  <div className="tdah-modality-top">
                    <h3>{item.title}</h3>
                    <strong className="tdah-price">{item.price} €</strong>
                  </div>
                  <p className="tdah-time">{item.time}</p>
                  <p>{item.description}</p>
                  <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="tdah-choice">
              <div>
                <h3>¿Y si es conveniente ampliar la evaluación?</h3>
                <p>La modalidad se acuerda según el motivo de consulta. Si durante el mismo proceso está indicado ampliar el estudio y se puede aprovechar la evaluación realizada, solo se abona la diferencia de <strong>{props.difference} €</strong>, antes de realizar pruebas adicionales.</p>
              </div>
            </div>
            <p className="tdah-price-summary"><strong>Precio cerrado.</strong> Ambas opciones incluyen sesiones de evaluación, pruebas pertinentes, interpretación clínica, informe escrito y devolución. Los tratamientos posteriores se contratan aparte.</p>
          </section>

          <section>
            <h2>Cómo se realiza la evaluación</h2>
            <div className="tdah-steps">
              {props.steps.map((step, i) => (
                <div key={step.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.detail}</p></div>
              ))}
            </div>
          </section>

          <section>
            <h2>Qué conviene tener en cuenta</h2>
            <p>{props.caution}</p>
          </section>

          <section>
            <h2>Preguntas frecuentes</h2>
            <div className="tdah-faq">
              {props.faqs.map(({question, answer}) => (
                <details key={question}><summary>{question}</summary><p>{answer}</p></details>
              ))}
            </div>
          </section>
        </article>
      </div>

      <section className="editorial-section seo-authority">
        <div className="editorial-wrap seo-authority-grid">
          <div><p className="editorial-section-eyebrow">Atención individualizada</p><h2>{props.closingTitle}</h2></div>
          <div className="seo-authority-copy"><p>{props.closingBody}</p>
            <div className="seo-authority-links"><a href={requestUrl}>Solicitar valoración →</a></div>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </main>
  );
}
