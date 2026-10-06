"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./gracias.css";

export default function ResourceThanksPage() {
  const [state, setState] = useState<"checking"|"ready"|"error">("checking");
  const [message, setMessage] = useState("Verificando el pago y preparando tu descarga…");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id") || "";
    if (!sessionId) {
      setState("error");
      setMessage("No encontramos una compra que verificar.");
      return;
    }
    fetch("/api/resources/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !body?.download_url) throw new Error(body?.error || "No se ha podido preparar la descarga.");
        setDownloadUrl(body.download_url);
        setState("ready");
        setMessage("Pago confirmado. Tu descarga está preparada.");
      })
      .catch((error) => {
        setState("error");
        setMessage(error instanceof Error ? error.message : "No se ha podido verificar la compra.");
      });
  }, []);

  return (
    <main className="resource-thanks-page">
      <section className="resource-thanks-card">
        <p className="resource-thanks-eyebrow">Recursos · Carolina Sánchez</p>
        <h1>{state === "ready" ? "Tu recurso está listo" : state === "error" ? "No hemos podido preparar la descarga" : "Preparando tu compra"}</h1>
        <p>{message}</p>
        {state === "ready" && downloadUrl ? (
          <>
            <a className="resource-thanks-download" href={downloadUrl}>Descargar recurso</a>
            <p className="resource-thanks-note">El enlace es personal y temporal. Si necesitas descargarlo de nuevo durante los próximos días, conserva esta página.</p>
          </>
        ) : null}
        {state === "error" ? <p className="resource-thanks-note">Si el pago se acaba de completar, espera unos segundos y vuelve a cargar esta página.</p> : null}
        <Link className="resource-thanks-back" href="/recursos/">Volver a Recursos</Link>
      </section>
    </main>
  );
}
