"use client";

import { useMemo, useState } from "react";

const contactEmail = "contact@carolinasanchezgirona.com";

type Size = "" | "Hasta 60" | "61–150" | "Más de 150";
type Need = "" | "Programación semanal" | "Materiales y fichas" | "Formación y asesoramiento";

export default function ResidentialEnquiry() {
  const [centre, setCentre] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState<Size>("");
  const [need, setNeed] = useState<Need>("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const message = useMemo(() => [
    "Hola, me gustaría recibir información sobre Vida Activa para nuestra residencia o centro de día.",
    "",
    "Centro: " + (centre.trim() || "No indicado"),
    "Localidad: " + (location.trim() || "No indicada"),
    "Número aproximado de plazas: " + (size || "No indicado"),
    "Interés principal: " + (need || "No indicado"),
    "Comentario sobre la programación: " + (note.trim() || "Sin comentarios adicionales"),
    "",
    "Me gustaría conocer las posibilidades de colaboración.",
  ].join("\n"), [centre, location, size, need, note]);

  const mailto = "mailto:" + contactEmail +
    "?subject=" + encodeURIComponent("Consulta de residencia | Vida Activa") +
    "&body=" + encodeURIComponent(message);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText("Para: " + contactEmail + "\nAsunto: Consulta de residencia | Vida Activa\n\n" + message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="res-contact-panel" id="contacto-profesional">
      <div className="res-contact-copy">
        <p className="res-eyebrow">Primer contacto profesional</p>
        <h2>Cuéntame cómo es tu centro.</h2>
        <p>Con unos pocos datos generales podemos valorar qué formato de programación sería útil. No necesitas preparar un informe ni compartir información de las personas residentes.</p>
        <p className="res-contact-emphasis">Sin registro, sin llamada comercial automática y sin compromiso.</p>
        <a className="res-contact-email" href={"mailto:" + contactEmail}>{contactEmail}</a>
      </div>
      <form className="res-contact-form" onSubmit={(event) => { event.preventDefault(); if(centre.trim()) window.location.href = mailto; }}>
        <label htmlFor="res-centre">Nombre del centro <span aria-hidden="true">*</span></label>
        <input id="res-centre" type="text" name="centre" autoComplete="organization" value={centre} onChange={(e) => {setCentre(e.target.value);setCopied(false)}} placeholder="Residencia o centro de día" maxLength={120} required />
        <label htmlFor="res-location">Localidad</label>
        <input id="res-location" type="text" name="location" value={location} onChange={(e) => {setLocation(e.target.value);setCopied(false)}} placeholder="Municipio" maxLength={100} />
        <div className="res-contact-2col">
          <div><label htmlFor="res-size">Plazas aproximadas</label><select id="res-size" name="size" value={size} onChange={(e)=>{setSize(e.target.value as Size);setCopied(false)}}><option value="">Seleccionar</option><option>Hasta 60</option><option>61–150</option><option>Más de 150</option></select></div>
          <div><label htmlFor="res-need">Interés principal</label><select id="res-need" name="need" value={need} onChange={(e)=>{setNeed(e.target.value as Need);setCopied(false)}}><option value="">Seleccionar</option><option>Programación semanal</option><option>Materiales y fichas</option><option>Formación y asesoramiento</option></select></div>
        </div>
        <label htmlFor="res-note">¿Qué te gustaría mejorar? <span className="res-optional">(opcional)</span></label>
        <textarea id="res-note" name="note" value={note} onChange={(e)=>{setNote(e.target.value);setCopied(false)}} placeholder="Por ejemplo: más variedad o adaptación por unidades" rows={3} maxLength={500} />
        <p className="res-form-privacy">No incluyas nombres, diagnósticos ni datos de residentes. Esta página no almacena ni envía estos campos: «Preparar correo» abre tu aplicación de correo para que lo revises y decidas si enviarlo.</p>
        <div className="res-contact-actions">
          <button className="editorial-btn editorial-btn-primary" type="submit">Preparar correo</button>
          <button className="editorial-btn editorial-btn-secondary" type="button" onClick={copyMessage}>Copiar texto</button>
        </div>
        {copied && <p className="res-copied" role="status">Texto copiado. Puedes pegarlo en tu correo y enviarlo a {contactEmail}.</p>}
      </form>
    </div>
  );
}
