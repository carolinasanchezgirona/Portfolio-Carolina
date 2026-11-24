"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";

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
  const [assignmentId, setAssignmentId] = useState("");
  const [assignedKind, setAssignedKind] = useState("");
  const [assignmentLoading, setAssignmentLoading] = useState(true);
  const [assignmentError, setAssignmentError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [onsiteToken, setOnsiteToken] = useState("");
  const [signatureMode, setSignatureMode] = useState<"drawn" | "typed">("drawn");
  const [typedName, setTypedName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  useEffect(() => {
    const temporary = /^#presencial=([A-Za-z0-9_-]{40,90})$/.exec(window.location.hash);
    const onsite = temporary?.[1] || "";
    const requestId = new URLSearchParams(window.location.search).get("solicitud");
    if (onsite) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search + "#firma-digital");
      setOnsiteToken(onsite);
    } else if (!requestId) {
      setAssignmentError("Para firmar este documento, abre la solicitud asignada en Mi espacio o el enlace presencial facilitado por la profesional.");
      setAssignmentLoading(false);
      return;
    }
    if (!onsite && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId || "")) {
      setAssignmentError("El enlace no contiene una referencia válida. Abre el documento desde Mi espacio.");
      setAssignmentLoading(false);
      return;
    }
    let cancelled = false;
    setAssignmentLoading(true);
    const url=onsite?"/api/consent/presencial":"/api/patient-portal/consents?id="+encodeURIComponent(requestId||"");
    fetch(url,{cache:"no-store",credentials:"include",
      headers:onsite?{"X-Consent-Presencial":onsite}:{}})
      .then(async response => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw Error(body.error||"No se pudo verificar la asignación.");
        return body;
      })
      .then(body => {
        if (cancelled) return;
        const expected = kind === "psychological" ? ["psicologico"]
          : kind === "privacy" ? ["privacidad"] : ["neuro_evaluacion","neuro_intervencion"];
        if (!expected.includes(body.request?.kind)) throw Error("El documento asignado es distinto. Abre el enlace correcto desde el apartado de consentimientos.");
        if (body.request.status !== "pending") throw Error("Este documento ya está recibido o no admite nuevas firmas.");
        setAssignmentId(body.request.id);
        setAssignedKind(body.request.kind);
        setName(body.patient.name||"");
        setBirth(body.patient.birth_date||"");
        setDocumentNumber(body.patient.national_id||"");
        if (body.request.kind === "neuro_evaluacion") setScope("evaluation");
        if (body.request.kind === "neuro_intervencion") setScope("intervention");
      })
      .catch(e => { if (!cancelled) setAssignmentError(e instanceof Error ? e.message : "No se ha podido comprobar la solicitud."); })
      .finally(() => { if (!cancelled) setAssignmentLoading(false); });
    return () => { cancelled = true; };
  }, [kind]);

  async function sendOtp() {
    if (!assignmentId || onsiteToken || otpBusy) return;
    setOtpBusy(true);
    setOtpMessage("");
    setError("");
    try {
      const response = await fetch("/api/patient-portal/consents",{
        method:"POST",credentials:"include",cache:"no-store",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action:"request_otp",request_id:assignmentId})
      });
      const body=await response.json().catch(()=>({}));
      if(!response.ok) throw Error(body.error||"No se ha podido enviar el código.");
      setOtpCode("");
      setOtpMessage(body.message||"Código enviado al correo de la ficha.");
    }catch(error){setOtpMessage(error instanceof Error?error.message:"No se ha podido enviar el código.");}
    finally{setOtpBusy(false);}
  }

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

  async function prepareCopy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (assignmentLoading || assignmentError || sending || submitted) return;
    if (!accepted) {
      setError("Marca la declaración correspondiente antes de firmar.");
      return;
    }
    if (kind === "neuropsychological" && !scope) {
      setError("Selecciona la actuación neuropsicológica autorizada.");
      return;
    }
    if (signatureMode === "drawn" && !signature) {
      setError("Dibuja la firma en el recuadro.");
      canvas.current?.focus();
      return;
    }
    if(signatureMode === "typed" && (!typedName.trim() || !/^[0-9]{6}$/.test(otpCode.trim()))) {
      setError("Escribe tu nombre completo y confirma el código de seis dígitos recibido por correo.");
      return;
    }
    setError("");
    if (!assignmentId) {
      setError("La firma requiere una solicitud vinculada a la ficha clínica.");
      return;
    }
    setSending(true);
    try {
      const response = await fetch(onsiteToken?"/api/consent/presencial":"/api/patient-portal/consents",{
        method:"POST",cache:"no-store",credentials:"include",
        headers:{"Content-Type":"application/json",...(onsiteToken?{"X-Consent-Presencial":onsiteToken}:{})},
        body:JSON.stringify({
          request_id:assignmentId,name,birth,national_id:documentNumber,place,date,signer,
          representative_name:representativeName,relationship,scope,accepted:true,
          signing_method:signatureMode==="typed"?"typed_email_otp":onsiteToken?"drawn_onsite":"drawn_portal",
          signature_png:signatureMode==="drawn"?signature:"",typed_name:signatureMode==="typed"?typedName:"",
          otp_code:signatureMode==="typed"?otpCode:""
        })
      });
      const body=await response.json().catch(() => ({}));
      if (!response.ok) throw Error(body.error||"No se ha podido entregar el documento.");
      setSubmitted(true);
    }catch(e){setError(e instanceof Error?e.message:"No se ha podido guardar la firma.");}
    finally{setSending(false);}
  }

  return <section className="legal-sign-form" id="firma-digital">
    <h2>{kind === "privacy" ? "Acuse de recepción de la información" : "Cumplimentación y firma del consentimiento"}</h2>
    <p>{kind === "privacy"
      ? "Este acuse documenta que se ha entregado la información sobre protección de datos. No implica autorización para publicidad, cesiones opcionales ni un consentimiento RGPD general para la asistencia sanitaria."
      : "Cumplimenta este documento después de que la profesional te explique la actuación, los riesgos, las alternativas y resuelva tus dudas. La firma manuscrita en pantalla es una firma electrónica simple, no una firma avanzada ni una verificación automática de identidad."}</p>
    {assignmentLoading && <p role="status">Comprobando la asignación de tu ficha clínica…</p>}
    {assignmentError && <p className="legal-sign-error" role="alert">{assignmentError} {!onsiteToken && <a href="/mi-espacio/">Volver a Mi espacio</a>}</p>}
    {assignmentId && !submitted && <p className="legal-sign-linked-note">{onsiteToken ? "Firma presencial: la profesional debe comprobar previamente tu identidad y explicarte la actuación. Este acceso temporal solo sirve para esta solicitud." : "Documento asignado a tu expediente privado. Puedes firmar dibujando tu firma o escribiendo tu nombre y confirmando un código enviado al correo de la ficha."} La firma quedará pendiente de revisión profesional.</p>}
    {submitted && <p className="legal-sign-linked-note" role="status"><strong>Firma recibida correctamente.</strong> El documento se ha incorporado a tu historia clínica como pendiente de validación. {onsiteToken ? "Devuelve el dispositivo a la profesional." : <a href="/mi-espacio/">Volver a Mi espacio</a>}</p>}
    {assignmentId && !submitted && !assignmentLoading && !assignmentError && <form className="legal-sign-fields" onSubmit={prepareCopy}>
      <div className="legal-sign-fields-grid">
        <label>Nombre y apellidos de la persona atendida *
          <input value={name} onChange={e => setName(e.target.value)} maxLength={140} autoComplete="name" readOnly={Boolean(assignmentId)} required />
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
        <label className="legal-sign-radio"><input type="radio" name="legal-signer" checked={signer === "representative"} onChange={() => {setSigner("representative");setSignatureMode("drawn");}} /> Su representante legal acreditado</label>
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
        ].filter(([value]) => !assignedKind || (assignedKind === "neuro_evaluacion" ? value === "evaluation" : assignedKind === "neuro_intervencion" ? value === "intervention" : true)).map(([value, label]) => <label className="legal-sign-radio" key={value}>
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
      {!onsiteToken && signer === "patient" && <fieldset className="legal-sign-mode">
        <legend>¿Cómo quieres firmar?</legend>
        <label className="legal-sign-radio"><input type="radio" name="signature-method" checked={signatureMode==="drawn"} onChange={()=>setSignatureMode("drawn")} /> Dibujar mi firma en pantalla</label>
        <label className="legal-sign-radio"><input type="radio" name="signature-method" checked={signatureMode==="typed"} onChange={()=>setSignatureMode("typed")} /> Escribir mi nombre y verificarlo por correo</label>
      </fieldset>}
      {signatureMode==="drawn" || onsiteToken ? <div className="legal-signature-capture">
        <strong>Firma de {signer === "patient" ? "la persona atendida" : "la persona representante"}</strong>
        <p className="legal-sign-hint">Dibuja tu firma con el dedo, un lápiz digital o el ratón.</p>
        <canvas ref={canvas} width={760} height={220} tabIndex={0} aria-label="Recuadro para dibujar la firma" onPointerDown={startDraw} onPointerMove={moveDraw} onPointerUp={finishDraw} onPointerCancel={finishDraw} />
        <div className="legal-signature-image">{signature ? <img src={signature} alt="Firma manuscrita incorporada a la copia" /> : <span>Sin firma</span>}</div>
        <div className="legal-sign-controls">
          <button type="button" onClick={clearDraw} className="legal-sign-secondary">Borrar firma</button>
        </div>
      </div> : <div className="legal-signature-capture legal-sign-typed">
        <strong>Firma mediante nombre escrito y verificación por correo</strong>
        <p>Escribe tu nombre y apellidos exactamente como figuran en la ficha. Para completar la firma, introduce el código temporal que recibirás en el correo registrado en la consulta.</p>
        <label>Nombre completo como firma *
          <input value={typedName} onChange={e=>setTypedName(e.target.value)} maxLength={160} autoComplete="off" required />
        </label>
        <div className="legal-sign-controls">
          <button type="button" className="legal-sign-secondary" disabled={otpBusy || sending} onClick={()=>void sendOtp()}>{otpBusy?"Solicitando código…":"Enviar código a mi correo"}</button>
        </div>
        {otpMessage && <p role="status" className="legal-sign-hint">{otpMessage}</p>}
        <label>Código de confirmación de seis dígitos *
          <input value={otpCode} onChange={e=>setOtpCode(e.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" pattern="[0-9]{6}" autoComplete="one-time-code" maxLength={6} required />
        </label>
        <p className="legal-sign-hint">El código caduca en diez minutos. No lo compartas. Su verificación añade una evidencia, pero no equivale a una firma electrónica avanzada.</p>
      </div>}
      <p className="legal-sign-provenance">Documento: {labels[kind]} · Versión {VERSION} · Responsable: Carolina Sánchez Girona (COPC 24892). El documento se envía al archivo clínico privado solo cuando pulsas «Firmar y enviar a mi ficha clínica».</p>
      {error && <p className="legal-sign-error" role="alert">{error}</p>}
      <div className="legal-sign-controls">
        <button type="submit" className="legal-print" disabled={assignmentLoading || Boolean(assignmentError) || sending || submitted}>{sending ? "Guardando firma…" : "Firmar y enviar a mi ficha clínica"}</button>
      </div>
      <p className="legal-sign-hint legal-print-hide">La firma se guarda directamente en el expediente privado y será revisada por la profesional. La modalidad de firma no acredita por sí sola la identidad del firmante ni equivale a firma electrónica avanzada.</p>
    </form>}
  </section>;
}
