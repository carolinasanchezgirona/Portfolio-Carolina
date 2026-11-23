"use client";

import { useRef, useState, type FormEvent, type PointerEvent } from "react";

type DocumentKind = "psychological" | "neuropsychological" | "privacy";
const VERSION = "2026-11-09";
const labels: Record<DocumentKind, string> = {
  psychological: "atención psicológica sanitaria",
  neuropsychological: "atención neuropsicológica",
  privacy: "información sobre protección de datos",
};

export default function LegalSignatureForm({ kind }: { kind: DocumentKind }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [signer, setSigner] = useState<"patient" | "representative">("patient");
  const [representativeName, setRepresentativeName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [scope, setScope] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * element.width / rect.width,
      y: (event.clientY - rect.top) * element.height / rect.height,
    };
  }

  function startDraw(event: PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    event.preventDefault();
    setError("");
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    ctx.strokeStyle = "#243743";
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
  }

  function moveDraw(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    event.preventDefault();
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function finishDraw(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    drawing.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setSignature(event.currentTarget.toDataURL("image/png"));
  }

  function clearDraw() {
    const element = canvas.current;
    element?.getContext("2d")?.clearRect(0, 0, element.width, element.height);
    drawing.current = false;
    setSignature("");
    setError("");
  }

  function prepareCopy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) {
      setError("Marca la declaración correspondiente antes de guardar la copia.");
      return;
    }
    if (kind === "neuropsychological" && !scope) {
      setError("Selecciona la actuación neuropsicológica autorizada.");
      return;
    }
    if (!signature) {
      setError("Dibuja la firma en el recuadro. Si necesitas firmar en papel, utiliza la impresión convencional.");
      canvas.current?.focus();
      return;
    }
    setError("");
    window.print();
  }

  return <section className="legal-sign-form" id="firma-digital">
    <h2>{kind === "privacy" ? "Acuse de recepción de la información" : "Cumplimentación y firma del consentimiento"}</h2>
    <p>{kind === "privacy"
      ? "Este acuse documenta que se ha entregado la información sobre protección de datos. No implica autorización para publicidad, cesiones opcionales ni un consentimiento RGPD general para la asistencia sanitaria."
      : "Cumplimenta este documento después de que la profesional te explique la actuación, los riesgos, las alternativas y resuelva tus dudas. La firma manuscrita en pantalla es una firma electrónica simple, no una firma avanzada ni una verificación automática de identidad."}</p>
    <form className="legal-sign-fields" onSubmit={prepareCopy}>
      <div className="legal-sign-fields-grid">
        <label>Nombre y apellidos de la persona atendida *
          <input value={name} onChange={e => setName(e.target.value)} maxLength={140} autoComplete="name" required />
          <span className="legal-printed-field">{name}</span>
        </label>
        <label>Fecha de nacimiento (opcional)
          <input type="date" value={birth} onChange={e => setBirth(e.target.value)} />
          <span className="legal-printed-field">{birth}</span>
        </label>
        <label>DNI/NIE (si procede)
          <input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} maxLength={25} autoComplete="off" />
          <span className="legal-printed-field">{documentNumber}</span>
        </label>
        <label>Lugar de la firma *
          <input value={place} onChange={e => setPlace(e.target.value)} maxLength={100} required />
          <span className="legal-printed-field">{place}</span>
        </label>
        <label>Fecha de la firma *
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <span className="legal-printed-field">{date}</span>
        </label>
      </div>
      <fieldset>
        <legend>¿Quién firma?</legend>
        <label className="legal-sign-radio"><input type="radio" name="legal-signer" checked={signer === "patient"} onChange={() => setSigner("patient")} /> La persona atendida</label>
        <label className="legal-sign-radio"><input type="radio" name="legal-signer" checked={signer === "representative"} onChange={() => setSigner("representative")} /> Su representante legal acreditado</label>
      </fieldset>
      {signer === "representative" && <div className="legal-sign-fields-grid">
        <label>Nombre y apellidos del representante *
          <input value={representativeName} onChange={e => setRepresentativeName(e.target.value)} maxLength={140} required />
          <span className="legal-printed-field">{representativeName}</span>
        </label>
        <label>Vínculo y representación acreditada *
          <input value={relationship} onChange={e => setRelationship(e.target.value)} maxLength={180} required />
          <span className="legal-printed-field">{relationship}</span>
        </label>
      </div>}
      {kind === "neuropsychological" && <fieldset>
        <legend>Actuación expresamente autorizada *</legend>
        {[
          ["evaluation", "Evaluación neuropsicológica"],
          ["intervention", "Intervención o seguimiento neuropsicológico"],
          ["both", "Ambas actuaciones, según el plan explicado"],
        ].map(([value, label]) => <label className="legal-sign-radio" key={value}>
          <input type="radio" name="neuro-scope" checked={scope === value} onChange={() => setScope(value)} /> {label}
        </label>)}
      </fieldset>}
      <label className="legal-sign-confirm">
        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} required />
        <span>{kind === "privacy"
          ? "Declaro que he recibido o podido consultar la política de privacidad, versión indicada, y conozco los canales para ejercer mis derechos."
          : "He recibido información sobre la " + labels[kind] + ", he podido formular preguntas y consiento libremente en la actuación indicada. Sé que puedo retirar el consentimiento asistencial."}</span>
      </label>
      <div className="legal-sign-printed-confirm">
        {accepted ? "☑" : "☐"} {kind === "privacy"
          ? "Constancia de recepción de información, sin autorización de tratamientos opcionales."
          : "Consentimiento clínico para la actuación indicada."}
        {kind === "neuropsychological" && <p>Alcance: {scope === "evaluation" ? "Evaluación" : scope === "intervention" ? "Intervención" : scope === "both" ? "Evaluación e intervención" : "Sin seleccionar"}</p>}
      </div>
      <div className="legal-signature-capture">
        <strong>Firma de {signer === "patient" ? "la persona atendida" : "la persona representante"}</strong>
        <p className="legal-sign-hint">Dibuja tu firma con el dedo, un lápiz digital o el ratón.</p>
        <canvas ref={canvas} width={760} height={220} tabIndex={0} aria-label="Recuadro para dibujar la firma" onPointerDown={startDraw} onPointerMove={moveDraw} onPointerUp={finishDraw} onPointerCancel={finishDraw} />
        <div className="legal-signature-image">{signature ? <img src={signature} alt="Firma manuscrita incorporada a la copia" /> : <span>Sin firma</span>}</div>
        <div className="legal-sign-controls">
          <button type="button" onClick={clearDraw} className="legal-sign-secondary">Borrar firma</button>
        </div>
      </div>
      <p className="legal-sign-provenance">Documento: {labels[kind]} · Versión {VERSION} · Responsable: Carolina Sánchez Girona (COPC 24892). Esta copia se genera en el navegador y no se envía ni archiva automáticamente.</p>
      {error && <p className="legal-sign-error" role="alert">{error}</p>}
      <div className="legal-sign-controls">
        <button type="submit" className="legal-print">Guardar o imprimir el documento cumplimentado</button>
      </div>
      <p className="legal-sign-hint legal-print-hide">En el diálogo de impresión elige «Guardar como PDF». Envía el archivo por el canal acordado para su revisión y archivo en la historia clínica. La firma dibujada no acredita por sí sola la identidad del firmante ni equivale a firma electrónica avanzada.</p>
    </form>
  </section>;
}
