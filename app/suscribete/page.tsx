import type { Metadata } from "next";
import NewsletterForm from "./newsletter-form";
import "./newsletter.css";
export const metadata: Metadata = {title:"Suscríbete a recursos gratuitos",description:"Recibe cuadernos gratuitos, ejercicios y novedades de psicología y neuropsicología de Carolina Sánchez Girona.",alternates:{canonical:"/suscribete/"}};
export default function Page() {
  return <main className="newsletter-page"><section className="newsletter-section">
    <p className="newsletter-eyebrow">PSICOLOGÍA · NEUROPSICOLOGÍA</p>
    <h1>Recursos gratuitos en tu correo</h1>
    <p className="newsletter-lead">Recibe nuevos cuadernos de ejercicios, herramientas prácticas, artículos y novedades de los servicios de Carolina Sánchez Girona.</p>
    <NewsletterForm />
    <a href="/recursos/">Explorar la biblioteca y descargar recursos sin suscripción →</a>
  </section></main>;
}
