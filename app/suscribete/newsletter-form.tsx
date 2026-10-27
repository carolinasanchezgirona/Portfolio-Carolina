"use client";
import { useState, type FormEvent } from "react";
import { NEWSLETTER_CONSENT_TEXT, NEWSLETTER_POLICY_VERSION } from "../../supabase/functions/newsletter-subscribe/policy";

export default function NewsletterForm() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);
    setSending(true); setMessage("");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ email: data.get("email"), consent: data.get("consent") === "on", policyVersion: NEWSLETTER_POLICY_VERSION, website: data.get("website") || "" }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(typeof result.error === "string" ? result.error : "No se ha podido tramitar la solicitud.");
      setSubmitted(true);
      setMessage("Solicitud recibida. Si procede confirmar el alta, recibirás un correo con el enlace. Revisa también la carpeta de correo no deseado. No se activa una nueva suscripción sin confirmar tu dirección.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se ha podido conectar. Inténtalo más tarde."); }
    finally { setSending(false); }
  }
  return <div className="newsletter-form-wrap">
    <div className="privacy-summary" id="newsletter-privacy">
      <p><strong>Responsable:</strong> Carolina Sánchez Girona (Dememoria). <strong>Finalidad:</strong> enviarte recursos, contenidos, novedades y comunicaciones comerciales de sus servicios. <strong>Base jurídica:</strong> tu consentimiento.</p>
      <p><strong>Proveedor:</strong> Brevo, para gestionar la lista y el envío; la infraestructura y las garantías de posibles transferencias se detallan en la <a href="/privacidad/#proveedores">política de privacidad</a>. Conservación: mientras mantengas la suscripción y, después, las evidencias necesarias durante los plazos legales aplicables.</p>
      <p><strong>Derechos y baja:</strong> puedes retirar el consentimiento desde cada comunicación o escribir a <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a>. <a href="/privacidad/">Información completa de privacidad</a>.</p>
    </div>
    {!submitted ? <form onSubmit={submit} className="newsletter-form" aria-describedby="newsletter-privacy" aria-busy={sending}>
      <label htmlFor="newsletter-email">Tu correo electrónico</label>
      <input id="newsletter-email" name="email" type="email" autoComplete="email" maxLength={254} required disabled={sending} />
      <div className="newsletter-honeypot" aria-hidden="true"><label htmlFor="newsletter-website">Web</label><input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <label className="newsletter-consent"><input name="consent" type="checkbox" required disabled={sending} /><span>{NEWSLETTER_CONSENT_TEXT} He leído la <a href="/privacidad/" target="_blank" rel="noopener noreferrer">política de privacidad</a>.</span></label>
      <button className="editorial-btn editorial-btn-primary" type="submit" disabled={sending}>{sending ? "Tramitando…" : "Solicitar mi suscripción gratuita"}</button>
      <p className="newsletter-note">Te enviaremos un enlace para confirmar tu correo. Suscribirte no es necesario para descargar los recursos gratuitos ni para recibir atención psicológica.</p>
      <noscript>Activa JavaScript para utilizar el formulario. Puedes descargar los recursos gratuitos sin registrarte.</noscript>
    </form> : null}
    <p className="newsletter-message" role="status" aria-live="polite">{message}</p>
  </div>;
}
